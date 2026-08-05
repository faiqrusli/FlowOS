import { describe, expect, it } from "vitest";
import {
  getPhase3Capability,
  isPhase3CapabilityAvailable,
} from "@/lib/phase3-capabilities";

describe("Phase 3 capability gates", () => {
  it("keeps migration-backed capabilities unavailable by default", () => {
    expect(getPhase3Capability("nextUpPersistence", {})).toBe("unavailable");
    expect(isPhase3CapabilityAvailable("focusTaskAttribution", {})).toBe(false);
  });

  it("requires explicit verified environment state", () => {
    const environment = {
      NEXT_PUBLIC_FLOWOS_NEXT_UP_QUEUE_VERIFIED: "true",
      NEXT_PUBLIC_FLOWOS_FOCUS_ATTRIBUTION_VERIFIED: "false",
    };

    expect(isPhase3CapabilityAvailable("nextUpPersistence", environment)).toBe(true);
    expect(isPhase3CapabilityAvailable("focusTaskAttribution", environment)).toBe(false);
  });
});

