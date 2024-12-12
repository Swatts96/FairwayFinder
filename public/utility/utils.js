// Utility functions for common tasks, like dropdown population

function populateCourseDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="">Select a course...</option>';
  courseData.forEach(course => {
    const option = document.createElement("option");
    option.value = course.name;
    option.textContent = course.name;
    dropdown.appendChild(option);
  });
}

// Toggle the user dropdown menu
function toggleUserMenu() {
  const userMenu = document.getElementById("userDropdownMenu");
  userMenu.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.addEventListener("click", function(event) {
  const userMenu = document.getElementById("userDropdownMenu");
  if (!event.target.matches('.user-icon') && userMenu.classList.contains("show")) {
      userMenu.classList.remove("show");
  }
});

// JavaScript to load the navbar
document.addEventListener("DOMContentLoaded", function () {
  fetch('utility/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
    });
});


