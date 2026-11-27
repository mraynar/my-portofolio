# Design System Specification (GDG Cloud Surabaya Neo-Brutalism)

## 1. Visual Foundation & Design Tokens
The design system implements a controlled neo-brutalist aesthetic inspired by the `devfest.gdgcloudsurabaya.org` event portal: crisp solid borders, hard drop shadows (zero blur), pastel background tints, and the signature Google 4-color palette.

### 1.1 Token Palette Table
| Token Name | Light Mode Value | Dark Mode Value | Usage & Meaning |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F4F5F7` | `#1E1F21` | Page background |
| `--surface` | `#FFFFFF` | `#26272A` | Card & container fill |
| `--surface-alt` | `#D6E2FB` (Blue tint) | `#17263C` (Deep tint) | Highlight cards & active filters |
| `--ink` | `#1F1F1F` | `#F1F1F1` | Primary text & headings |
| `--ink-secondary`| `#3C4043` | `#C4C7C5` | Body prose & secondary labels |
| `--ink-muted` | `#5F6368` | `#A9ACB1` | Timestamps, metadata, captions |
| `--border` | `#1F1F1F` | `#55575B` | Structural card & button outlines |
| `--shadow-color` | `#1F1F1F` | `#000000` | Solid 3px/6px hard drop shadow |
| `--google-blue` | `#1A73E8` | `#8AB4F8` | Primary brand, actions, kickers |
| `--google-red` | `#D93025` | `#F28B82` | Destructive actions, UI/UX category |
| `--google-yellow`| `#F9AB00` | `#FDD663` | Warnings, Mobile category, notice |
| `--google-green` | `#188038` | `#81C995` | Success, Active status, Data category |
| `--tint-blue` | `#D6E2FB` | `#17263C` | Soft blue card background |
| `--tint-red` | `#F9D5D2` | `#381C1D` | Soft red card background |
| `--tint-yellow` | `#FCEFC7` | `#3A3629` | Soft yellow / olive card background |
| `--tint-green` | `#D3EBDD` | `#183324` | Soft green card background |

## 2. Typography System
- **Display Headings**: `Plus Jakarta Sans` or geometric sans flex, weight 700-800, tight tracking (`-0.02em` to `-0.03em`).
  - Hero H1: `clamp(2.5rem, 5.5vw, 4.5rem)` (maximum 2 lines).
  - Section H2: `clamp(2.2rem, 4.2vw, 3.2rem)`.
  - Card Titles H3: `1.25rem` to `1.5rem` (`20px` to `24px`).
- **Kickers / Eyebrows**: Same font, uppercase, weight 800, letter-spacing `0.14em`, size `12px` to `13px`. Default color is `--google-blue`.
- **Body Prose**: `Outfit` or geometric sans, weight 400-500, size `16px` to `17px`, line-height `1.65`, max-width `65ch`.
- **Monospace**: `ui-monospace, SFMono-Regular, Menlo, monospace` reserved strictly for credential IDs, timestamps, and technical slugs.

## 3. Geometry, Elevation & Motion
- **Borders**: `2px solid var(--border)` for standard cards/inputs; `3px solid var(--border)` for hero profile and primary modal cards.
- **Corner Radii**:
  - Main Cards: `32px` (`rounded-[32px]`).
  - Inner Cards & Media Frames: `24px` (`rounded-[24px]`).
  - Inputs & Textareas: `20px` (`rounded-[20px]`).
  - Buttons & Chips: Full pill `9999px` (`rounded-full`).
  - Profile Avatars: Rounded square `24px`.
- **Hard Drop Shadows**: Solid offset with ZERO blur.
  - Buttons / Chips: `3px 3px 0 var(--shadow-color)`.
  - Main Cards: `6px 6px 0 var(--shadow-color)`.
  - Hover State: `translate(-2px, -2px)` with shadow expanding by `2px`.
  - Active State: `translate(2px, 2px)` with shadow reduced to `1px`.
- **Focus Rings**: `3px solid var(--google-blue)` with `2px` offset on all keyboard interactive targets.
- **Transitions**: Smooth `150ms ease` on interactive tokens, honoring `prefers-reduced-motion`.

