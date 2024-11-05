let courseData = [];  // Global variable for storing course data

// Fetch course data and populate dropdowns and markers
fetch('courses.json')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    courseData = data;
    populateCourseDropdown('courseSelect');  // For scores.html
    populateMarkers(data);  // For index.html map
  })
  .catch(error => console.error('Error fetching courses data:', error));

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
  `;
}


// Function to show all courses
function showAllCourses() {
    Object.values(markers).forEach(item => item.marker.addTo(map));
}

// Function to show only 18-hole courses
function show18HoleCourses() {
    Object.values(markers).forEach(item => {
        map.removeLayer(item.marker);
        if (item.holes === 18) item.marker.addTo(map);
    });
}

// Function to show only 9-hole courses
function show9HoleCourses() {
    Object.values(markers).forEach(item => {
        map.removeLayer(item.marker);
        if (item.holes === 9) item.marker.addTo(map);
    });
}

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

function highlightCourse(courseName) {
    const marker = markers[courseName.toLowerCase()];
    if (marker) {
        map.flyTo(marker.marker.getLatLng(), 12, {
            duration: 0.25
        });
    }
}

let coursesPerPage = 10;
let currentPage = 1;

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

function loadMoreCourses() {
    currentPage++;
    populateCourseList();

    // Hide Load More button if all courses are displayed
    if ((currentPage * coursesPerPage) >= courseData.length) {
        document.getElementById("loadMore").style.display = 'none';
    }
}

// Initialize course list and attach event to Load More button
document.addEventListener("DOMContentLoaded", () => {
    populateCourseList();
    document.getElementById("loadMore").addEventListener("click", loadMoreCourses);
});
