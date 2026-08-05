export type Phase3Capability = "available" | "unavailable";

export type Phase3CapabilityKey =
  | "nextUpPersistence"
  | "focusTaskAttribution";

const ENVIRONMENT_KEYS: Record<Phase3CapabilityKey, string> = {
  nextUpPersistence: "NEXT_PUBLIC_FLOWOS_NEXT_UP_QUEUE_VERIFIED",
  focusTaskAttribution: "NEXT_PUBLIC_FLOWOS_FOCUS_ATTRIBUTION_VERIFIED",
};

/**
 * A capability is available only after the live migration and its verification
 * evidence are supplied. Repository SQL, local fixtures, and a successful
 * import do not enable it.
 */
export function getPhase3Capability(
  key: Phase3CapabilityKey,
  environment: Record<string, string | undefined> = process.env,
): Phase3Capability {
  return environment[ENVIRONMENT_KEYS[key]] === "true"
    ? "available"
    : "unavailable";
}

export function isPhase3CapabilityAvailable(
  key: Phase3CapabilityKey,
  environment?: Record<string, string | undefined>,
): boolean {
  return getPhase3Capability(key, environment) === "available";
}

export const NEXT_UP_UNAVAILABLE_MESSAGE =
  "Next Up order is unavailable until the queue source is applied and verified.";

export const FOCUS_ATTRIBUTION_UNAVAILABLE_MESSAGE =
  "Task attribution is unavailable until the Focus totals source is applied and verified.";

