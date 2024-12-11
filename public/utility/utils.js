// Utility functions for common tasks, like dropdown population
function populateCourseDropdown(dropdownId, courseData) {
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
// JavaScript to load the navbar dynamically
function loadNavbar() {
  fetch("utility/navbar.html")
    .then(response => response.text())
    .then(data => {
      const navbar = document.getElementById("navbar");
      if (navbar) navbar.innerHTML = data;
    });
}

// // Check user login status and update the navbar
// function updateUserMenu() {
//   const token = localStorage.getItem("authToken"); // Token-based authentication
//   const loginOption = document.getElementById("loginOption");
//   const registerOption = document.getElementById("registerOption");
//   const logoutOption = document.getElementById("logoutOption");
//   const menuDivider = document.getElementById("menuDivider");
//   const scoresOption = document.getElementById("scoresOption");
//   const friendsOption = document.getElementById("friendsOption");

//   if (token) {
//     // User is logged in
//     loginOption.classList.add("d-none");
//     registerOption.classList.add("d-none");

//     logoutOption.classList.remove("d-none");
//     menuDivider.classList.remove("d-none");
//     scoresOption.classList.remove("d-none");
//     friendsOption.classList.remove("d-none");
//   } else {
//     // User is not logged in
//     loginOption.classList.remove("d-none");
//     registerOption.classList.remove("d-none");

//     logoutOption.classList.add("d-none");
//     menuDivider.classList.add("d-none");
//     scoresOption.classList.add("d-none");
//     friendsOption.classList.add("d-none");
//   }
// }

// Logout Function
function logout() {
  localStorage.removeItem("authToken"); // Clear authentication token
  sessionStorage.setItem("isLoggedIn", "false"); // Update session status
  location.reload(); // Refresh the page to update the dropdown
}



// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});
