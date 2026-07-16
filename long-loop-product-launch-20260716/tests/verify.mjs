import { readFile } from "node:fs/promises";

const requiredFiles = [
  "README.md",
  "docs/research.md",
  "index.html",
  "styles.css",
  "app.js",
  "data/features.json",
  "tests/verify.mjs",
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

const [readme, research, html, styles, app, featureJson, accessibility] = await Promise.all([
  readText("README.md"),
  readText("docs/research.md"),
  readText("index.html"),
  readText("styles.css"),
  readText("app.js"),
  readText("data/features.json"),
  readText("docs/accessibility.md")
]);

const features = JSON.parse(featureJson).features;

for (const tag of ["header", "nav", "main", "section", "aside", "footer"]) {
  assert(new RegExp(`<${tag}[\\s>]`).test(html), `index.html must include semantic <${tag}> content`);
}

assert(/<link\s+rel="stylesheet"\s+href="styles\.css">/.test(html), "index.html must link local styles.css");
assert(/<script\s+src="app\.js"\s+defer><\/script>/.test(html), "index.html must load app.js with defer");
assert(/id="nav-toggle"[^>]+aria-controls="nav-panel"/.test(html), "nav toggle must identify the controlled panel");
assert(/id="nav-toggle"[^>]+aria-expanded="false"/.test(html), "nav toggle must expose aria-expanded");
assert(/class="skip-link"\s+href="#main"/.test(html), "index.html must include a skip link to main content");
assert(/id="feature-grid"[^>]+data-feature-grid/.test(html), "feature grid data hook is required");
assert(/id="feature-status"[^>]+aria-live="polite"/.test(html), "feature status must be an aria-live polite region");
assert((html.match(/class="feature-filter[^"]*"[^>]+aria-pressed=/g) ?? []).length >= 4, "feature filters must expose aria-pressed state");
assert(html.includes("data/features.json") || app.includes('fetch("data/features.json")'), "project must reference structured feature data");

assert(Array.isArray(features), "features.json must include a features array");
assert(features.length >= 6, "features.json must include at least six feature records");

const categories = new Set(features.map((feature) => feature.category));
for (const category of ["risk", "alignment", "readiness"]) {
  assert(categories.has(category), `features.json must include ${category} features`);
  assert(html.includes(`data-filter="${category}"`), `index.html must include a ${category} filter`);
}

for (const feature of features) {
  assert(feature.id && feature.category && feature.categoryLabel && feature.title && feature.description && feature.proof, `feature ${feature.id ?? "unknown"} is missing required fields`);
  assert(/^[a-z0-9-]+$/.test(feature.id), `feature ${feature.id} must use a stable kebab-case id`);
  assert(feature.description.length >= 80, `feature ${feature.id} must include a useful description`);
  assert(feature.proof.length >= 60, `feature ${feature.id} must include useful proof copy`);
}

assert(app.includes('fetch("data/features.json")'), "app.js must fetch structured feature data");
assert(app.includes("createFeatureCard"), "app.js must render feature cards from data");
assert(app.includes("ArrowRight") && app.includes("ArrowLeft"), "app.js must support keyboard arrow navigation for filters");
assert(app.includes("Escape") && app.includes("aria-expanded"), "app.js must support accessible mobile navigation state");
assert(styles.includes(".feature-toolbar") && styles.includes(".feature-filter") && styles.includes(".feature-status"), "styles.css must style feature interactions");
assert(styles.includes("@media (max-width: 980px)") && styles.includes("@media (max-width: 720px)"), "styles.css must include responsive breakpoints");
assert(styles.includes(":focus-visible") && styles.includes("prefers-reduced-motion"), "styles.css must include focus and reduced-motion support");
assert(readme.includes("Usage") && readme.includes("Verification") && readme.includes("Maintenance Notes"), "README.md must document usage, verification, and maintenance");
assert(research.includes("Product Positioning") && research.includes("Launch Page Rationale") && research.includes("Dependency Decision"), "research notes must document positioning, rationale, and dependency decisions");
assert(accessibility.includes("Feature filters") && accessibility.includes("Escape") && accessibility.includes("python3 -m http.server 4173"), "accessibility doc must cover keyboard behavior and local serving");

const combinedAssetReferences = `${html}\n${styles}\n${app}`;
const forbiddenExternalPatterns = [
  /https?:\/\//i,
  /<script[^>]+src=["'](?!app\.js["'])/i,
  /<link[^>]+href=["'](?!styles\.css["'])/i,
  /@import\s+/i,
  /\bcdn\./i,
  /\bnode_modules\b/i
];

for (const pattern of forbiddenExternalPatterns) {
  assert(!pattern.test(combinedAssetReferences), `dependency-free constraint failed for pattern ${pattern}`);
}

console.log("Verification passed: product launch kit structure, data, accessibility basics, and dependency-free constraints are satisfied.");
