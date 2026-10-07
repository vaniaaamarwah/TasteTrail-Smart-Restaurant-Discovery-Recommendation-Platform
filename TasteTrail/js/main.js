/* ============================================================
   main.js
   Shared helpers used by every page (storage, icons, restaurant
   card builder) + the logic specific to the Home page.
   Loaded on every page AFTER restaurants.js.
   ============================================================ */

/* ---------- inline icon library (outline style, no emoji) ---------- */
const icons = {
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6c0 4.4-8.8 10.4-8.8 10.4S3.2 13 3.2 8.6C3.2 5.6 5.6 3.2 8.6 3.2c1.6 0 3 .7 3.4 1.9.4-1.2 1.8-1.9 3.4-1.9 3 0 5.4 2.4 5.4 5.4Z"/></svg>',
  user:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.4-3.6 4.4-5.6 7.5-5.6s6.1 2 7.5 5.6"/></svg>',
  filter:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>',
  route:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M6 16.8V13a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4"/></svg>',
  star:
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.1 6.6L12 17.6l-5.8 3.1 1.1-6.6-4.8-4.6 6.6-.9L12 2.6Z"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  wifi:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5a15.5 15.5 0 0 1 20 0"/><path d="M5.5 12.5a10.5 10.5 0 0 1 13 0"/><path d="M9 16.5a5.5 5.5 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/></svg>',
  leaf:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16Z"/><path d="M9 15c3-3 5-5 9-9"/></svg>',
  compare:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4"/></svg>',
  arrowRight:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>',
  chevronLeft:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  home:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h12v-9"/></svg>',
  car:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-3l2-5h12l2 5v3"/><rect x="3" y="16" width="18" height="4" rx="1"/><circle cx="7.5" cy="20" r="1.3"/><circle cx="16.5" cy="20" r="1.3"/></svg>'
};

/* ---------- localStorage helpers ---------- */
const STORE_KEYS = { favorites: "tastetrail_favorites", compare: "tastetrail_compare" };

function getFavorites() {
  return JSON.parse(localStorage.getItem(STORE_KEYS.favorites) || "[]");
}

function isFavorite(id) {
  return getFavorites().includes(Number(id));
}

function toggleFavorite(id) {
  id = Number(id);
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter((f) => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem(STORE_KEYS.favorites, JSON.stringify(favs));
  return favs.includes(id);
}

function getCompareList() {
  return JSON.parse(localStorage.getItem(STORE_KEYS.compare) || "[]");
}

const COMPARE_LIMIT = 3;

function isInCompare(id) {
  return getCompareList().includes(Number(id));
}

/* returns { added: bool, list } — refuses beyond the compare limit */
function toggleCompare(id) {
  id = Number(id);
  let list = getCompareList();
  let added;
  if (list.includes(id)) {
    list = list.filter((c) => c !== id);
    added = false;
  } else {
    if (list.length >= COMPARE_LIMIT) {
      return { added: false, list, limitReached: true };
    }
    list.push(id);
    added = true;
  }
  localStorage.setItem(STORE_KEYS.compare, JSON.stringify(list));
  return { added, list };
}

function removeFromCompare(id) {
  const list = getCompareList().filter((c) => c !== Number(id));
  localStorage.setItem(STORE_KEYS.compare, JSON.stringify(list));
  return list;
}

/* ---------- shared restaurant card builder ---------- */
function buildCardHTML(r, layout) {
  const fav = isFavorite(r.id) ? "active" : "";
  const inCompare = isInCompare(r.id) ? "active" : "";
  const rowClass = layout === "row" ? " rcard-row" : "";
  return `
    <article class="rcard${rowClass}" data-id="${r.id}">
      <div class="rcard-media">
        <img class="rimg" src="${placeholderImage(r)}" alt="${r.name}, ${r.cuisine}">
        <button class="compare-toggle-btn ${inCompare}" aria-pressed="${inCompare ? "true" : "false"}" aria-label="${inCompare ? "Remove " + r.name + " from comparison" : "Add " + r.name + " to comparison"}" data-action="compare" data-id="${r.id}">
          ${icons.compare}
        </button>
        <button class="fav-btn ${fav}" aria-pressed="${fav ? "true" : "false"}" aria-label="Save ${r.name} to favourites" data-action="fav" data-id="${r.id}">
          ${icons.heart}
        </button>
        <span class="rcard-category">${r.category}</span>
      </div>
      <div class="rcard-body">
        <h3><a href="restaurant.html?id=${r.id}">${r.name}</a></h3>
        <p class="rcard-cuisine">${r.cuisine}</p>
        <div class="meta-row">
          <span class="stars">★ ${r.rating.toFixed(1)}</span>
          <span class="dot"></span><span>${r.price}</span>
          <span class="dot"></span><span>${r.distance} km</span>
          <span class="dot"></span><span class="${r.open ? "status-open" : "status-closed"}">${r.open ? "Open now" : "Closed"}</span>
        </div>
        <div class="rtags">
          ${r.tags.map((t) => `<span class="rtag">${t}</span>`).join("")}
        </div>
        <div class="rcard-footer">
          <a class="view-link" href="restaurant.html?id=${r.id}">View Details ${icons.arrowRight}</a>
        </div>
      </div>
    </article>`;
}

/* Generates a soft, deterministic SVG placeholder "photo" for a
   restaurant so the project has no dependency on external images. */
function placeholderImage(r) {
  const palette = ["#3e5141", "#b65f43", "#c8a96b", "#6b6558"];
  const color = palette[r.id % palette.length];
  const initials = r.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <rect width="400" height="300" fill="#e6e0d2"/>
    <circle cx="200" cy="150" r="70" fill="${color}" opacity="0.9"/>
    <text x="200" y="162" font-family="Georgia, serif" font-size="46" fill="#fffdf7" text-anchor="middle">${initials}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* delegate favourite clicks for any card rendered on the page */
document.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-action="fav"]');
  if (!btn) return;
  e.preventDefault();
  const id = btn.dataset.id;
  const active = toggleFavorite(id);
  btn.classList.toggle("active", active);
  btn.setAttribute("aria-pressed", active ? "true" : "false");
  document.dispatchEvent(new CustomEvent("favorites:changed"));
});

