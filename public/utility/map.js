// Initialize the map centered on Nova Scotia
const map = L.map('map').setView([44.681986, -63.744311], 8);

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
function populateMarkers(golfCourses) {
  golfCourses.forEach(course => {
    if (course.coordinates && course.coordinates.latitude && course.coordinates.longitude) {
      const marker = L.marker(
        [course.coordinates.latitude, course.coordinates.longitude],
        { icon: golfCourseIcon }
      );

      // Store the marker for filtering
      markers[course.name.toLowerCase()] = { marker: marker, holes: course.holes };

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
