"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-4 py-4">
      <div
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
        role="alert"
      >
        <p className="text-sm font-medium text-destructive">
          Something went wrong
        </p>
        <p className="mt-1 text-sm text-destructive/90">
          We could not load this page. Try again or return to Today.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => reset()}>
          Try again
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Back to Today
        </Button>
      </div>
    </div>
  );
}
