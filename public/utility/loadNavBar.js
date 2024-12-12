export function loadNavbar() {
    fetch('./utility/navbar.html')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load navbar');
        }
        return response.text();
      })
      .then((navbarHTML) => {
        const navbarContainer = document.getElementById('navbar');
        if (navbarContainer) {
          navbarContainer.innerHTML = navbarHTML;
          initializeNavbar();
        }
      })
      .catch((error) => console.error('Error loading navbar:', error));
  }
  
  // Initialize dynamic functionality for the navbar (e.g., user dropdown, event listeners)
  function initializeNavbar() {
    const userDropdownToggle = document.querySelector('.user-icon');
    if (userDropdownToggle) {
      userDropdownToggle.addEventListener('click', toggleUserMenu);
    }
  
    // Add event listeners for dropdown menu items
    const viewScoresLink = document.querySelector('a[onclick="viewScores()"]');
    if (viewScoresLink) {
      viewScoresLink.addEventListener('click', (event) => {
        event.preventDefault();
        import('./scores.js').then(({ fetchScores }) => fetchScores());
      });
    }
  
    const viewFavoritesLink = document.querySelector('a[onclick="viewFavorites()"]');
    if (viewFavoritesLink) {
      viewFavoritesLink.addEventListener('click', (event) => {
        event.preventDefault();
        import('./favorites.js').then(({ fetchFavorites }) => fetchFavorites());
      });
    }
  }
  
  // Function to toggle the dropdown menu
  function toggleUserMenu() {
    const menu = document.getElementById('userDropdownMenu');
    if (menu) {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
  }
  
  window.toggleUserMenu = toggleUserMenu; // Make globally accessible for older HTML onclick handlers
  