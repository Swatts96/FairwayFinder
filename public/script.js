// Initialize the map centered on Nova Scotia
const map = L.map('map').setView([44.681986, -63.744311], 8);

// Load and display map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Store markers globally for filtering and search
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
        const marker = L.marker([course.coordinates.latitude, course.coordinates.longitude]);

        // Create a popup content with course details
        const popupContent = `
          <b>${course.name}</b><br>
          <b>Location:</b> ${course.location}<br>
          <b>Holes:</b> ${course.holes}<br>
          <b>Type:</b> ${course.type}<br>
          <b>Style:</b> ${course.style ? course.style : 'N/A'}<br>
          <b>Par:</b> ${course.par}<br>
          <b>Length:</b> ${course.length}<br>
          <b>Slope:</b> ${course.slope ? course.slope : 'N/A'}<br>
          <b>Rating:</b> ${course.rating ? course.rating : 'N/A'}
        `;
        marker.bindPopup(popupContent);

        // Add the marker to the map and store it for filtering
        marker.addTo(map);
        markers[course.name.toLowerCase()] = {
          marker: marker,
          holes: course.holes
        };
      }
    });
  })
  .catch(error => {
    console.error('Error fetching the courses data:', error);
  });

// Function to display all courses
function showAllCourses() {
  Object.values(markers).forEach(({ marker }) => {
    marker.addTo(map);
  });
}

// Function to display only 18-hole courses
function show18HoleCourses() {
  Object.values(markers).forEach(({ marker, holes }) => {
    if (holes === 18) {
      marker.addTo(map);
    } else {
      map.removeLayer(marker);
    }
  });
}

// Function to display only 9-hole courses
function show9HoleCourses() {
  Object.values(markers).forEach(({ marker, holes }) => {
    if (holes === 9) {
      marker.addTo(map);
    } else {
      map.removeLayer(marker);
    }
  });
}

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
  const coordinates = markers[courseName].marker.getLatLng();
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
