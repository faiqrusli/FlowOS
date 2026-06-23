"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

function renderInline(text: string): ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={match.index}>{token.slice(2, -2)}</strong>
      );
    } else if (token.startsWith("*")) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const lines = content.split("\n");

  return (
    <div className={cn("prose-notes space-y-2 text-[15px] leading-relaxed", className)}>
      {lines.map((line, index) => {
        if (!line.trim()) return <div key={index} className="h-2" />;

        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-base font-semibold text-foreground">
              {renderInline(line.slice(4))}
            </h3>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-lg font-semibold text-foreground">
              {renderInline(line.slice(3))}
            </h2>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-xl font-semibold text-foreground">
              {renderInline(line.slice(2))}
            </h1>
          );
        }

        if (/^[-*]\s\[[ xX]\]\s/.test(line)) {
          const checked = line[4]?.toLowerCase() === "x";
          const label = line.slice(6);
          return (
            <label
              key={index}
              className="flex items-start gap-2 text-foreground/90"
            >
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="mt-1 size-3.5 rounded border-border"
              />
              <span className={checked ? "line-through opacity-60" : undefined}>
                {renderInline(label)}
              </span>
            </label>
          );
        }

        if (/^[-*]\s/.test(line)) {
          return (
            <li key={index} className="ml-4 list-disc text-foreground/90">
              {renderInline(line.slice(2))}
            </li>
          );
        }

        if (/^\d+\.\s/.test(line)) {
          const text = line.replace(/^\d+\.\s/, "");
          return (
            <li key={index} className="ml-4 list-decimal text-foreground/90">
              {renderInline(text)}
            </li>
          );
        }

        return (
          <p key={index} className="text-foreground/90">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}
