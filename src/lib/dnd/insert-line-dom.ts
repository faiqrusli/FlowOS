import type { DropBeforeId } from "@/lib/list-drag-utils";

type InsertLineHost = {
  root: HTMLElement;
  line: HTMLElement;
};

const hosts = new Map<string, InsertLineHost>();

export function registerTaskBoardInsertLineHost(
  groupId: string,
  root: HTMLElement,
  line: HTMLElement
) {
  hosts.set(groupId, { root, line });
}

export function unregisterTaskBoardInsertLineHost(groupId: string) {
  hosts.delete(groupId);
}

export function hideAllTaskBoardInsertLines() {
  for (const host of hosts.values()) {
    host.line.style.display = "none";
  }
}

export function paintTaskBoardInsertLine(
  groupId: string,
  beforeTaskId: DropBeforeId,
  visible: boolean
) {
  const host = hosts.get(groupId);
  if (!host) return;

  const { root, line } = host;
  if (!visible) {
    line.style.display = "none";
    return;
  }

  const rootRect = root.getBoundingClientRect();
  let y = rootRect.top;

  if (beforeTaskId) {
    const anchor = root.querySelector<HTMLElement>(
      `[data-task-row="${beforeTaskId}"]`
    );
    if (anchor) {
      y = anchor.getBoundingClientRect().top;
    }
  } else {
    const rows = root.querySelectorAll<HTMLElement>("[data-task-row]");
    const last = rows[rows.length - 1];
    if (last) {
      y = last.getBoundingClientRect().bottom;
    } else {
      y = rootRect.top + 8;
    }
  }

  line.style.display = "block";
  line.style.transform = `translateY(${y - rootRect.top}px)`;
}
