// Initialize the map
export let map;
export let markers = {};


const golfCourseIcon = L.icon({
  iconUrl: './icons/greenIcon.png', // Ensure the path is correct relative to your public folder
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon that will correspond to marker's location
  popupAnchor: [0, -32] // Point where the popup should open relative to the iconAnchor
});

export function initializeMap() {
  if (!map) {
    map = L.map('map').setView([44.681986, -63.744311], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
  }
  console.log('Map initialized:', map);
}



export function populateMarkers(courses) {
  courses.forEach((course) => {
      if (course.coordinates && course.coordinates.latitude && course.coordinates.longitude) {
          // Use the golfCourseIcon for the marker
          const marker = L.marker(
              [course.coordinates.latitude, course.coordinates.longitude],
              { icon: golfCourseIcon } // Assign the custom icon here
          );

          marker
              .addTo(map)
              .bindPopup(`
                  <b>${course.name}</b><br>
                  ${course.location}<br>
                  Holes: ${course.holes || 'N/A'}<br>
                  Par: ${course.par || 'N/A'}<br>
                  <a href="${course.website}" target="_blank">Visit Website</a>
              `);

          // Call updateSelectedCourseInfo on marker click
          marker.on("click", () => {
              updateSelectedCourseInfo(course);
          });

          markers[course.name.toLowerCase()] = marker;
      }
  });
}



export { golfCourseIcon }; // Export the icon for reuse
