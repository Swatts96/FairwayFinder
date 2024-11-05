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

      // Store the marker for filtering
      markers[course.name.toLowerCase()] = {
        marker: marker,
        holes: course.holes
      };

      // Event listener to update selected course details when marker is clicked
      marker.on('click', () => {
        updateSelectedCourseInfo(course);
      });

      // Add hover event to show tooltip with course name
      marker.on('mouseover', () => {
        const tooltip = L.tooltip({
          permanent: false,
          direction: 'top',
          className: 'course-tooltip'
        })
        .setContent(course.name)
        .setLatLng(marker.getLatLng())
        .addTo(map);
        
        marker.on('mouseout', () => {
          map.removeLayer(tooltip);
        });
      });

      // Add the marker to the map
      marker.addTo(map);
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

  // Generate pricing details if available
  const pricingDetails = course.pricing
    ? `<div><strong>Weekday Price (18 holes):</strong> ${course.pricing.weekday['18_holes'] || 'N/A'}</div>
       <div><strong>Weekend Price (18 holes):</strong> ${course.pricing.weekend['18_holes'] || 'N/A'}</div>`
    : '<div><strong>Pricing:</strong> Not available</div>';

  // Set inner HTML with additional fields for description, website, and pricing
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
      <div><strong>Description:</strong> ${course.description || 'N/A'}</div>
      ${course.website ? `<div><strong>Website:</strong> <a href="${course.website}" target="_blank">Visit Website</a></div>` : ''}
      ${pricingDetails}
    </div>
  `;
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

// Toggle dropdown menu visibility
function toggleUserMenu() {
  const userMenu = document.getElementById("userDropdownMenu");
  userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  const userMenu = document.getElementById("userDropdownMenu");
  if (!event.target.matches('.user-icon')) {
    if (userMenu.style.display === "block") {
      userMenu.style.display = "none";
    }
  }
}

function saveScore() {
  // Code to save score locally or temporarily for demonstration
  alert('Score saved successfully (simulation).');
}

function populateScoreInputs(holes) {
  const scoreContainer = document.getElementById('scoreInputs');
  scoreContainer.innerHTML = '';
  for (let i = 1; i <= holes; i++) {
    scoreContainer.innerHTML += `
      <div class="col-2">
        <label>Hole ${i}</label>
        <input type="number" class="form-control" placeholder="Score">
      </div>
    `;
  }
}

// Initialize sortable list with Sortable.js
const favoriteCoursesList = document.getElementById("favoriteCoursesList");
new Sortable(favoriteCoursesList, {
  animation: 150,
  onEnd: function (/**Event*/evt) {
    // Logic to handle reordering
    console.log(`Item moved from ${evt.oldIndex} to ${evt.newIndex}`);
  }
});

// Sample data to populate list
function populateFavorites() {
  favoriteCoursesList.innerHTML = `
    <li class="list-group-item">1. Course A</li>
    <li class="list-group-item">2. Course B</li>
    <li class="list-group-item">3. Course C</li>
  `;
}

populateFavorites();  // Initial population for demo

