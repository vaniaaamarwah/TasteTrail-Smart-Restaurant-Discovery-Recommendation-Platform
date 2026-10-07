/* ============================================================
   explore.js
   Search, filter, sort and map interaction for explore.html
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const resultsList = document.getElementById("results-list");
  const resultsCount = document.getElementById("results-count");
  const searchInput = document.getElementById("explore-search");
  const sortSelect = document.getElementById("sort-select");
  const exploreMap = document.getElementById("explore-map");
  const openNowCheck = document.getElementById("filter-open-now");
  const filtersToggle = document.getElementById("filters-toggle");
  const filtersPanel = document.getElementById("filters-panel");

  if (!resultsList) return; // only run on explore.html

  /* state */
  const state = {
    query: "",
    cuisine: "all",
    budget: "all",
    rating: 0,
    distance: 10,
    dietary: "all",
    facility: "all",
    purpose: "all",
    category: "all",
    openNow: false,
    sort: "relevance",
    selectedId: null
  };

  /* read query params from the hero search / category cards */
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) state.query = params.get("q");
  if (params.get("category")) state.category = params.get("category");
  if (params.get("purpose")) state.purpose = params.get("purpose");
  if (searchInput) searchInput.value = state.query;

  /* ---------- build filter option lists dynamically from data ---------- */
  function uniqueValues(mapFn) {
    return [...new Set(restaurants.map(mapFn).flat())].filter(Boolean).sort();
  }

  function buildChipGroup(containerId, values, stateKey) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const chips = ["all", ...values];
    el.innerHTML = chips
      .map(
        (v) =>
          `<button class="chip ${state[stateKey] === v ? "active" : ""}" data-key="${stateKey}" data-value="${v}">${
            v === "all" ? "All" : v
          }</button>`
      )
      .join("");
  }

  buildChipGroup("chips-cuisine", uniqueValues((r) => r.cuisine), "cuisine");
  buildChipGroup("chips-budget", ["₹", "₹₹", "₹₹₹"], "budget");
  buildChipGroup("chips-category", uniqueValues((r) => r.category), "category");
  buildChipGroup("chips-dietary", uniqueValues((r) => r.dietary), "dietary");
  buildChipGroup("chips-facility", uniqueValues((r) => r.facilities), "facility");
  buildChipGroup("chips-purpose", uniqueValues((r) => r.purpose), "purpose");

  document.body.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip || !chip.dataset.key) return;
    state[chip.dataset.key] = chip.dataset.value;
    chip.parentElement.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    render();
  });

  /* rating filter buttons (3+ / 4+ / 4.5+) */
  document.querySelectorAll("[data-min-rating]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = Number(btn.dataset.minRating);
      state.rating = state.rating === val ? 0 : val;
      document.querySelectorAll("[data-min-rating]").forEach((b) => b.classList.remove("active"));
      if (state.rating) btn.classList.add("active");
      render();
    });
  });

  /* distance slider */
  const distanceSlider = document.getElementById("filter-distance");
  const distanceLabel = document.getElementById("distance-label");
  if (distanceSlider) {
    state.distance = Number(distanceSlider.value);
    distanceSlider.addEventListener("input", () => {
      state.distance = Number(distanceSlider.value);
      distanceLabel.textContent = `${state.distance} km`;
      render();
    });
  }

  if (openNowCheck) {
    openNowCheck.addEventListener("change", () => {
      state.openNow = openNowCheck.checked;
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      render();
    });
  }

  if (filtersToggle && filtersPanel) {
    filtersToggle.addEventListener("click", () => filtersPanel.classList.toggle("open"));
  }

  /* clear filters */
  document.getElementById("clear-filters")?.addEventListener("click", () => {
    Object.assign(state, {
      query: "",
      cuisine: "all",
      budget: "all",
      rating: 0,
      distance: 10,
      dietary: "all",
      facility: "all",
      purpose: "all",
      category: "all",
      openNow: false,
      sort: "relevance"
    });
    if (openNowCheck) openNowCheck.checked = false;
    if (searchInput) searchInput.value = "";
    if (distanceSlider) {
      distanceSlider.value = 10;
      distanceLabel.textContent = "10 km";
    }
    if (sortSelect) sortSelect.value = "relevance";
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.value === "all"));
    document.querySelectorAll("[data-min-rating]").forEach((b) => b.classList.remove("active"));
    render();
  });

  /* ---------- filtering + sorting ---------- */
  function getFiltered() {
    const q = state.query.trim().toLowerCase();
    let list = restaurants.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tags.join(" ").toLowerCase().includes(q);
      const matchesCuisine = state.cuisine === "all" || r.cuisine === state.cuisine;
      const matchesBudget = state.budget === "all" || r.price === state.budget;
      const matchesRating = r.rating >= state.rating;
      const matchesDistance = r.distance <= state.distance;
      const matchesDietary = state.dietary === "all" || r.dietary.includes(state.dietary);
      const matchesFacility = state.facility === "all" || r.facilities.includes(state.facility);
      const matchesPurpose = state.purpose === "all" || r.purpose.includes(state.purpose);
      const matchesCategory = state.category === "all" || r.category === state.category;
      const matchesOpen = !state.openNow || r.open;
      return (
        matchesQuery &&
        matchesCuisine &&
        matchesBudget &&
        matchesRating &&
        matchesDistance &&
        matchesDietary &&
        matchesFacility &&
        matchesPurpose &&
        matchesCategory &&
        matchesOpen
      );
    });

    switch (state.sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "distance":
        list.sort((a, b) => a.distance - b.distance);
        break;
      case "price":
        list.sort((a, b) => a.priceLevel - b.priceLevel);
        break;
      case "popularity":
        list.sort((a, b) => b.rating * 10 - a.distance - (a.rating * 10 - b.distance));
        break;
      default:
        // relevance: keep dataset order, but nudge higher-rated items up slightly
        list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }

  /* ---------- render ---------- */
  function render() {
    const list = getFiltered();
    resultsCount.textContent = `${list.length} ${list.length === 1 ? "place" : "places"} found`;

    resultsList.innerHTML = list.length
      ? list.map((r) => buildCardHTML(r, "row")).join("")
      : `<div class="empty-state">
          <h3>No restaurants match yet</h3>
          <p>Try widening your distance, or clearing a filter.</p>
          <button class="btn btn-outline" id="empty-clear">Clear all filters</button>
        </div>`;

    document.getElementById("empty-clear")?.addEventListener("click", () => {
      document.getElementById("clear-filters")?.click();
    });

    if (!state.selectedId || !list.find((r) => r.id === state.selectedId)) {
      state.selectedId = list[0]?.id || null;
    }

    function onMarkerSelect(id) {
      state.selectedId = id;
      renderMockMap(exploreMap, list, id, onMarkerSelect);
      const card = resultsList.querySelector(`[data-id="${id}"]`);
      card?.scrollIntoView({ block: "nearest" });
    }
    renderMockMap(exploreMap, list, state.selectedId, onMarkerSelect);
  }

  render();
});