/* delegate compare-toggle clicks for any card rendered on the page */
document.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-action="compare"]');
  if (!btn) return;
  e.preventDefault();
  const id = btn.dataset.id;
  const result = toggleCompare(id);
  if (result.limitReached) {
    alert(`You can compare up to ${COMPARE_LIMIT} restaurants at a time. Remove one from the Compare page first.`);
    return;
  }
  btn.classList.toggle("active", result.added);
  btn.setAttribute("aria-pressed", result.added ? "true" : "false");
  document.dispatchEvent(new CustomEvent("compare:changed"));
});

/* ---------- keep the navbar "Compare" badge in sync everywhere ---------- */
function updateCompareBadge() {
  const count = getCompareList().length;
  document.querySelectorAll(".compare-badge").forEach((el) => {
    el.textContent = count;
    el.style.display = count ? "flex" : "none";
  });
}
document.addEventListener("DOMContentLoaded", updateCompareBadge);
document.addEventListener("compare:changed", updateCompareBadge);

/* ---------- highlight active nav link ---------- */
(function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .bottom-nav a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
})();

/* ---------- render an SVG mock "map" of markers into a container ---------- */
function renderMockMap(containerEl, list, selectedId, onSelect) {
  if (!containerEl) return;
  const roads = `
    <path class="map-road" d="M0 60 H400"/>
    <path class="map-road" d="M0 160 H400"/>
    <path class="map-road" d="M120 0 V300"/>
    <path class="map-road" d="M280 0 V300"/>
    <path class="map-road-minor" d="M0 110 H400"/>
    <path class="map-road-minor" d="M0 220 H400"/>
    <path class="map-road-minor" d="M200 0 V300"/>
    <rect class="map-block" x="10" y="70" width="90" height="30" rx="2"/>
    <rect class="map-block" x="140" y="10" width="120" height="40" rx="2"/>
    <rect class="map-block" x="300" y="70" width="90" height="80" rx="2"/>
    <rect class="map-block" x="10" y="170" width="90" height="40" rx="2"/>
    <rect class="map-block" x="140" y="170" width="120" height="40" rx="2"/>
    <rect class="map-block" x="300" y="230" width="90" height="55" rx="2"/>`;

  const markers = list
    .map((r) => {
      const selected = Number(r.id) === Number(selectedId) ? "selected" : "";
      return `
      <g class="map-marker ${selected}" data-id="${r.id}" tabindex="0" role="button" aria-label="${r.name}">
        <circle class="pin" cx="${r.lat * 4}" cy="${r.lng * 3}" r="7"/>
        <text x="${r.lat * 4 + 10}" y="${r.lng * 3 + 3}">${r.name}</text>
      </g>`;
    })
    .join("");

  containerEl.innerHTML = `
    <svg class="map-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of nearby restaurants">
      ${roads}
      ${markers}
    </svg>`;

  containerEl.querySelectorAll(".map-marker").forEach((m) => {
    m.addEventListener("click", () => onSelect && onSelect(Number(m.dataset.id)));
    m.addEventListener("keyup", (e) => {
      if (e.key === "Enter") onSelect && onSelect(Number(m.dataset.id));
    });
  });
}

