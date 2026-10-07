/* ============================================================
   local-finds.js
   Category grid + filtered restaurant list for local-finds.html
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("category-grid-full");
  const lfGrid = document.getElementById("lf-grid");
  const heading = document.getElementById("lf-heading");
  if (!grid || !lfGrid) return;

  const categories = [
    { name: "Hidden Gem", icon: "leaf", desc: "Quiet spots worth seeking out." },
    { name: "Popular Nearby", icon: "star", desc: "What the neighbourhood loves." },
    { name: "Perfect for Date Night", icon: "heart", desc: "Candlelight and short menus." },
    { name: "Late Night Find", icon: "clock", desc: "Still serving after midnight." },
    { name: "Quiet Corner", icon: "wifi", desc: "Room to think, read or work." },
    { name: "Family Favourite", icon: "home", desc: "Tables built for a crowd." }
  ];

  function paint(category) {
    heading.textContent = category;
    const matches = restaurants.filter((r) => r.category === category);
    lfGrid.innerHTML = matches.length
      ? matches.map((r) => buildCardHTML(r)).join("")
      : `<div class="empty-state"><h3>Nothing here yet</h3><p>Try another category.</p></div>`;
    grid.querySelectorAll(".category-card").forEach((c) => {
      c.classList.toggle("active-category", c.dataset.category === category);
    });
  }

  grid.innerHTML = categories
    .map(
      (c) => `
    <button class="category-card" data-category="${c.name}" style="text-align:left; width:100%; border-width:1px;">
      <span class="cat-icon">${icons[c.icon]}</span>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
    </button>`
    )
    .join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".category-card");
    if (!card) return;
    paint(card.dataset.category);
  });

  /* start on a category from the URL, if present, else the first one */
  const params = new URLSearchParams(window.location.search);
  paint(params.get("category") || categories[0].name);
});
