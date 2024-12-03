document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
  
    // Simulated login process (replace with actual API call)
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    if (username === "testuser" && password === "password123") {
      sessionStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      window.location.href = "index.html"; // Redirect to the home page
    } else {
      alert("Invalid username or password!");
    }
  });
  