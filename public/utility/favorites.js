// Initialize sortable list with Sortable.js
const favoriteCoursesList = document.getElementById("favoriteCoursesList");

if (favoriteCoursesList) {
  new Sortable(favoriteCoursesList, {
    animation: 150,
    onEnd: function (evt) {
      console.log(`Item moved from ${evt.oldIndex} to ${evt.newIndex}`);
    }
  });

  // Sample data to populate list for demo
  function populateFavorites() {
    favoriteCoursesList.innerHTML = `
      <li class="list-group-item">1. Course A</li>
      <li class="list-group-item">2. Course B</li>
      <li class="list-group-item">3. Course C</li>
    `;
  }

  populateFavorites(); // Initial population for demo
}
