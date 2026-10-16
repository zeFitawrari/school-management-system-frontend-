# Iconography and Illustration

Task: T04
Status: proposed
Date: 2026-10-14

## Icon set

Use **Lucide** (`lucide-react`) - already in the agreed stack (no new dependency).

Rules:
- Sizes: `16` (inline/small), `20` (default in buttons/inputs), `24` (nav/headers), `32+` (empty
  states). Driven by `width`/`height` and `currentColor`.
- Stroke width: 2 default, 1.5 for large decorative icons.
- Colour inherits from text (`currentColor`); never hard-code an icon colour.
- Icon-only buttons MUST have an accessible name (`aria-label` or visually hidden text).
- Decorative icons get `aria-hidden="true"` and `focusable="false"`.
- Directional icons (chevrons, arrows, back) mirror under RTL only if RTL is introduced later.

Common mappings (Lucide names):

| Concept | Icon |
|---------|------|
| Dashboard | `LayoutDashboard` |
| Students | `GraduationCap` |
| Parents | `Users` |
| Tutors | `UserCog` / `Presentation` |
| Groups | `Boxes` |
| Courses | `BookOpen` |
| Curriculum | `Library` |
| Packages | `Package` |
| Enrollments | `ClipboardList` |
| Scheduling | `Calendar` |
| Attendance | `CalendarCheck` |
| Examinations | `ClipboardCheck` |
| Assignments | `FileText` |
| Finance | `Wallet` |
| Payroll | `Banknote` |
| Library | `BookMarked` |
| Communications | `Megaphone` / `Bell` |
| Reports | `BarChart3` |
| Users & roles | `ShieldCheck` |
| Audit | `ScrollText` |
| Settings | `Settings` |
| Search | `Search` |
| Filter | `SlidersHorizontal` |
| Add | `Plus` |
| More actions | `MoreVertical` |
| Notifications | `Bell` |
| Branch | `Building2` |
| Locked | `Lock` |
| Success | `CheckCircle2` |
| Warning | `AlertTriangle` |
| Danger/Error | `AlertCircle` |
| Info | `Info` |

Status indicators always combine icon + text (e.g. locked row = `Lock` + "Locked").

## Illustration style

- Empty and error states use **simple line illustrations** derived from Lucide geometry in the
  brand palette (navy/accent) on the surface colour, respecting light/dark tokens.
- Size scales with `clamp(120px, 40vw, 220px)` on phone and up to ~280px on desktop.
- No raster assets until brand illustrations are supplied; this keeps the bundle small and the
  look consistent. Replace later by dropping assets into the same slots.
- Animations (if any) are subtle and disabled under `prefers-reduced-motion`.

## Avatars

- Photo if available, else initials fallback on a token-coloured circle (deterministic colour from
  the name hash; ensure text contrast AA).
- `alt` text always present; lazy-loaded with `loading="lazy"`.

## Open

- Brand illustration pack not yet supplied; using the geometric placeholder style above.
- Final Amharic (Ge'ez) font selection deferred to T18 (font is a dependency decision).
