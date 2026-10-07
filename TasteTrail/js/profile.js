/* ============================================================
   profile.js
   Builds a simple personal summary from favourites stored in
   localStorage. No accounts or authentication in this prototype.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const savedList = document.getElementById("profile-saved");
  const recentList = document.getElementById("profile-recent");
  const cuisineList = document.getElementById("profile-cuisines");
  if (!savedList) return;

  const favIds = getFavorites();
  const favRestaurants = restaurants.filter((r) => favIds.includes(r.id));

  /* saved places (up to 4 shown) */
  savedList.innerHTML = favRestaurants.length
    ? favRestaurants
        .slice(0, 4)
        .map(
          (r) => `
        <li class="pref-row">
          <span>${r.name}</span>
          <a class="view-link" href="restaurant.html?id=${r.id}">View</a>
        </li>`
        )
        .join("")
    : `<li class="pref-row"><span class="pref-label">No saved places yet — start exploring.</span></li>`;

  /* "recently viewed" — simulated from the same favourites list for this static demo */
  recentList.innerHTML = favRestaurants.length
    ? favRestaurants
        .slice(0, 3)
        .map((r) => `<li class="pref-row"><span>${r.name}</span><span class="pref-label">${r.cuisine}</span></li>`)
        .join("")
    : `<li class="pref-row"><span class="pref-label">Nothing viewed yet this trail.</span></li>`;

  /* preferred cuisines, derived from favourites */
  const cuisineCounts = {};
  favRestaurants.forEach((r) => {
    cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
  });
  const topCuisines = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]);
  cuisineList.innerHTML = topCuisines.length
    ? topCuisines.map(([c]) => `<span class="rtag">${c}</span>`).join("")
    : `<span class="pref-label">Save a few places to see your taste take shape.</span>`;

  /* settings form — purely local, no backend */
  const form = document.getElementById("preferences-form");
  if (form) {
    const saved = JSON.parse(localStorage.getItem("tastetrail_prefs") || "{}");
    if (saved.budget) form.budget.value = saved.budget;
    if (saved.dietary) form.dietary.value = saved.dietary;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem(
        "tastetrail_prefs",
        JSON.stringify({ budget: form.budget.value, dietary: form.dietary.value })
      );
      const status = document.getElementById("prefs-status");
      status.textContent = "Preferences saved.";
      setTimeout(() => (status.textContent = ""), 2500);
    });
  }
});
