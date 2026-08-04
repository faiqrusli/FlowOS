export type ReflectionAutosaveController<T> = {
  schedule: (value: T) => void;
  flush: () => Promise<void>;
  cancel: () => void;
  isDirty: () => boolean;
};

export function createReflectionAutosaveController<T>(
  save: (value: T) => Promise<unknown>,
  options: {
    delayMs?: number;
    onSaved?: (hasPendingDraft: boolean, value: T) => void;
    onError?: (error: unknown) => void;
  } = {},
): ReflectionAutosaveController<T> {
  const delayMs = options.delayMs ?? 400;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let latest: T | undefined;
  let dirty = false;
  let saving = false;
  let activeSave: Promise<void> | null = null;

  function clearTimer() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  function schedule(value: T) {
    latest = value;
    dirty = true;
    clearTimer();
    timer = setTimeout(() => {
      timer = null;
      void run();
    }, delayMs);
  }

  async function run(): Promise<void> {
    if (saving || !dirty || latest === undefined) return;

    saving = true;
    const value = latest;
    dirty = false;
    const request = (async () => {
      let saved = false;
      try {
        await save(value);
        saved = true;
      } catch (error) {
        dirty = true;
        options.onError?.(error);
      } finally {
        saving = false;
        activeSave = null;
        if (dirty && latest !== value) schedule(latest as T);
        if (saved) options.onSaved?.(dirty, value);
      }
    })();
    activeSave = request;
    await request;
  }

  return {
    schedule,
    async flush() {
      clearTimer();
      if (saving) {
        await activeSave;
      }
      if (dirty) await run();
    },
    cancel() {
      clearTimer();
      latest = undefined;
      dirty = false;
    },
    isDirty: () => dirty || saving,
  };
}