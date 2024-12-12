const apiBaseUrl = 'http://localhost:3333/api';
const response = await fetch(`${apiBaseUrl}/register`);

export async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Attempting login with:', { email, password });

    try {
        const response = await fetch('http://localhost:3333/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('user', JSON.stringify(data));
            alert(`Welcome back, ${data.email}`);
            window.location.href = 'index.html';
        } else {
            const error = await response.text();
            console.log('Login failed:', error);
            alert(`Login failed: ${error}`);
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

  

export async function handleRegister(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3333/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username: email.split('@')[0], email, password }),
      });
  
      if (response.ok) {
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
      } else {
        const error = await response.text();
        alert(`Registration failed: ${error}`);
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  }
  

export function logout() {
  sessionStorage.removeItem('user');
  alert('Logged out successfully.');
  window.location.href = 'index.html';
}

export function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem('user'));
}
