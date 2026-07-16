# OpsPilot Product Launch Kit

This directory contains a dependency-free responsive product launch kit for OpsPilot, a workflow intelligence product for launch operations teams. The kit is designed as a static buyer-facing launch experience with structured feature data, useful client-side interactions, accessibility notes, and an automated verification script.

## Structure

- `index.html` defines the semantic launch page: navigation, hero, workflow, features, proof, objections, and final call to action.
- `styles.css` provides the visual system, responsive layout, focus treatment, reduced-motion handling, and component styling.
- `app.js` loads `data/features.json`, renders feature cards, filters feature categories, and synchronizes mobile navigation state.
- `data/features.json` stores structured feature records used by the page and validated by the test script.
- `docs/research.md` captures product launch rationale, audience, message hierarchy, and implementation choices.
- `docs/accessibility.md` documents accessibility decisions, manual checks, and known considerations.
- `tests/verify.mjs` validates required files, structure, data quality, accessibility basics, local asset wiring, and dependency-free constraints.

## Usage

Run these commands from the workspace root:

```sh
cd long-loop-product-launch-20260716
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

The local HTTP server is recommended because `app.js` uses `fetch("data/features.json")`; opening `index.html` directly from disk can block the JSON request in some browsers.

## Verification

Run the automated verification from this project directory:

```sh
node tests/verify.mjs
```

Expected output:

```text
Verification passed: product launch kit structure, data, accessibility basics, and dependency-free constraints are satisfied.
```

Optional whitespace validation from the workspace root:

```sh
git diff --check -- long-loop-product-launch-20260716
```

## Maintenance Notes

- Update feature content in `data/features.json`; the browser UI and verifier both expect each feature to include `id`, `category`, `categoryLabel`, `title`, `description`, and `proof`.
- Keep category values aligned with filter buttons in `index.html`.
- Preserve local `styles.css` and `app.js` links so the kit remains dependency-free and portable.
- Re-run `node tests/verify.mjs` after content, markup, style, or interaction changes.
- See `docs/accessibility.md` before changing keyboard behavior, focus states, headings, or live regions.
