// Initialize the map centered on Nova Scotia
const map = L.map('map').setView([44.681986, -63.744311], 8);

// Load and display map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = {};
let searchResults = [];
let currentIndex = 0;

// Fetch the golf courses data from the JSON file
fetch('courses.json')
  .then(response => response.json())
  .then(golfCourses => {
    golfCourses.forEach(course => {
      if (course.coordinates && course.coordinates.latitude && course.coordinates.longitude) {
        // Add a marker for each course
        const marker = L.marker([course.coordinates.latitude, course.coordinates.longitude]).addTo(map);

        // Create a popup content with course details
        const popupContent = `
          <b>${course.name}</b><br>
          Location: ${course.location}<br>
          Holes: ${course.holes}<br>
          Type: ${course.type}<br>
          Style: ${course.style ? course.style : 'N/A'}<br>
          Par: ${course.par}<br>
          Length: ${course.length}<br>
          Slope: ${course.slope ? course.slope : 'N/A'}<br>
          Rating: ${course.rating ? course.rating : 'N/A'}
        `;
        marker.bindPopup(popupContent);

        // Store the marker for search functionality
        markers[course.name.toLowerCase()] = { lat: course.coordinates.latitude, lng: course.coordinates.longitude };

        // Show label on hover
        marker.on('mouseover', function () {
          this.bindTooltip(course.name, {
            permanent: false,
            direction: 'top',
            className: 'course-label' // Add CSS for better styling if needed
          }).openTooltip();
        });

        // Remove the tooltip when the mouse leaves the marker
        marker.on('mouseout', function () {
          this.closeTooltip();
        });
      }
    });
  })
  .catch(error => {
    console.error('Error fetching the courses data:', error);
  });

// Search functionality
function searchCourse() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  searchResults = Object.keys(markers).filter(course => course.includes(searchInput));

  if (searchResults.length > 0) {
    currentIndex = 0;
    highlightCourse(searchResults[currentIndex]);
  } else {
    alert('No matching courses found');
  }
}

// Function to center the map on the current course in searchResults
function highlightCourse(courseName) {
  const coordinates = markers[courseName];
  map.setView([coordinates.lat, coordinates.lng], 12); // Zoom to the selected course
}

// Function to cycle through search results with Up/Down buttons
function cycleResults(direction) {
  if (searchResults.length > 0) {
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % searchResults.length;  // Cycle forward
    } else if (direction === 'prev') {
      currentIndex = (currentIndex - 1 + searchResults.length) % searchResults.length; // Cycle backward
    }
    highlightCourse(searchResults[currentIndex]);
  }
}
