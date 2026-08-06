# P7 Evidence — Production Task Drag Behavior

**Evidence ID:** `P7-2026-08-06-TASK-DRAG-01`  
**Date/time:** 2026-08-06 12:31 local  
**Environment:** Production — `https://flowos-sage.vercel.app`  
**Account/fixture class:** Authenticated production report; account/fixture identity not recorded  
**Product date key:** Not recorded; the report explicitly skipped the `Asia/Singapore` date-key check  
**Browser/viewport:** Not recorded; supplied screenshot is redacted to the visible task-board layout  
**Method:** Founder walkthrough report with redacted screenshot; no credentials, task identifiers, or task content were retained.  
**Owner:** Founder / Implementation Engineer

## Scenario results

| Scenario | Result | Limitation |
|---|---|---|
| Same-group manual movement upward before release | `INCONCLUSIVE` | The report did not distinguish direction or provide a browser/viewport. |
| Same-group manual movement downward before release | `INCONCLUSIVE` | The report did not distinguish direction or provide a browser/viewport. |
| Later → Today movement, including setting the date to Today | `BLOCK` | The authenticated report says the move does not work; the expected transition is to set `scheduled_date` to the product date and leave `planning_state` as `none`. |
| Later → organization-group movement without duplicate row | `BLOCK` | The UI shows a “can't change group from Later” behavior, but the report says this cross-group move must be possible. |
| Cross-group movement without duplicate row for non-planning groups | `INCONCLUSIVE` | No redacted result was supplied for this separate case. |
| Sorted, Today, Later, planning, and completed destinations excluded | `INCONCLUSIVE` | Destination-by-destination result was not supplied. |
| Cancellation and repeated-target no-op | `INCONCLUSIVE` | Result was not supplied. |
| Persistence after drop | `INCONCLUSIVE` | Result after reload was not supplied. |
| Failed-write rollback and no duplicate rows | `INCONCLUSIVE` | No controlled failed-write result was supplied. |

## Reported visual concern

The supplied redacted screenshot shows a visible blank interval between Today task rows. Its cause and acceptance impact were not established from the screenshot alone; preserve it as a follow-up concern rather than infer a layout defect.

The report did not indicate data loss or an account/owner boundary crossing. Repository reorder tests remain automated evidence only and do not substitute for this production observation. This record does not close `G3-03`.

## Focused fix verification — 2026-08-06

The authorized local fix now permits Later-originated tasks to move to an organization group and preserves the existing Later → Today projection, including assignment of the selected product date. Today-originated tasks remain restricted to the planning destinations. This is repository evidence only; the production deployment has not been retested after the change.

| Check | Result |
|---|---|
| Regression reproducer before fix | `FAIL` — Later task remained in the Later projection instead of moving to the organization group. |
| Focused task-board persistence suite after fix | `PASS` — 4 tests, including Later → organization group, Later → Today date assignment, and failed-write propagation. |
| Full repository suite after fix | `PASS` — 299 tests across 35 files with placeholder Supabase environment values. |
| TypeScript, lint, production build, and diff check | `PASS` — strict TypeScript, zero-warning lint, 24-route build, and no whitespace errors. |

**Retest limitation:** The authenticated production report remains the source of truth for the `BLOCK` result until the merged deployment is rebuilt and the Later → Today and Later → organization-group scenarios are repeated with the approved fixture. No Gate 3 criterion is closed by this local fix.