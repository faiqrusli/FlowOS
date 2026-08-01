# [Feature Name] V[X.X] Release

**Version:** v[X.X]  
**Release Date:** YYYY-MM-DD  
**Release Time:** HH:MM UTC  
**Status:** Scheduled | In Progress | Complete | Rolled Back  
**Release Manager:** [Name]  
**Related documents:**
- [Behavior Contract](../behavior-contract.md)
- [Runbook](../implementation/[feature]-v[X.X]-runbook.md)
- [Acceptance Checklist](../validation/acceptance-checklist-v[X.X].md)

---

## 1. Release Summary

**What's Being Released:**
[Brief description of the feature/changes]

**Version Type:** Major | Minor | Patch | Hotfix

**Target Users:** All users | Beta users | Specific cohort | Internal only

---

## 2. What Shipped

### New Capabilities

- **[Capability 1]:** [Description]
- **[Capability 2]:** [Description]
- **[Capability 3]:** [Description]

### Improvements

- [Improvement 1]
- [Improvement 2]

### Bug Fixes

- [Fix 1]
- [Fix 2]

---

## 3. What Didn't Ship (Deferred)

- **[Deferred item 1]:** [Reason]
- **[Deferred item 2]:** [Reason]

---

## 4. Deployment Details

### Pre-Deployment Checklist

- [ ] Acceptance checklist approved
- [ ] All reviews passed
- [ ] Database migrations prepared
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] Feature flags set (if applicable)
- [ ] Stakeholders notified

### Database Migrations

**Migration Scripts:**
```sql
-- Migration up
[SQL here]
```

**Applied:** [ ] Yes / [ ] No  
**Time:** YYYY-MM-DD HH:MM UTC  
**Duration:** [X minutes]  
**Verified:** [ ] Yes / [ ] No

---

### Deployment Sequence

1. **[HH:MM UTC] Database Migration**
   - Status: [ ] Complete
   - Duration: [X minutes]
   - Issues: None | [Describe]

2. **[HH:MM UTC] API Deployment**
   - Status: [ ] Complete
   - Version: [commit hash]
   - Duration: [X minutes]
   - Issues: None | [Describe]

3. **[HH:MM UTC] Frontend Deployment**
   - Status: [ ] Complete
   - Version: [commit hash]
   - Duration: [X minutes]
   - Issues: None | [Describe]

4. **[HH:MM UTC] Smoke Tests**
   - Status: [ ] Pass / [ ] Fail
   - Issues: None | [Describe]

5. **[HH:MM UTC] Monitoring Check**
   - Status: [ ] Normal / [ ] Issues detected
   - Issues: None | [Describe]

---

## 5. Configuration Changes

### Environment Variables

```
NEW_ENV_VAR=value
UPDATED_ENV_VAR=new_value
```

### Feature Flags

| Flag | Value | Purpose |
|---|---|---|
| `feature_[name]_enabled` | true/false | [Purpose] |

---

## 6. Rollback Plan

### Rollback Triggers

**Automatic Rollback if:**
- Error rate > [X]%
- Response time > [Y]ms
- [Other trigger]

**Manual Rollback if:**
- Critical bug discovered
- Data integrity issue
- [Other reason]

---

### Rollback Procedure

**Time to Rollback:** ~[X] minutes

**Steps:**
1. **Set Feature Flag to Disabled** (if applicable)
   ```bash
   [command]
   ```

2. **Revert Frontend Deployment**
   ```bash
   [command]
   ```

3. **Revert API Deployment**
   ```bash
   [command]
   ```

4. **Rollback Database Migration** (if necessary)
   ```sql
   -- Migration down
   [SQL here]
   ```

5. **Verify Rollback**
   - [ ] Check error rates
   - [ ] Check response times
   - [ ] Run smoke tests

---

## 7. Monitoring and Alerts

### Dashboards

- **Primary Dashboard:** [Link]
- **Feature-Specific Dashboard:** [Link]
- **Error Tracking:** [Link]

### Key Metrics to Watch

| Metric | Target | Alert Threshold |
|---|---|---|
| Error rate | <[X]% | >[Y]% |
| Response time | <[X]ms | >[Y]ms |
| User adoption | >[X]% | <[Y]% |
| [Other metric] | [Target] | [Threshold] |

### Alert Configuration

- [ ] Error rate alert configured
- [ ] Performance alert configured
- [ ] Usage alert configured (optional)

---

## 8. On-Call and Support

### On-Call

**Primary:** [Name] - [Contact]  
**Secondary:** [Name] - [Contact]  
**Duration:** [Start date] to [End date]

### Support Briefing

- [ ] Support team briefed
- [ ] Known issues documented
- [ ] FAQs prepared
- [ ] Escalation path clear

---

## 9. Communication

### Release Notes

**User-Facing Changes:**
[What users will notice]

**Internal Notes:**
[Technical details for team]

---

### Notifications Sent

- [ ] Internal team (Slack/Email)
- [ ] Beta users (if applicable)
- [ ] All users (if applicable)
- [ ] Stakeholders
- [ ] Support team

---

## 10. Post-Deployment Verification

### Immediate Checks (0-1 hours)

- [ ] Feature accessible
- [ ] No error spikes
- [ ] Response times normal
- [ ] Database queries performing well
- [ ] Monitoring working
- [ ] Alerts triggering correctly

**Status:** ✅ Normal | ⚠️ Issues detected | ❌ Critical issues

**Notes:** [Any observations]

---

### 24-Hour Check

**Date/Time:** YYYY-MM-DD HH:MM UTC

- [ ] Error rates normal
- [ ] Performance metrics good
- [ ] User adoption tracking
- [ ] No critical bugs reported

**Status:** ✅ Normal | ⚠️ Issues detected | ❌ Critical issues

**Notes:** [Any observations]

---

## 11. Known Issues at Release

### Issue 1: [Title]

**Severity:** Critical | High | Medium | Low  
**Status:** Known | Workaround available

**Description:** [What's the issue]

**Impact:** [Who/what is affected]

**Workaround:** [If any]

**Fix Plan:** [When/how it will be fixed]

---

## 12. Success Criteria

**From [Success Model](../../01-product/success-model.md):**

| Metric | Target | Measurement Window |
|---|---|---|
| [Metric 1] | [Target] | [Timeframe] |
| [Metric 2] | [Target] | [Timeframe] |

**Review scheduled:** YYYY-MM-DD (7-14 days post-release)

---

## 13. Related Releases

**Depends on:**
- [Feature X] v[Y.Z]

**Enables:**
- [Feature Y] (planned)

**Blocks:**
- None | [Feature Z]

---

## 14. Lessons Learned (Post-Deployment)

**To be filled after release:**

### What Went Well

- [Item 1]
- [Item 2]

### What Could Be Improved

- [Item 1]
- [Item 2]

### Action Items for Next Release

- [ ] [Action 1]
- [ ] [Action 2]

---

## 15. Final Status

**Deployment Status:** ✅ Success | ⚠️ Partial Success | ❌ Failed | 🔄 Rolled Back

**Decision:**
- [ ] Proceed as planned
- [ ] Proceed with monitoring
- [ ] Roll back
- [ ] Roll back partially

**Next Steps:**
- [Step 1]
- [Step 2]

---

## 16. Sign-off

**Release Manager:** [Name]  
**Date:** YYYY-MM-DD  
**Time:** HH:MM UTC

**Deployment Complete:** [ ] Yes / [ ] No  
**Rollback Required:** [ ] Yes / [ ] No  
**Post-Release Review Scheduled:** YYYY-MM-DD
