export function createDateChangeDetector(
  readDateKey: () => string,
  onChange: (dateKey: string) => void,
): () => boolean {
  let currentDateKey = readDateKey();

  return () => {
    const nextDateKey = readDateKey();
    if (nextDateKey === currentDateKey) return false;
    currentDateKey = nextDateKey;
    onChange(nextDateKey);
    return true;
  };
}
