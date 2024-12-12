import { initializeMap, populateMarkers, map, markers } from './map.js';

let courseData = []; // Global variable for storing course data

// Ensure the map is initialized before fetching data
initializeMap();

// Fetch course data and populate dropdowns and markers
fetch('http://localhost:3333/api/courses')
  .then((response) => response.json())
  .then((data) => {
    courseData = data; // Populate global variable
    populateCourseDropdown("courseSelect");
    populateMarkers(courseData);
  })
  .catch((error) => console.error('Error fetching courses:', error));

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


function showAllCourses() {
  Object.values(markers).forEach(marker => {
    if (!map.hasLayer(marker)) {
      marker.addTo(map); // Ensure the marker is added to the map
    }
  });
}

function show18HoleCourses() {
  Object.entries(markers).forEach(([name, marker]) => {
    const course = courseData.find(course => course.name.toLowerCase() === name);
    if (course) {
      if (map.hasLayer(marker)) map.removeLayer(marker); // Remove marker first
      if (course.holes === 18) marker.addTo(map); // Add only 18-hole courses
    }
  });
}

function show9HoleCourses() {
  Object.entries(markers).forEach(([name, marker]) => {
    const course = courseData.find(course => course.name.toLowerCase() === name);
    if (course) {
      if (map.hasLayer(marker)) map.removeLayer(marker); // Remove marker first
      if (course.holes === 9) marker.addTo(map); // Add only 9-hole courses
    }
  });
}



// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("showAllCoursesBtn").addEventListener("click", showAllCourses);
  document.getElementById("show18HoleCoursesBtn").addEventListener("click", show18HoleCourses);
  document.getElementById("show9HoleCoursesBtn").addEventListener("click", show9HoleCourses);
});


// Search and highlight course on map based on dropdown input
export function searchCourseDropdown() {
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

// Attach to the global window object
window.searchCourseDropdown = searchCourseDropdown;

export function updateSelectedCourseInfo(course) {
  const courseInfoDiv = document.getElementById("courseInfo");

  const imagePath = `/images/${course.name.toLowerCase().replace(/ /g, '-')}.jpg`;

  courseInfoDiv.innerHTML = `
      <div class="card mb-3">
          <div class="row no-gutters">
              <div class="col-md-4">
                  <img src="${imagePath}" class="card-img" alt="${course.name}" onerror="this.style.display='none'">
              </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <h5 class="card-title">${course.name}</h5>
                      <p class="card-text"><strong>Location:</strong> ${course.location}</p>
                      <p class="card-text"><strong>Holes:</strong> ${course.holes || "N/A"}</p>
                      <p class="card-text"><strong>Par:</strong> ${course.par || "N/A"}</p>
                      <p class="card-text"><strong>Description:</strong> ${course.description || "No description available."}</p>
                      <p class="card-text"><strong>Website:</strong> ${
                          course.website
                              ? `<a href="${course.website}" target="_blank">${course.website}</a>`
                              : "N/A"
                      }</p>
                      <div class="d-flex justify-content-around mt-3">
                          <button class="btn btn-primary" onclick="playRound('${course.name}')">Play a Round</button>
                          <button class="btn btn-secondary" onclick="reviewCourse('${course.name}')">Review Course</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;
}

// Attach globally for dynamic event binding
window.updateSelectedCourseInfo = updateSelectedCourseInfo;

  
function highlightCourse(courseName) {
  const marker = markers[courseName.toLowerCase()];
  if (marker) {
      map.flyTo(marker.getLatLng(), 12, {
          duration: 0.25
      });
  }
}

// Attach highlightCourse to the global window object if needed
window.highlightCourse = highlightCourse;


export function playRound(courseName) {
  // Redirect the user to the play_round.html page with the selected course as a query parameter
  window.location.href = `play_round.html?course=${encodeURIComponent(courseName)}`;
}

// Attach to the global window object for dynamic events
window.playRound = playRound;


export function playRandomCourse() {
    if (courseData.length === 0) return;
  
    // Select a random course from courseData
    const randomCourse = courseData[Math.floor(Math.random() * courseData.length)].name;
    playRound(randomCourse);  // Reuse the playRound function to navigate
  }

  // Attach to the global window object for dynamic events
  window.playRandomCourse = playRandomCourse;
  

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