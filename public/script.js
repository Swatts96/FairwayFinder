// Initialize the map centered on Nova Scotia
const map = L.map('map').setView([44.681986, -63.744311], 8);

// Load and display map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const golfCourseIcon = L.icon({
  iconUrl: '../images/greenIcon.png', // Path logo for markers
  iconSize: [32, 32], // Set the icon's width and height
  iconAnchor: [16, 32], // Anchor point (centered at bottom)
  popupAnchor: [0, -32] // Position the popup relative to the icon
});

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
        // Add a marker for each course using the custom icon
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
          Style: ${course.style ? course.style : 'N/A'}<br>
          Par: ${course.par}<br>
          Length: ${course.length}<br>
          Slope: ${course.slope ? course.slope : 'N/A'}<br>
          Rating: ${course.rating ? course.rating : 'N/A'}<br>
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
  })
  .catch(error => {
    console.error('Error fetching the courses data:', error);
  });

// Function to update the selected course details in the #courseInfo section
function updateSelectedCourseInfo(course) {
  const courseDetailsContainer = document.getElementById("courseInfo");
  courseDetailsContainer.innerHTML = `
    <h2 class="h4">Selected Course Information</h2>
    <div class="course-details-grid">
      <div><strong>Name:</strong> ${course.name}</div>
      <div><strong>Location:</strong> ${course.location}</div>
      <div><strong>Holes:</strong> ${course.holes}</div>
      <div><strong>Type:</strong> ${course.type}</div>
      <div><strong>Style:</strong> ${course.style ? course.style : 'N/A'}</div>
      <div><strong>Par:</strong> ${course.par}</div>
      <div><strong>Length:</strong> ${course.length}</div>
      <div><strong>Slope:</strong> ${course.slope ? course.slope : 'N/A'}</div>
      <div><strong>Rating:</strong> ${course.rating ? course.rating : 'N/A'}</div>
      ${course.website ? `<div><strong>Website:</strong> <a href="${course.website}" target="_blank">Visit Website</a></div>` : ''}
    </div>
  `;
}

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

// Sample course data array (you can replace this with your actual data)
let courseNames = ["Abercrombie Golf Club", "Ashburn Golf Club", "Cabot Cliffs", "Cabot Links", /* other courses */];

// Populate the dropdown list with filtered courses
function searchCourseDropdown() {
  const input = document.getElementById("courseSearchInput").value.toLowerCase();
  const filteredCourses = courseNames.filter(course => course.toLowerCase().includes(input));
  const dropdownMenu = document.getElementById("dropdownCourseList");

  dropdownMenu.innerHTML = ""; // Clear the previous results

  filteredCourses.forEach(course => {
    const option = document.createElement("a");
    option.className = "dropdown-item";
    option.href = "#"; // Add functionality to select the course
    option.textContent = course;
    option.addEventListener("click", () => {
      document.getElementById("courseSearchInput").value = course; // Set input to selected course
      dropdownMenu.innerHTML = ""; // Clear the dropdown
      highlightCourse(course); // Center map on the selected course
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


let courseData = [];
let currentPage = 1;
const coursesPerPage = 10;

async function loadCourseData() {
  try {
    const response = await fetch('courses.json');
    courseData = await response.json();
    loadCourses(); // Load initial set of courses
  } catch (error) {
    console.error('Error loading course data:', error);
  }
}

// Loading data from courses.json for courselist 
function loadCourses() {
  const courseGrid = document.getElementById("courseGrid");
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = currentPage * coursesPerPage;
  const coursesToDisplay = courseData.slice(startIndex, endIndex);

  coursesToDisplay.forEach(course => {
    const courseCard = document.createElement("div");
    courseCard.className = "col-md-4 mb-4";
    courseCard.innerHTML = `
      <div class="card">
        <img src="images/${course.name.replace(/\s+/g, "-").toLowerCase()}.jpg" class="card-img-top" alt="${course.name}">
        <div class="card-body">
          <h5 class="card-title">${course.name}</h5>
          <p class="card-text">
            <b>Location:</b> ${course.location} <br>
            <b>Holes:</b> ${course.holes} <br>
            <b>Type:</b> ${course.type} <br>
            <b>Par:</b> ${course.par || 'N/A'} <br>
            <b>Length:</b> ${course.length || 'N/A'}
          </p>
          ${course.website ? `<a href="${course.website}" target="_blank" class="btn btn-primary">Visit Website</a>` : ''}
        </div>
      </div>
    `;
    courseGrid.appendChild(courseCard);
  });

  currentPage++;
  if (currentPage > Math.ceil(courseData.length / coursesPerPage)) {
    document.getElementById("loadMore").style.display = "none";
  }
}

document.getElementById("loadMore").addEventListener("click", loadCourses);

// Load the initial data and first set of courses
loadCourseData();

