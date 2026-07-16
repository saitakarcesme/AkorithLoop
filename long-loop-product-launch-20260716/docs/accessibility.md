# Accessibility Notes

This document records the accessibility decisions and checks for the static OpsPilot product launch kit.

## Implemented Support

- The skip link targets `#main` and becomes visible on keyboard focus.
- The mobile navigation toggle exposes `aria-controls` and keeps `aria-expanded` synchronized through `app.js`.
- The mobile menu closes after a navigation link is selected and can be dismissed with `Escape`.
- Feature filters are native `<button>` controls with `aria-pressed` state.
- Feature filters support `ArrowLeft`, `ArrowRight`, `ArrowUp`, and `ArrowDown` focus movement.
- Feature results are announced through an `aria-live="polite"` status region.
- Feature cards are rendered from `data/features.json`, keeping interactive content backed by structured data.
- Existing focus styles use `:focus-visible` with a high-contrast outline.
- Reduced-motion preferences are respected through the existing `prefers-reduced-motion` media query.
- The page uses native landmarks and semantic elements including `header`, `nav`, `main`, `section`, `aside`, `footer`, lists, headings, and buttons.
- The color system avoids relying on color alone for key navigation or filtering state; active filters also expose `aria-pressed`.

## Manual Review Checklist

1. Start a local server from this directory with `python3 -m http.server 4173`.
2. Open `http://127.0.0.1:4173/`.
3. Press `Tab` from the address bar and confirm the skip link appears before navigation.
4. At mobile width, focus the menu toggle, press `Space`, confirm the menu opens, then press `Escape` and confirm focus returns to the toggle.
5. Tab to the feature filters, press arrow keys to move between filters, and press `Enter` or `Space` to filter cards.
6. Confirm the feature status text updates after filtering.
7. Resize below 720px and confirm navigation, preview panels, feature cards, workflow steps, and footer stack without overlap.
8. Run `node tests/verify.mjs` and confirm the automated checks pass.

## Known Constraints

- The page is static and has no form submission flow beyond the mailto access link.
- Browser `fetch()` usually requires serving the directory over HTTP, so local validation should use the documented Python server command instead of opening `index.html` directly from disk.
- Automated checks validate accessibility basics and required hooks; they do not replace a browser-based assistive technology pass.
