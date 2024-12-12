let courseData = [];  // Global variable for storing course data
import { populateMarkers } from './map.js';

// Fetch course data and populate dropdowns and markers
fetch('http://localhost:3333/api/courses')
  .then((response) => response.json())
  .then((data) => {
    console.log('Fetched data:', data); // Debug log
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


function playRandomCourse() {
    if (courseData.length === 0) return;
  
    // Select a random course from courseData
    const randomCourse = courseData[Math.floor(Math.random() * courseData.length)].name;
    playRound(randomCourse);  // Reuse the playRound function to navigate
  }

  

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