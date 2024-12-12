import { getLoggedInUser, logout } from './auth.js';

export function initializeUserNav() {
  console.log('initializeUserNav called'); // Debugging

  const user = getLoggedInUser();
  const userNav = document.getElementById('userNav');

  if (!userNav) {
    console.error('User navbar section not found!');
    return;
  }

  userNav.innerHTML = ''; // Clear any existing content

  if (user) {
    console.log(`Logged in as: ${user.email}`);
    userNav.innerHTML = `
      <li class="nav-item">
        <span class="nav-link">Hello, ${user.email}</span>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link" onclick="logout()">Logout</a>
      </li>
    `;
  } else {
    console.log('No user logged in');
    userNav.innerHTML = `
      <li class="nav-item">
        <a href="login.html" class="nav-link">Login</a>
      </li>
      <li class="nav-item">
        <a href="register.html" class="nav-link">Register</a>
      </li>
    `;
  }
}


// Attach logout globally for use
window.logout = logout;
