/* ============================================================
   restaurant.js
   Loads a single restaurant's details based on ?id= in the URL.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("restaurant-detail");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const r = getRestaurantById(id);

  if (!r) {
    root.innerHTML = `
      <div class="empty-state">
        <h3>We couldn't find that place</h3>
        <p>It may have been removed, or the link is incorrect.</p>
        <a class="btn btn-outline" href="explore.html">Back to Explore</a>
      </div>`;
    return;
  }

  document.title = `${r.name} · TasteTrail`;

  /* -------- hero -------- */
  document.getElementById("detail-hero").innerHTML = `
    <div class="detail-media">
      <img src="${placeholderImage(r)}" alt="${r.name}, ${r.cuisine}">
    </div>
    <div class="detail-info">
      <span class="category-pill">${r.category}</span>
      <h1>${r.name}</h1>
      <p class="rcard-cuisine">${r.cuisine}</p>
      <div class="meta-row">
        <span class="stars">★ ${r.rating.toFixed(1)}</span>
        <span class="dot"></span><span>${r.price}</span>
        <span class="dot"></span><span>${r.distance} km away</span>
        <span class="dot"></span><span class="${r.open ? "status-open" : "status-closed"}">${r.open ? "Open now" : "Closed"}</span>
      </div>
      <div class="detail-actions">
        <a class="btn btn-primary" href="#detail-map">${icons.pin} View on Map</a>
        <a class="btn btn-outline" href="#detail-map">${icons.route} Get Route</a>
        <button class="btn btn-outline" id="save-btn" data-id="${r.id}">${icons.heart} <span id="save-label">${
    isFavorite(r.id) ? "Saved" : "Save"
  }</span></button>
        <button class="btn btn-outline" id="compare-btn" data-id="${r.id}">${icons.compare} <span id="compare-label">${
    isInCompare(r.id) ? "In Compare" : "Compare"
  }</span></button>
      </div>
      <p class="detail-desc">${r.description}</p>
    </div>`;

  /* -------- body: about / hours / facilities / menu / map -------- */
  document.getElementById("detail-body").innerHTML = `
    <div class="detail-main">
      <div class="detail-block">
        <h2>About</h2>
        <p class="detail-desc">${r.description}</p>
      </div>
      <div class="detail-block">
        <h2>Menu Highlights</h2>
        <ul class="menu-list">
          ${r.menuHighlights.map((m) => `<li>${m}</li>`).join("")}
        </ul>
      </div>
      <div class="detail-block" id="detail-map-block">
        <h2>Location</h2>
        <div class="map-panel detail-map" id="detail-map"></div>
      </div>
    </div>
    <div class="detail-side">
      <div class="detail-block">
        <h2>Good to Know</h2>
        <ul class="fact-list">
          <li><span class="fact-label">Opening Hours</span><span>${r.openingHours}</span></li>
          <li><span class="fact-label">Price Range</span><span>${r.price}</span></li>
          <li><span class="fact-label">Distance</span><span>${r.distance} km</span></li>
          <li><span class="fact-label">Cuisine</span><span>${r.cuisine}</span></li>
        </ul>
      </div>
      <div class="detail-block">
        <h2>Facilities</h2>
        <div class="pill-list">
          ${r.facilities.map((f) => `<span class="rtag">${f}</span>`).join("")}
        </div>
      </div>
      <div class="detail-block">
        <h2>Dining Purpose</h2>
        <div class="pill-list">
          ${r.purpose.map((p) => `<span class="rtag">${p}</span>`).join("")}
        </div>
      </div>
    </div>`;

  renderMockMap(document.getElementById("detail-map"), [r], r.id, () => {});

  /* -------- save / compare buttons -------- */
  document.getElementById("save-btn").addEventListener("click", () => {
    const active = toggleFavorite(r.id);
    document.getElementById("save-label").textContent = active ? "Saved" : "Save";
  });

  document.getElementById("compare-btn").addEventListener("click", () => {
    const result = toggleCompare(r.id);
    if (result.limitReached) {
      alert(`You can compare up to ${COMPARE_LIMIT} restaurants at a time. Remove one from the Compare page first.`);
      return;
    }
    document.getElementById("compare-label").textContent = result.added ? "In Compare" : "Compare";
    document.dispatchEvent(new CustomEvent("compare:changed"));
  });
});
