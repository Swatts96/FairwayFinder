import { logout, getLoggedInUser } from './auth.js';

export function initializeUserDropdown() {
  const user = getLoggedInUser();
  const userDropdown = document.createElement('div');
  userDropdown.className = 'user-menu-container text-center';

  if (user) {
    userDropdown.innerHTML = `
      <img src="../images/user.png" alt="User Icon" class="user-icon" onclick="toggleUserMenu()" />
      <div id="userDropdownMenu" class="dropdown-menu">
        <span class="dropdown-item disabled">Hello, ${user.email}</span>
        <a href="#" class="dropdown-item" onclick="logout()">Logout</a>
      </div>
    `;
  } else {
    userDropdown.innerHTML = `
      <img src="../images/user.png" alt="User Icon" class="user-icon" onclick="toggleUserMenu()" />
      <div id="userDropdownMenu" class="dropdown-menu">
        <a href="login.html" class="dropdown-item">Login</a>
        <a href="register.html" class="dropdown-item">Register</a>
      </div>
    `;
  }

  document.querySelector('.navbar .collapse').appendChild(userDropdown);
}

// Attach globally for use in dropdown
window.logout = logout;

  
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
  