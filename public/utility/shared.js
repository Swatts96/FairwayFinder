export function initializeUserDropdown() {
    const userDropdown = document.createElement('div');
    userDropdown.className = 'user-menu-container text-center';
    userDropdown.innerHTML = `
      <img src="../images/user.png" alt="User Icon" class="user-icon" onclick="toggleUserMenu()" />
      <div id="userDropdownMenu" class="dropdown-menu">
        <a href="scores.html" onclick="viewScores()">My Scores & Rounds</a>
        <a href="favourites.html" onclick="viewFavorites()">Favorite Courses</a>
      </div>
    `;
    document.querySelector('.navbar .collapse').appendChild(userDropdown);
  }
  
  // Placeholder functions for dynamic imports
  export async function viewScores() {
    const { fetchScores } = await import('./scores.js');
    fetchScores();
  }
  
  export async function viewFavorites() {
    const { fetchFavorites } = await import('./favorites.js');
    fetchFavorites();
  }
  
  export function toggleUserMenu() {
    const menu = document.getElementById('userDropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
  