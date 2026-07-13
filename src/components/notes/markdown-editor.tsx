"use client";

import { useRef } from "react";
import {
  Bold,
  Eye,
  EyeOff,
  Heading2,
  Italic,
  List,
  ListChecks,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownPreview } from "@/components/notes/markdown-preview";
import { insertMarkdown, wrapLines } from "@/lib/notes-utils";
import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  preview?: boolean;
  onPreviewChange?: (preview: boolean) => void;
  placeholder?: string;
  className?: string;
};

export function MarkdownEditor({
  value,
  onChange,
  preview = false,
  onPreviewChange,
  placeholder = "Start writing...",
  className,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyTransform(
    transform: (
      val: string,
      start: number,
      end: number
    ) => { next: string; cursor: number }
  ) {
    const el = textareaRef.current;
    if (!el) return;
    const { next, cursor } = transform(
      value,
      el.selectionStart,
      el.selectionEnd
    );
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-border/40 px-2 py-1.5">
        <ToolbarButton
          label="Heading"
          onClick={() =>
            applyTransform((val, start, end) =>
              wrapLines(val, start, end, "## ")
            )
          }
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Bold"
          onClick={() =>
            applyTransform((val, start, end) =>
              insertMarkdown(val, start, end, "**", "**")
            )
          }
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          onClick={() =>
            applyTransform((val, start, end) =>
              insertMarkdown(val, start, end, "*", "*")
            )
          }
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          onClick={() =>
            applyTransform((val, start, end) =>
              wrapLines(val, start, end, "- ")
            )
          }
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          onClick={() =>
            applyTransform((val, start, end) => {
              const selected = val.slice(start, end) || "item";
              const lines = selected.split("\n");
              const wrapped = lines
                .map((line, i) => `${i + 1}. ${line}`)
                .join("\n");
              const next = val.slice(0, start) + wrapped + val.slice(end);
              return { next, cursor: start + wrapped.length };
            })
          }
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Checklist"
          onClick={() =>
            applyTransform((val, start, end) =>
              wrapLines(val, start, end, "- [ ] ")
            )
          }
        >
          <ListChecks className="size-3.5" />
        </ToolbarButton>

        {onPreviewChange && (
          <>
            <span
              aria-hidden
              className="mx-0.5 h-4 w-px shrink-0 bg-border/60"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs"
              onClick={() => onPreviewChange(!preview)}
            >
            {preview ? (
              <>
                <EyeOff className="size-3.5" /> Edit
              </>
            ) : (
              <>
                <Eye className="size-3.5" /> Preview
              </>
            )}
          </Button>
          </>
        )}
      </div>

      {preview ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <MarkdownPreview content={value || "*Nothing to preview yet.*"} />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-0 flex-1 resize-none overflow-y-auto bg-surface-base px-5 py-4 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
    >
      {children}
    </button>
  );
}
