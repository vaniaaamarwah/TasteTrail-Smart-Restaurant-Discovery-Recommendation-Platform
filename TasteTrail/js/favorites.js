/* ============================================================
   favorites.js
   Renders the saved restaurants from localStorage.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("favorites-grid");
  if (!grid) return;

  function render() {
    const favIds = getFavorites();
    const favRestaurants = restaurants.filter((r) => favIds.includes(r.id));

    if (!favRestaurants.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>Your trail is empty.</h3>
          <p>Save a few local finds and they'll appear here.</p>
          <a class="btn btn-primary" href="local-finds.html">Explore Local Finds</a>
        </div>`;
      return;
    }

    grid.innerHTML = favRestaurants.map((r) => buildCardHTML(r)).join("");
  }

  render();
  document.addEventListener("favorites:changed", render);
});
