// Initialize the map centered on Nova Scotia
const map = L.map('map').setView([44.681986, -63.744311], 8);

// Load and display map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const golfCourseIcon = L.icon({
  iconUrl: '../images/greenIcon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Store markers globally for filtering and search
let markers = {};
let searchResults = [];
let currentIndex = 0;
let courseData = [];  // Global variable for storing course data

// Fetch the golf courses data from the JSON file
fetch('courses.json')
  .then(response => response.json())
  .then(golfCourses => {
    courseData = golfCourses;  // Store all course data in courseData array
    populateMarkers(golfCourses);  // Populate map markers
  })
  .catch(error => {
    console.error('Error fetching the courses data:', error);
  });

// Function to populate map markers based on course data
function populateMarkers(golfCourses) {
  golfCourses.forEach(course => {
    if (course.coordinates && course.coordinates.latitude && course.coordinates.longitude) {
      const marker = L.marker(
        [course.coordinates.latitude, course.coordinates.longitude],
        { icon: golfCourseIcon }
      );

      // Create popup content
      const popupContent = `
        <b>${course.name}</b><br>
        Location: ${course.location}<br>
        Holes: ${course.holes}<br>
        Type: ${course.type}<br>
        Style: ${course.style || 'N/A'}<br>
        Par: ${course.par}<br>
        Length: ${course.length}<br>
        Slope: ${course.slope || 'N/A'}<br>
        Rating: ${course.rating || 'N/A'}<br>
        <a href="${course.website}" target="_blank">Visit Website</a>
      `;

      // Bind popup to marker
      marker.bindPopup(popupContent);

      // Add the marker to the map and store it for filtering
      marker.addTo(map);
      markers[course.name.toLowerCase()] = {
        marker: marker,
        holes: course.holes
      };

      // Event listener to update selected course details when popup opens
      marker.on('popupopen', () => {
        updateSelectedCourseInfo(course);
      });
    }
  });
}

// Function to show all courses
function showAllCourses() {
  // Remove all markers from the map
  Object.values(markers).forEach(item => map.removeLayer(item.marker));

  // Add all markers back to the map
  Object.values(markers).forEach(item => {
    item.marker.addTo(map);
  });
}

// Function to show only 18-hole courses
function show18HoleCourses() {
  // Remove all markers from the map
  Object.values(markers).forEach(item => map.removeLayer(item.marker));

  // Add only 18-hole course markers to the map
  Object.values(markers).forEach(item => {
    if (item.holes === 18) {
      item.marker.addTo(map);
    }
  });
}

// Function to show only 9-hole courses
function show9HoleCourses() {
  // Remove all markers from the map
  Object.values(markers).forEach(item => map.removeLayer(item.marker));

  // Add only 9-hole course markers to the map
  Object.values(markers).forEach(item => {
    if (item.holes === 9) {
      item.marker.addTo(map);
    }
  });
}



// Function to update the selected course details in the #courseInfo section
function updateSelectedCourseInfo(course) {
  const courseDetailsContainer = document.getElementById("courseInfo");

  // Format course name for the image file
  const formattedCourseName = course.name.toLowerCase().replace(/ /g, '-') + '.jpg';
  const imagePath = `/images/${formattedCourseName}`;

  // Create image element if the image exists
  const courseImage = `<img src="${imagePath}" alt="${course.name}" class="course-image" onerror="this.style.display='none'">`;

  courseDetailsContainer.innerHTML = `
    <h2 class="h4">Selected Course Information</h2>
    ${courseImage}
    <div class="course-details-grid">
      <div><strong>Name:</strong> ${course.name}</div>
      <div><strong>Location:</strong> ${course.location}</div>
      <div><strong>Holes:</strong> ${course.holes}</div>
      <div><strong>Type:</strong> ${course.type}</div>
      <div><strong>Style:</strong> ${course.style || 'N/A'}</div>
      <div><strong>Par:</strong> ${course.par}</div>
      <div><strong>Length:</strong> ${course.length}</div>
      <div><strong>Slope:</strong> ${course.slope || 'N/A'}</div>
      <div><strong>Rating:</strong> ${course.rating || 'N/A'}</div>
      ${course.website ? `<div><strong>Website:</strong> <a href="${course.website}" target="_blank">Visit Website</a></div>` : ''}
    </div>
  `;
}


// Search functionality using dynamically loaded course data
function searchCourseDropdown() {
  const input = document.getElementById("courseSearchInput").value.toLowerCase();
  const filteredCourses = courseData.filter(course => course.name.toLowerCase().includes(input));
  const dropdownMenu = document.getElementById("dropdownCourseList");

  dropdownMenu.innerHTML = ""; // Clear the previous results

  filteredCourses.forEach(course => {
    const option = document.createElement("a");
    option.className = "dropdown-item";
    option.href = "#"; // Add functionality to select the course
    option.textContent = course.name;
    option.addEventListener("click", () => {
      document.getElementById("courseSearchInput").value = course.name; // Set input to selected course
      dropdownMenu.innerHTML = ""; // Clear the dropdown
      highlightCourse(course.name.toLowerCase()); // Center map on the selected course
    });
    dropdownMenu.appendChild(option);
  });

  dropdownMenu.style.display = filteredCourses.length ? "block" : "none"; // Toggle dropdown visibility
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
