# Cross-group → Manual drag pipeline debug

Dev-only instrumentation for tracing where task order diverges from the drop preview when moving a task **from any group into a Manual-sorted group**.

## Quick start

1. Run the app in **development** (`npm run dev`). Logging is off in production.
2. Open **DevTools → Console**.
3. Filter by: `cross-group-manual`
4. Drag a task from one column into a **Manual** column and drop it.
5. Expand the collapsed groups. Each stage shows **Matches Preview: YES/NO**.

## What gets traced

Only this drop type:

- **Cross-group** (source column ≠ destination column)
- **Active zone** (not completed section)
- **Manual** destination sort mode

Same-group manual reorders and drops into Priority/Created/etc. columns are not traced.

## Pipeline stages

| Stage | Where | What it checks |
|-------|--------|----------------|
| `1. PREVIEW (live)` | `maybeLogPreviewStage` in `tasks-board-view.tsx` | Live pointer position while dragging |
| `TRACE START` | `beginCrossGroupManualTrace` on drop commit | Preview vs frozen `beforeTaskId`, contract **expected order** |
| `3. BEFORE moveTaskInBoard()` | `tasks-board-view.tsx` | Board state before mutation |
| `moveTaskInBoard: after strip…` | `task-drag-utils.ts` | After removing task from all groups |
| `moveTaskInBoard: after insertTaskIntoGroup…` | `task-drag-utils.ts` | After manual insert; compare `insertedMovingSortOrder` vs `nextTaskSortOrderFromSource` |
| `moveTaskInBoard: after withOrgMove map` | `task-drag-utils.ts` | Full board after destination insert |
| `moveTaskInBoard: after today-column sync` | `task-drag-utils.ts` | After Today column sync (only if Today column exists) |
| `4. AFTER moveTaskInBoard()` | `tasks-board-view.tsx` | Final displayed order in destination |
| `5–6. computeManualReorderUpdates` | `task-drop-target.ts` | Input/output of manual order computation |
| `6b. applyManualActiveInsertToGroup` | `task-drop-target.ts` | After apply to group |
| `7. AFTER React render` | `tasks-board-view.tsx` | Rendered board state + **TRACE SUMMARY** |

The **contract** is `expectedOrder`: destination task ids with the moving task inserted at the frozen `beforeTaskId`. Every stage should match it.

## How to read a trace

1. Find **`TRACE START`** — note `traceId` and **Contract expected order** (short ids joined with `→`).
2. Open each collapsed stage. Look for the first **Matches Preview: NO**.
3. **`DIVERGENCE DETECTED`** marks the first mismatch; `divergenceStage` is stored in the summary.
4. Compare **Expected** vs **Actual** order lines in that group.

### Useful fields inside `moveTaskInBoard` steps

- `destinationDisplayedOrder` — what the UI would show (sorted active list)
- `destinationRawTaskIds` — raw `group.tasks` array order (active + completed)
- `destinationSortOrders` — `sort_order` per task (manual sort key)
- `insertedMovingSortOrder` — order assigned by manual insert
- `nextTaskSortOrderFromSource` — stale order from source task **before** insert (should not win)

## Investigation result (2025-06)

**First divergence:** `4. AFTER moveTaskInBoard()` (and substage `after today-column sync` when Today column exists).

**Root cause:** After `insertTaskIntoGroup` correctly set `sort_order`, the Today-column sync block replaced the moved task with `nextTask` (built from the source task), restoring the **old `sort_order`**.

**Fix:** `task-drag-utils.ts` — non-Today groups are left unchanged after `withOrgMove`; only the Today column is synced.

## Source files

| File | Role |
|------|------|
| `src/lib/task-drag-pipeline-debug.ts` | All logging helpers (this doc's companion) |
| `src/components/tasks/tasks-board-view.tsx` | Starts trace on commit; stages 3, 4, 7 |
| `src/lib/task-drag-utils.ts` | `moveTaskInBoard` substeps |
| `src/lib/task-drop-target.ts` | Stages 5–6b inside `applyManualActiveInsertToGroup` |

## Disable or remove later

- **Temporary off in dev:** set `ENABLED = false` at top of `task-drag-pipeline-debug.ts`.
- **Remove:** delete `task-drag-pipeline-debug.ts`, this `.md` file, and imports/calls in the three files above.

## Persisting logs from a session

Console output is not saved automatically. To keep a trace:

1. Right-click a log group → **Save as…** (browser-dependent), or
2. Copy the **TRACE SUMMARY** block into a note/issue, or
3. Enable **Preserve log** in DevTools before reproducing.

## Chat / agent context

If using Cursor, prior investigation may be in agent transcripts for this repo. Search transcripts for `cross-group-manual` or `moveTaskInBoard`.
