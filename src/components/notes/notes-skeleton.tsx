export function NotesSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 lg:flex-row">
      <div className="h-[480px] w-14 rounded-2xl bg-muted/30" />
      <div className="min-h-[480px] flex-1 space-y-4">
        <div className="h-10 w-48 rounded-xl bg-muted/30" />
        <div className="h-[520px] rounded-2xl bg-muted/30" />
      </div>
    </div>
  );
}