## 4. Background Pattern Specification
- The page canvas uses a static tiled SVG texture featuring generic alternating code symbols: `< />`, `{ }`, `/`, `;`.
- Opacity: strictly `5%` in light mode, `6%` in dark mode (`--pattern-opacity: 0.05 / 0.06`).
- Behavior: Fixed background tile, `pointer-events: none`, zero animation.
- Controls: Can be disabled (opacity set to `0`) via Admin Site Settings and automatically respects `prefers-contrast: more`.

## 5. Component Inventory & States

### 5.1 Navbar
- Sticky top header (`80px`), bottom border `2px`, logo left `{ mraynar }` with Google dots, navigation links center, CV pill CTA right.
- Active route marked with solid blue underline (`2.5px`) and bold ink weight.
- Hamburger drawer for mobile screens (< 768px).

### 5.2 Profile Card (Hero)
- Soft blue tinted card (`--tint-blue`), border `3px`, shadow `6px`, avatar in rounded square (`24px`), kicker `MEMBER PROFILE`, name max 2 lines, metadata row (`email`, `location`, `university`), pill CTAs.

### 5.3 Pill Tabs / Filter Bar
- Container pill with `2px` border containing tab buttons. Active tab is filled with category color, white text, and solid shadow. Inactive tabs are subtle outline.

### 5.4 Chips & Badges
- Pill shape with `2px` border and leading colored dot (`6px` diameter). Blue, Green, Yellow, and Red semantic variants.

### 5.5 Row Card (Agenda / Experience Style)
- Horizontal card for experience entries: period badge on left, role and organization in center, impact bullets with chevron icon indicators, status chip on right.

### 5.6 Project Card
- Surface card with `16:10` image frame, top category indicator strip (or 4-color Google bar if `featured`), title, summary, key impact callout box, stack chips, and full-width CTA button.

### 5.7 Info Banner
- Blue tinted container (`--tint-blue`), `2px` border, info icon, clean single-line statement (e.g. availability or privacy notice).

### 5.8 Forms & Inputs
- Inputs and textareas with `2px` border, radius `20px`, character counter in bottom-right corner, bold label with required/optional badge.
- Selectable cards: 2-column grid of options with checkmark indicator; selected state gains tinted background and colored border.

### 5.9 Floating Theme & Scroll Controls
- Fixed bottom-right circular buttons (`48px` diameter, `2px` border, `3px` shadow) for dark mode toggle and smooth scroll-to-top.

### 5.10 Iconography & Strict Zero-Emoji Rule
- Primary icon set: Lucide React (`lucide-react`).
- Unified component: `Icon` from `src/components/icons/Icon.jsx`.
- Curated registry: `src/components/icons/registry.jsx` (keys stored in database, not raw SVGs or emojis).
- Size tokens: 16px, 20px, 24px.
- Line weight: uniform 2px (`strokeWidth: 2`), color: `currentColor`.
- STRICTLY FORBIDDEN: emojis and text glyph icons (arrows, stars, checkmarks, bolts, locks) anywhere in the application, database, docs, commits, or reports. All iconography must use the unified SVG `Icon` component.

## 6. Strict Anti-Slop Rules
1. FORBIDDEN: floating particles, stars, diamonds, abstract gradient blobs, parallax, typing text effects, glassmorphism, or text gradients.
2. FORBIDDEN: emojis as category icons, generic stock illustrations, or icon-in-circle decorations.
3. FORBIDDEN: generic marketing cliches ("passionate", "cutting-edge", "high-performance", "frictionless"). All copy must state concrete actions, systems, and measurable outcomes.
4. FORBIDDEN: 3 identical plain cards in all sections. Varied weights (featured 2-column card, 2-column secondary cards) must be used.
5. FORBIDDEN: copying GDG/DevFest proprietary logos, branded stickers, or trademarks. Only the underlying design system is emulated.

## 8. Admin CMS v2.1 Component Patterns
- **BulkActionBar & SelectCheckbox**: Shared neo-brutalist multi-select toolbar placed above every Admin CMS collection grid. Checkboxes stop `mousedown` and `click` propagation so selection never conflicts with card drag-and-drop.
- **Certification Cards**: Display the issuing organization (`issuer`) as the top pill badge with graceful truncation (`max-w-[68%]`), and render the learning platform (`provider`) below the title as `Platform: <provider>`.
- **Home Experience Preview**: Each experience category renders the 2 latest milestones by default with an inline neo-brutalist Show More / Show Less toggle.
