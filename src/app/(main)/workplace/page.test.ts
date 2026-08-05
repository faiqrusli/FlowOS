import { describe, expect, it, vi } from "vitest";

import WorkplacePage from "./page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { redirect } from "next/navigation";

describe("Workplace route", () => {
  it("redirects the legacy route to the canonical Today page", () => {
    WorkplacePage();

    expect(redirect).toHaveBeenCalledWith("/");
  });
});