/* ============================================================
   HOME PAGE LOGIC
   (guarded so this file can be safely loaded on every page)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  /* -- hero search redirects to Explore with the typed query -- */
  const heroForm = document.getElementById("hero-search-form");
  if (heroForm) {
    heroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("hero-location").value.trim();
      window.location.href = q
        ? `explore.html?q=${encodeURIComponent(q)}`
        : "explore.html";
    });
  }

  /* -- nearby map + preview card -- */
  const homeMap = document.getElementById("home-map");
  if (homeMap) {
    let selected = restaurants[0].id;
    const preview = document.getElementById("map-preview");

    function paintPreview(id) {
      const r = getRestaurantById(id);
      preview.innerHTML = `
        <p class="rname">${r.name}</p>
        <div class="meta-row">
          <span class="stars">★ ${r.rating.toFixed(1)}</span>
          <span class="dot"></span><span>${r.price}</span>
          <span class="dot"></span><span>${r.distance} km</span>
        </div>
        <p class="rcard-cuisine">${r.cuisine}</p>
        <a class="view-link" href="restaurant.html?id=${r.id}">View Restaurant ${icons.arrowRight}</a>`;
    }

    function paintMap() {
      renderMockMap(homeMap, restaurants.slice(0, 8), selected, (id) => {
        selected = id;
        paintMap();
        paintPreview(id);
      });
    }

    paintMap();
    paintPreview(selected);
  }

  /* -- Local Finds category grid (home preview, links to filtered explore) -- */
  const catGrid = document.getElementById("category-grid");
  if (catGrid) {
    const categories = [
      { name: "Hidden Gem", icon: "leaf", desc: "Quiet spots worth seeking out." },
      { name: "Popular Nearby", icon: "star", desc: "What the neighbourhood loves." },
      { name: "Perfect for Date Night", icon: "heart", desc: "Candlelight and short menus." },
      { name: "Late Night Find", icon: "clock", desc: "Still serving after midnight." },
      { name: "Quiet Corner", icon: "wifi", desc: "Room to think, read or work." },
      { name: "Family Favourite", icon: "home", desc: "Tables built for a crowd." }
    ];
    catGrid.innerHTML = categories
      .map(
        (c) => `
      <a class="category-card" href="explore.html?category=${encodeURIComponent(c.name)}">
        <span class="cat-icon">${icons[c.icon]}</span>
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
      </a>`
      )
      .join("");
  }

  /* -- featured restaurant cards -- */
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    const featured = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 6);
    featuredGrid.innerHTML = featured.map((r) => buildCardHTML(r)).join("");
  }

  /* -- mood-based recommendation picker -- */
  const moodRow = document.getElementById("mood-row");
  const moodResults = document.getElementById("mood-results");
  if (moodRow && moodResults) {
    moodRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".mood-chip");
      if (!chip) return;
      moodRow.querySelectorAll(".mood-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const mood = chip.dataset.mood;
      const matches = restaurants.filter((r) => r.purpose.includes(mood)).slice(0, 3);
      moodResults.innerHTML = matches.length
        ? matches.map((r) => buildCardHTML(r)).join("")
        : `<div class="empty-state"><h3>Nothing matches yet</h3><p>Try another mood, or explore the full list.</p></div>`;
    });
    /* trigger the first mood by default */
    moodRow.querySelector(".mood-chip")?.click();
  }
});
