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
  