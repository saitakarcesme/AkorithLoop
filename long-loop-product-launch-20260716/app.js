const featureGrid = document.querySelector("[data-feature-grid]");
const featureStatus = document.querySelector("#feature-status");
const featureFilters = Array.from(document.querySelectorAll(".feature-filter"));
const navToggle = document.querySelector("#nav-toggle");
const navPanel = document.querySelector("#nav-panel");

let features = [];
let activeFilter = "all";

function setStatus(message) {
  if (featureStatus) {
    featureStatus.textContent = message;
  }
}

function createFeatureCard(feature) {
  const card = document.createElement("article");
  card.className = "feature-card";
  card.dataset.category = feature.category;

  const category = document.createElement("p");
  category.className = "feature-kicker";
  category.textContent = feature.categoryLabel;

  const title = document.createElement("h3");
  title.textContent = feature.title;

  const description = document.createElement("p");
  description.textContent = feature.description;

  const proof = document.createElement("p");
  proof.className = "feature-proof";
  proof.textContent = feature.proof;

  card.append(category, title, description, proof);
  return card;
}

function renderFeatures() {
  if (!featureGrid) return;

  const visibleFeatures = activeFilter === "all"
    ? features
    : features.filter((feature) => feature.category === activeFilter);

  featureGrid.replaceChildren(...visibleFeatures.map(createFeatureCard));

  const activeButton = featureFilters.find((button) => button.dataset.filter === activeFilter);
  const label = activeButton ? activeButton.textContent.trim() : "selected";
  const countLabel = visibleFeatures.length === 1 ? "feature" : "features";
  setStatus(`${visibleFeatures.length} ${label.toLowerCase()} ${countLabel} shown.`);
}

function setActiveFilter(nextFilter) {
  activeFilter = nextFilter;

  featureFilters.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderFeatures();
}

function moveFilterFocus(currentButton, direction) {
  const currentIndex = featureFilters.indexOf(currentButton);
  if (currentIndex === -1) return;

  const nextIndex = (currentIndex + direction + featureFilters.length) % featureFilters.length;
  featureFilters[nextIndex].focus();
}

async function loadFeatures() {
  if (!featureGrid) return;

  try {
    const response = await fetch("data/features.json");
    if (!response.ok) {
      throw new Error(`Feature data request failed with ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.features) || data.features.length === 0) {
      throw new Error("Feature data did not include a populated features array");
    }

    features = data.features;
    renderFeatures();
  } catch (error) {
    setStatus("Feature data could not load. Showing core launch jobs.");
    console.error(error);
  }
}

function syncNavState() {
  if (!navToggle) return;
  navToggle.setAttribute("aria-expanded", String(navToggle.checked));
}

featureFilters.forEach((button) => {
  button.addEventListener("click", () => setActiveFilter(button.dataset.filter));
  button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFilterFocus(button, 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFilterFocus(button, -1);
    }
  });
});

if (navToggle) {
  navToggle.addEventListener("change", syncNavState);
}

if (navPanel && navToggle) {
  navPanel.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle.checked = false;
      syncNavState();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.checked) {
    navToggle.checked = false;
    syncNavState();
    navToggle.focus();
  }
});

syncNavState();
loadFeatures();
