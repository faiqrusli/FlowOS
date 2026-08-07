-- Atomically replace the child entries for one owner-owned reflection.
-- Apply after reflections.sql, reflection_entries.sql, and auth_migration.sql.

create or replace function replace_reflection_entries(
  p_reflection_id uuid,
  p_entries jsonb
)
returns setof reflection_entries
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if jsonb_typeof(p_entries) <> 'array' then
    raise exception 'Reflection entries must be an array';
  end if;

  perform 1
    from reflections
   where id = p_reflection_id
     and user_id = v_user_id
   for update;

  if not found then
    raise exception 'Reflection not found';
  end if;

  delete from reflection_entries
   where reflection_id = p_reflection_id
     and user_id = v_user_id;

  return query
  insert into reflection_entries (
    id,
    reflection_id,
    user_id,
    title,
    content
  )
  select
    entry.id,
    p_reflection_id,
    v_user_id,
    trim(entry.title),
    coalesce(entry.content, '')
  from jsonb_to_recordset(p_entries) as entry(
    id uuid,
    title text,
    content text
  )
  where trim(entry.title) <> ''
  returning *;
end;
$$;

revoke all on function replace_reflection_entries(uuid, jsonb) from public, anon;
grant execute on function replace_reflection_entries(uuid, jsonb) to authenticated;
notify pgrst, 'reload schema';
