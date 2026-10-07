/* ============================================================
   compare.js
   Side-by-side comparison of up to three saved-for-compare
   restaurants, stored in localStorage.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("compare-wrap");
  if (!wrap) return;

  const FACILITY_ROWS = ["Outdoor Seating", "WiFi", "Parking", "Family Friendly", "Reservations"];

  function checkOrDash(hasIt) {
    return hasIt ? `<span class="check-yes">Yes</span>` : `<span class="check-no">—</span>`;
  }

  function render() {
    const ids = getCompareList();
    const items = ids.map((id) => getRestaurantById(id)).filter(Boolean);

    if (!items.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <h3>Nothing to compare yet</h3>
          <p>Add up to three restaurants from Explore or a restaurant page to compare them here.</p>
          <a class="btn btn-primary" href="explore.html">Browse Restaurants</a>
        </div>`;
      return;
    }

    const rows = [
      { label: "Rating", render: (r) => `★ ${r.rating.toFixed(1)}` },
      { label: "Price", render: (r) => r.price },
      { label: "Distance", render: (r) => `${r.distance} km` },
      { label: "Cuisine", render: (r) => r.cuisine },
      { label: "Category", render: (r) => r.category },
      { label: "Opening Hours", render: (r) => r.openingHours },
      ...FACILITY_ROWS.map((f) => ({
        label: f,
        render: (r) => checkOrDash(r.facilities.includes(f))
      }))
    ];

    wrap.innerHTML = `
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th></th>
              ${items
                .map(
                  (r) => `
                <th>
                  ${r.name}
                  <div><button class="btn btn-sm btn-outline" data-remove="${r.id}">Remove</button></div>
                </th>`
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                <th>${row.label}</th>
                ${items.map((r) => `<td>${row.render(r)}</td>`).join("")}
              </tr>`
              )
              .join("")}
            <tr>
              <th>Details</th>
              ${items
                .map((r) => `<td><a class="view-link" href="restaurant.html?id=${r.id}">View Restaurant ${icons.arrowRight}</a></td>`)
                .join("")}
            </tr>
          </tbody>
        </table>
      </div>`;

    wrap.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeFromCompare(btn.dataset.remove);
        document.dispatchEvent(new CustomEvent("compare:changed"));
        render();
      });
    });
  }

  render();
});
