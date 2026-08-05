import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/workplace/workplace-page-content", () => ({
  WorkplacePageContent: function MockWorkplacePageContent() {
    return null;
  },
}));

import Home from "./page";
import { WorkplacePageContent } from "@/components/workplace/workplace-page-content";

describe("Home route", () => {
  it("renders the interactive workspace as the Today page", () => {
    const page = Home();

    expect((page as { type?: unknown } | undefined)?.type).toBe(
      WorkplacePageContent,
    );
  });
});