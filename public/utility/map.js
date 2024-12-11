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

function populateMarkers(golfCourses) {
  golfCourses.forEach(course => {
    if (course.coordinates?.latitude && course.coordinates?.longitude) {
      const marker = L.marker(
        [course.coordinates.latitude, course.coordinates.longitude],
        { icon: golfCourseIcon }
      );

      // Add marker to the global storage
      markers[course.name.toLowerCase()] = { marker: marker, holes: course.holes };

      // Tooltip with course name on hover
      marker.on('mouseover', () => {
        const tooltip = L.tooltip({
          permanent: false,
          direction: 'top',
          className: 'course-tooltip'
        }).setContent(course.name).setLatLng(marker.getLatLng()).addTo(map);

        // Remove tooltip on mouseout
        marker.on('mouseout', () => map.removeLayer(tooltip));
      });

      // Add event listener for clicks
      marker.on('click', () => updateSelectedCourseInfo(course));

      // Add marker to the map
      marker.addTo(map);
    }
  });
}

