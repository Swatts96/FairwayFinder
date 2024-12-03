document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();
  
    // Simulated registration process
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    alert("Registration successful!");
    sessionStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html"; // Redirect to the home page
  });
  