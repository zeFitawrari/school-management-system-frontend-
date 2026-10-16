# Wireframes - 10 Highest-Use Screens

Task: T04
Status: proposed (design review pending)
Date: 2026-10-14

Mobile-first. Each screen is described at phone (360), tablet (768) and desktop (1280). ASCII
sketches are indicative, not pixel-accurate. All layouts follow the responsive rulebook
(`docs/ROADMAP.md` section 5): drawer nav on phone, icon rail at tablet, full sidebar at desktop;
stacked cards become tables; sticky action bars with safe-area padding.

Screens: (1) Login, (2) Dashboard, (3) Students list, (4) Student profile, (5) Attendance
marking, (6) Marks entry, (7) Payments, (8) Invoices, (9) Timetable, (10) Landing.

---

## 1. Login

Phone (base): full-width card, brand at top, email + password (16px), show/hide password,
sticky submit above the keyboard, safe-area padding, caps-lock hint.

```
+---------------------------+
|        [brand]            |
|  Welcome back             |
|  [ email               ]  |
|  [ password        (o) ]  |
|  [x] remember   forgot?   |
|  [   Sign in           ]  |  <- sticky
|  footer / language        |
+---------------------------+
```

Tablet (md): centred card `max-width: 440px`, brand panel hidden.
Desktop (lg): split `grid-template-columns: 1fr 1fr`; brand illustration left, form right.

## 2. Dashboard

Phone: single column. Greeting, branch label, KPI cards 1-up (horizontal scroll on quick actions),
recent activity, alerts.

```
+---------------------------+
| [=] Acme Centre  Branch v |
| Hello, Name  [bell][avatar]|
| [ KPI ][ KPI ]            |  <- scroll
| Quick actions ->          |
| Recent activity           |
|  - item                   |
+---------------------------+
| Home Att  Fees  More      |  <- bottom bar
```

Tablet: two-column widget grid. Desktop: 12-column grid, KPI 3-4 up, side-by-side panels.
Widgets adapt via container queries. No role sees a widget it lacks permission for.

## 3. Students list

Phone: stacked cards (photo/initials, name, group, status), filters in a bottom sheet, FAB bottom
-right above the bottom bar.

```
+---------------------------+
| Students            [ + ] |
| [ search... ] [filter]    |
| (AV) Name        Active   |
|      Group 12             |
| (AV) Name        Susp.    |
|  ...                       |
|                   ( + )   |  <- FAB
+---------------------------+
```

Tablet (md): 5 priority columns in a horizontal-scroll container, sticky first column, filters in
a collapsible panel. Desktop: full table 8+ columns, sticky header, inline filters, sort headers,
bulk-select, row action menu (permission-aware).

## 4. Student profile

Phone: collapsed header, horizontally scrollable tab chips, actions in overflow menu.

```
+---------------------------+
| < Student name    [ ... ] |
| (AV) Status  Group        |
| [Overview][Guard][Results]|  <- chips scroll
| summary cards             |
+---------------------------+
```

Tablet: two-column summary header, tabs in one row. Desktop: header left, summary cards right,
side-by-side tab content. Finance/documents tabs hidden for roles without permission.
Active tab in URL.

## 5. Attendance marking

Phone: large 56px rows, segmented status per student, counts summary at top, sticky Submit.

```
+---------------------------+
| < Group / date            |
| Present 24 Abs 2 Late 1   |
| Name        [P][A][L][E]  |
| Name        [P][A][L][E]  |
| ...                       |
| [ Submit attendance ]     |  <- sticky
+---------------------------+
```

Tablet: two-column student grid. Desktop: dense table, keyboard shortcuts (P/A/L), summary panel.
Status uses colour + icon + text. Draft kept client-side until submit (no server calls).

## 6. Marks entry

Phone: one-student-at-a-time mode with Next/Previous. Tablet: scrollable grid, sticky name column.
Desktop: spreadsheet-like grid, Tab/Enter navigation, paste support, invalid cells highlighted
with a text message.

```
+---------------------------+
| < Assessment / group      |
| [Name]   [  /100 ]  Prev  |
|          [  /100 ]  Next  |
| [ Save draft ][ Submit ]  |
+---------------------------+
```

Totals shown come from the server; the client never treats its own math as authority.

## 7. Payments

Phone: numeric keypad, review screen with large amount, one-thumb confirm.

```
+---------------------------+
| Record payment            |
| Invoice #123  Balance 450 |
| Amount [ 450.00 ]         |
| Method [ Cash v ]         |
| [ Review ]                |
| -- review --              |
|       ETB 450.00          |
| [ Confirm payment ]       |  <- sticky, disabled while pending
+---------------------------+
```

Tablet: two-column form + invoice summary. Desktop: side-by-side invoice and payment panel,
keyboard-first. Sends an idempotency key; double-click cannot create duplicates.

## 8. Invoices

Phone: cards with status + balance, filters in a sheet. Tablet: table with priority columns.
Desktop: full table, sticky totals, print preview. Overdue shown with text + icon, not colour
alone. Print stylesheet hides navigation, A4.

## 9. Timetable

Phone: agenda/day view, swipe between days; week view horizontally scrollable. Tablet: week view
5-7 columns. Desktop: full week/month grid, sticky time axis, hover details. Print-friendly via
`@media print`.

```
+---------------------------+
| <  Week of 12 Oct   [Day] |
| Mon Tue Wed Thu Fri       |
| 08:00 | Math | Eng |      |
| 09:00 | Grp A| Grp B|     |
| ...                       |
+---------------------------+
```

Uses CSS grid for slots. Events carry accessible text; drag-and-drop always has a keyboard/button
alternative.

## 10. Landing page

Phone: stacked hero, reduced background, sticky call button. Tablet: two-column sections with
`srcset` images. Desktop: full-width hero, 3-4 column grids, `max-width: 1280px`. `clamp()`
headings, `aspect-ratio` media, animations disabled under reduced motion. SEO meta, Open Graph,
structured data. No app state.

---

## Cross-screen rules

- Every screen has loading (skeleton), empty, error (retry), success and permission-denied states.
- Touch targets >= 44x44px; inputs 16px; fixed bars use `env(safe-area-inset-*)`.
- No horizontal page scroll at 320px.
- Dialogs become bottom sheets on phone (drag handle, `max-height: 90dvh`), centred on tablet+
  (`max-width: 560px`); side drawers 420px on desktop.
- Focus: visible `:focus-visible` ring from tokens; dialogs/drawers trap focus, Escape closes,
  focus returns to opener.
