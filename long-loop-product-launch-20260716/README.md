# Long Loop Product Launch

OpsPilot is a static product launch page for evaluation-stage buyers and internal launch stakeholders. It presents the product value proposition, workflow preview, proof points, objections, and a final access request CTA.

Milestone 3 completes the page by adding structured feature data, keyboard-accessible feature filtering, final accessibility notes, and a Node verification script.

## Project Files

- `index.html` contains the semantic launch page structure.
- `styles.css` contains responsive layout, focus states, and interaction styling.
- `app.js` loads `data/features.json`, renders feature cards, synchronizes mobile navigation state, and wires keyboard interactions.
- `data/features.json` is the structured feature source used by the page.
- `docs/accessibility.md` documents keyboard and accessibility behavior.
- `tests/verify.mjs` validates final milestone wiring.

## Run Locally

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

## Validate

Run the final milestone verification from this project directory:

```sh
node tests/verify.mjs
```

Expected output:

```text
Verification passed: structured data, keyboard interactions, accessibility docs, and page wiring are present.
```

Optional whitespace validation from the workspace root:

```sh
git diff --check -- long-loop-product-launch-20260716
```

## Accessibility Checks

See `docs/accessibility.md` for the manual keyboard checklist covering skip link visibility, mobile menu behavior, Escape dismissal, feature filter arrow-key movement, and live feature-result status updates.
