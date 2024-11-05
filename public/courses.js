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
      <div><strong>Description:</strong> ${course.description || 'N/A'}</div>
      ${course.website ? `<div><strong>Website:</strong> <a href="${course.website}" target="_blank">Visit Website</a></div>` : ''}
      ${pricingDetails}
    </div>
  `;
}
