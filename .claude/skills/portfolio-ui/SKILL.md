---
name: portfolio-ui
description: Procedures for constructing neo-brutalist UI components matching docs/DESIGN.md tokens and accessibility standards.
---
# Procedure: Constructing Portfolio UI Components
1. **Tokens**: Import variables exclusively from `docs/DESIGN.md` (`--bg-canvas`, `--surface`, `--border`, `--shadow-color`). Never hardcode hex values.
2. **Elevation**: Apply `2px` border (or `3px` for main cards), zero-blur solid shadow (`3px 3px 0` or `6px 6px 0`). Add hover `translate(-2px, -2px)`.
3. **Typography**: Use display sans for headers (`tight tracking`), kicker uppercase `12-13px` (`0.14em tracking`), and body prose `16-17px`.
4. **States**: Define default, hover, active, disabled, and keyboard focus (`3px solid var(--google-blue)` with offset).
5. **Theme**: Verify contrast in both light and dark modes against WCAG AA standards.
6. **Limits**: Keep component files under 300 lines of code. Run `npm run check:comments` and `npm run lint` upon completion.
