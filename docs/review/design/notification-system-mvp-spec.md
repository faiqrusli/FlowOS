# FlowOS Notification System (MVP)

| | |
|---|---|
| **Document type** | Feature spec |
| **Status** | Proposed — MVP scope |
| **Date** | July 20, 2026 |
| **Related** | `notification_lead_minutes` on `tasks` · [WorkplaceNotificationHost](../../foundation/FEATURE_INVENTORY.md) · Today page |

---

## Overview

The FlowOS Notification System provides lightweight reminders for scheduled tasks and habits. The goal of this MVP is to notify users both **inside FlowOS** and through **desktop/browser notifications** with a simple, consistent experience.

This implementation is intentionally minimal and designed for the initial release. Advanced notification routing, push notifications, notification actions, and background services will be introduced in future versions.

---

## Goals

- Notify users when scheduled tasks or habits are due.
- Support both FlowOS in-app notifications and browser/desktop notifications.
- Keep notifications simple, lightweight, and non-intrusive.
- Allow users to quickly dismiss notifications.
- Demonstrate notification functionality for the FlowOS MVP.

---

## Supported Notifications

Only notifications for **Today's scheduled items** are supported.

### Tasks

- Scheduled Task Reminder
- Scheduled Task Start Time

### Habits

- Scheduled Habit Reminder
- Scheduled Habit Time

Not included in this version:

- Focus session notifications
- Pomodoro notifications
- Break reminders
- Reflection reminders
- Daily review reminders
- Smart notifications
- Push notifications

---

## Notification Trigger

Each scheduled event may generate up to two notification times.

Example:

Task

- Scheduled Time: 8:00 PM
- Reminder: 10 minutes before

Generated events:

- 7:50 PM → Reminder
- 8:00 PM → Start Time

When the current time reaches either event, FlowOS triggers notifications.

---

## Notification Channels

Every notification event triggers **both** notification channels simultaneously.

### 1. FlowOS In-App Notification

A lightweight toast notification appears inside FlowOS.

Example:

```
────────────────────────────
⏰ Task Starting
Finish Software Engineering Report
Dismiss
────────────────────────────
```

Behavior:

- Appears for approximately 5 seconds
- Can be dismissed immediately
- Automatically disappears after timeout
- Added to Notification Center

No additional actions are available.

### 2. Browser/Desktop Notification

At the same time, FlowOS sends a browser notification using the Notification API.

Example:

```
FlowOS
Finish Software Engineering Report
Starts now
```

Behavior:

- Uses the browser Notification API
- Displayed by the operating system
- No action buttons
- Clicking the notification opens FlowOS

---

## Browser Notification Click Behavior

When a browser notification is clicked:

If FlowOS is already open:

- Focus the existing FlowOS tab
- Navigate to the Today page

If FlowOS is not open:

- Open FlowOS
- Navigate directly to the Today page

The notification does **not**:

- Open the task
- Start a focus session
- Scroll to the task

The Today page serves as the central entry point.

---

## Notification Center

Every notification event is stored in the Notification Center regardless of whether it was seen or dismissed.

Example:

```
Today
✓ Database Assignment Reminder
✓ Workout Habit Reminder
✓ Reflection Reminder
```

This provides users with a simple notification history.

---

## User Experience

### User currently inside FlowOS

When a notification is triggered:

- FlowOS toast appears
- Browser notification appears simultaneously

Both notifications may be visible.

### User browsing another tab

- Browser notification appears immediately.
- FlowOS notification is still created internally and recorded in Notification Center.

### Browser minimized

Browser notification appears normally.

---

## Dismiss Behavior

**FlowOS Notification**

- Auto-dismiss after approximately 5 seconds.
- User may dismiss immediately.

**Browser Notification**

- Dismiss behavior is managed by the operating system.
- Clicking opens FlowOS.

---

## Notification Lifecycle

Each notification follows a simple lifecycle.

```
Pending
  ↓
Delivered
  ↓
Dismissed
```

Each notification event should only be delivered once.

Refreshing the page must not trigger the same notification again.

---

## Browser Permission

FlowOS should only request notification permission when the user first creates a scheduled task or scheduled habit that requires notifications.

Do not request permission during onboarding or on first application launch.

---

## Technical Notes

Implementation should use:

- Browser Notification API
- Existing FlowOS toast notification component
- Existing Notification Center

No additional notification framework is required.

---

## Out of Scope (MVP)

The following features are intentionally excluded:

- Push Notifications
- Service Workers
- Background notifications after browser is closed
- Notification actions
- Snooze
- Notification priority
- Quiet hours
- Multi-device synchronization
- Smart reminders

These features will be considered in future releases.

---

## Future Enhancements

Potential improvements include:

- Intelligent notification routing
- Push notifications using Service Workers
- Notification actions
- Snooze functionality
- Quiet hours
- Notification grouping
- Rich notifications
- Cross-device notification synchronization
- AI-powered reminder suggestions

---

## Summary

The MVP notification system prioritizes simplicity over complexity.

When a scheduled task or habit reaches its reminder or scheduled time:

- Display a FlowOS in-app toast notification.
- Display a browser/desktop notification simultaneously.
- Allow quick dismissal.
- Record the event in Notification Center.
- Clicking a browser notification opens the FlowOS Today page.

This implementation provides a reliable notification experience while keeping development effort low and establishing a strong foundation for future notification enhancements.
