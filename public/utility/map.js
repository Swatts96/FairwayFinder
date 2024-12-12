// Initialize the map centered on Nova Scotia
let map = L.map('map').setView([44.681986, -63.744311], 8);

// Load and display map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const golfCourseIcon = L.icon({
  iconUrl: '../icons/greenIcon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

let markers = {}; // Store markers globally for filtering and search

// Function to populate map markers
export function populateMarkers(courses) {
  initializeMap(); // Ensure the map is initialized

  courses.forEach((course) => {
    if (course.coordinates && course.coordinates.latitude && course.coordinates.longitude) {
      const marker = L.marker([course.coordinates.latitude, course.coordinates.longitude])
        .addTo(map)
        .bindPopup(`
          <b>${course.name}</b><br>
          ${course.location}<br>
          Holes: ${course.holes || 'N/A'}<br>
          Par: ${course.par || 'N/A'}<br>
          <a href="${course.website}" target="_blank">Visit Website</a>
        `);

      markers[course.name.toLowerCase()] = marker;

      // Event listener to update selected course details when marker is clicked
      marker.on('click', () => {
        updateSelectedCourseInfo(course);
      });

      // Tooltip with course name on hover
      marker.on('mouseover', () => {
        const tooltip = L.tooltip({
          permanent: false,
          direction: 'top',
          className: 'course-tooltip'
        }).setContent(course.name).setLatLng(marker.getLatLng()).addTo(map);

        marker.on('mouseout', () => map.removeLayer(tooltip));
      });

      // Add the marker to the map
      marker.addTo(map);
    }
  });
}
// Export markers if needed for other operations
export { markers, map };