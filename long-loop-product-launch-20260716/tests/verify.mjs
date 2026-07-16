import { readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "data/features.json",
  "docs/accessibility.md"
];

async function readText(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of requiredFiles) {
  const text = await readText(file);
  assert(text.trim().length > 0, `${file} must not be empty`);
}

const [html, styles, app, featureJson, accessibility] = await Promise.all([
  readText("index.html"),
  readText("styles.css"),
  readText("app.js"),
  readText("data/features.json"),
  readText("docs/accessibility.md")
]);

const features = JSON.parse(featureJson).features;

assert(/<script\s+src="app\.js"\s+defer><\/script>/.test(html), "index.html must load app.js with defer");
assert(/id="nav-toggle"[^>]+aria-controls="nav-panel"/.test(html), "nav toggle must identify the controlled panel");
assert(/id="nav-toggle"[^>]+aria-expanded="false"/.test(html), "nav toggle must expose aria-expanded");
assert(/id="feature-grid"[^>]+data-feature-grid/.test(html), "feature grid data hook is required");
assert(/id="feature-status"[^>]+aria-live="polite"/.test(html), "feature status must be an aria-live polite region");
assert((html.match(/class="feature-filter[^"]*"[^>]+aria-pressed=/g) ?? []).length >= 4, "feature filters must expose aria-pressed state");

assert(Array.isArray(features), "features.json must include a features array");
assert(features.length >= 6, "features.json must include at least six feature records");

const categories = new Set(features.map((feature) => feature.category));
for (const category of ["risk", "alignment", "readiness"]) {
  assert(categories.has(category), `features.json must include ${category} features`);
  assert(html.includes(`data-filter="${category}"`), `index.html must include a ${category} filter`);
}

for (const feature of features) {
  assert(feature.id && feature.category && feature.categoryLabel && feature.title && feature.description && feature.proof, `feature ${feature.id ?? "unknown"} is missing required fields`);
}

assert(app.includes('fetch("data/features.json")'), "app.js must fetch structured feature data");
assert(app.includes("createFeatureCard"), "app.js must render feature cards from data");
assert(app.includes("ArrowRight") && app.includes("ArrowLeft"), "app.js must support keyboard arrow navigation for filters");
assert(app.includes("Escape") && app.includes("aria-expanded"), "app.js must support accessible mobile navigation state");
assert(styles.includes(".feature-toolbar") && styles.includes(".feature-filter") && styles.includes(".feature-status"), "styles.css must style feature interactions");
assert(accessibility.includes("Feature filters") && accessibility.includes("Escape") && accessibility.includes("python3 -m http.server 4173"), "accessibility doc must cover keyboard behavior and local serving");

console.log("Verification passed: structured data, keyboard interactions, accessibility docs, and page wiring are present.");
