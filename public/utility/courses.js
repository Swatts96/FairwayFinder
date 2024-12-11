let currentPage = 1; // Track the current page
const coursesPerPage = 10; // Number of courses per page


function clearMarkers() {
  Object.values(markers).forEach(item => map.removeLayer(item.marker));
  markers = {}; // Reset markers
}

function fetchCourses(page = 1) {
  fetch(`http://localhost:3333/api/courses?page=${page}&limit=${coursesPerPage}`)
    .then(response => response.json())
    .then(data => {
      const { courses, totalPages } = data;
      courseData = courses; // Update global courseData array
      populateMarkers(courseData); // Populate map markers
      populateCourseList(); // Render the courses in the grid
      updatePaginationButtons(page, totalPages); // Handle pagination UI
    })
    .catch(error => console.error('Error fetching courses:', error));
}

// Fetch the initial set of courses
fetchCourses();


// Populate any dropdown with course names
function populateCourseDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return; // Exit if the dropdown is not found on the page

  dropdown.innerHTML = '<option value="">Select a course...</option>'; // Reset dropdown
  courseData.forEach(course => {
    const option = document.createElement("option");
    option.value = course.name;
    option.textContent = course.name;
    dropdown.appendChild(option);
  });
}

// Update selected course details in the #courseInfo section
function updateSelectedCourseInfo(course) {
    const courseDetailsContainer = document.getElementById("courseInfo");
  
    const imagePath = `/images/${course.name.toLowerCase().replace(/ /g, '-')}.jpg`;
    const courseImage = `<img src="${imagePath}" alt="${course.name}" class="course-image" onerror="this.style.display='none'">`;
  
    const pricingDetails = course.pricing
      ? `<div><strong>Weekday Price (18 holes):</strong> ${course.pricing.weekday['18_holes'] || 'N/A'}</div>
         <div><strong>Weekend Price (18 holes):</strong> ${course.pricing.weekend['18_holes'] || 'N/A'}</div>`
      : '<div><strong>Pricing:</strong> Not available</div>';
  
    // Add course information along with Play a Round and Review buttons
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
        ${pricingDetails}
        <div><strong>Description:</strong> ${course.description || 'N/A'}</div>
      </div>
      <div class="d-flex justify-content-around mt-3">
        <button class="btn btn-primary" onclick="playRound('${course.name}')">Play a Round</button>
        <button class="btn btn-secondary" onclick="reviewCourse('${course.name}')">Review Course</button>
      </div>
    `;
  }

  // Handle Review Course button click
function reviewCourse(courseName) {
    window.location.href = `review_course.html?course=${encodeURIComponent(courseName)}`;
  }
  


// Handle Play a Round button click
function playRound(courseName) {
    window.location.href = `play_round.html?course=${encodeURIComponent(courseName)}`;
  }
  

// Function to show all courses
function showAllCourses() {
  Object.values(markers).forEach(item => item.marker.addTo(map));
}

function show18HoleCourses() {
  Object.values(markers).forEach(item => {
    map.removeLayer(item.marker);
    if (item.holes === 18) item.marker.addTo(map);
  });
}

function show9HoleCourses() {
  Object.values(markers).forEach(item => {
    map.removeLayer(item.marker);
    if (item.holes === 9) item.marker.addTo(map);
  });
}



// Search and highlight course on map based on dropdown input
function searchCourseDropdown() {
    const input = document.getElementById("courseSearchInput").value.toLowerCase();
    const filteredCourses = courseData.filter(course => course.name.toLowerCase().includes(input));
    const dropdownMenu = document.getElementById("dropdownCourseList");
  
    dropdownMenu.innerHTML = ""; // Clear the previous results
  
    filteredCourses.forEach(course => {
      const option = document.createElement("a");
      option.className = "dropdown-item";
      option.href = "#";
      option.textContent = course.name;
      option.addEventListener("click", () => {
        document.getElementById("courseSearchInput").value = course.name;
        dropdownMenu.innerHTML = "";
        highlightCourse(course.name.toLowerCase());
      });
      dropdownMenu.appendChild(option);
    });
  
    dropdownMenu.style.display = filteredCourses.length ? "block" : "none";
  }
  
  // Highlight the selected course on the map
  function highlightCourse(courseName) {
    const marker = markers[courseName.toLowerCase()];
    if (marker) {
      map.flyTo(marker.marker.getLatLng(), 12, {
        duration: 0.25
      });
    }
  }


function populateCourseList() {
    const courseGrid = document.getElementById("courseGrid");
    if (!courseGrid) return;

    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const coursesToDisplay = courseData.slice(startIndex, endIndex);

    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = "col-md-6 mb-4";

        courseCard.innerHTML = `
            <div class="card h-100 shadow">
                <img src="/images/${course.name.toLowerCase().replace(/ /g, '-')}.jpg" 
                     class="card-img-top course-image" 
                     alt="${course.name}" 
                     onerror="this.style.display='none'">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text">${course.description || 'No description available.'}</p>
                    <p><strong>Location:</strong> ${course.location}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="playRound('${course.name}')">Play a Round</button>
                        <button class="btn btn-secondary" onclick="reviewCourse('${course.name}')">Review Course</button>
                    </div>
                </div>
            </div>
        `;
        courseGrid.appendChild(courseCard);
    });
}


function playRandomCourse() {
  if (!courseData.length) {
    console.error('No courses available');
    return;
  }
  const randomCourse = courseData[Math.floor(Math.random() * courseData.length)];
  playRound(randomCourse.name); // Redirect to play round page
}

// Ensure playRandomCourse is attached to the relevant button
document.getElementById('playRandom').addEventListener('click', playRandomCourse);

  
function loadMoreCourses() {
  currentPage++;
  fetchCourses(currentPage);
}

function updatePaginationButtons(currentPage, totalPages) {
  const loadMoreButton = document.getElementById('loadMore');
  if (currentPage >= totalPages) {
    loadMoreButton.style.display = 'none'; // Hide the button when all pages are loaded
  } else {
    loadMoreButton.style.display = 'block';
  }
}

// Add event listener for the "Load More" button
document.addEventListener('DOMContentLoaded', () => {
  const loadMoreButton = document.getElementById('loadMore');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadMoreCourses);
  }
});

// Function to get query parameters from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Display the course name if present in the query parameters
  document.addEventListener("DOMContentLoaded", () => {
    const courseName = getQueryParameter("course");
    if (courseName) {
      document.querySelector("h1").innerText = `Play a Round - ${courseName}`;
    }
  });