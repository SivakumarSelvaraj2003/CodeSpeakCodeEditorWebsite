//dark mode and light mode
var icon = document.getElementById("icon");
icon.onclick = function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    icon.src = "images/crescent-moon-png-35116 (1).png";
    document.body.style.backgroundImage =
      "url('background image.png')".backgroundSize = "contain";
  } else {
    icon.src = "images/sun-256.png";
  }
};
 document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value.trim();
    const emailError = document.querySelector("#email-error");
    const passwordError = document.querySelector("#password-error");

    // Reset previous errors
    emailError.textContent = "";
    passwordError.textContent = "";

    if (!email || !password) {
      emailError.textContent = "Email is required.";
      passwordError.textContent = "Password is required.";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Display error message
        emailError.textContent = "Invalid email or password.";
        passwordError.textContent = "Please check your credentials.";
        return;
      }

      // Successful login
      alert("Login successful!");
      localStorage.setItem("token", data.token);
      window.location.href = "editor.html"; // Redirect after login
    } catch (error) {
      emailError.textContent = "Error logging in. Please try again.";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const userDropdown = document.getElementById("user-dropdown"); // User icon
  const authButtons = document.getElementById("auth-buttons"); // Login/Signup buttons
  const usernameDisplay = document.getElementById("username-display"); // Username display
  const logoutBtn = document.getElementById("logout-btn"); // Logout button

  function updateUI() {
    const username = localStorage.getItem("username");

    if (username) {
      usernameDisplay.textContent = username; // Show username
      userDropdown.style.display = "block"; // Show user icon
      authButtons.style.display = "none"; // Hide login/signup buttons
    } else {
      userDropdown.style.display = "none"; // Hide user icon
      authButtons.style.display = "block"; // Show login/signup buttons
    }
  }

  updateUI(); // Call function on page load

  // Logout Functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      updateUI(); // Update UI after logout
      alert("Logged out successfully!");
      window.location.href = "index.html"; // Redirect to homepage
    });
  }
});
 

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm"); // Login form
  const userDropdown = document.getElementById("user-dropdown"); // User icon dropdown
  const authButtons = document.getElementById("auth-buttons"); // Login/Signup buttons
  const usernameDisplay = document.getElementById("username-display"); // Username display
  const logoutBtn = document.getElementById("logout-btn"); // Logout button

  async function loginUser(email, password) {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // ✅ Store token & username in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username); // Store username
      alert("Login successful!");

      // Redirect to editor or home page
      window.location.href = "index.html";
    } catch (error) {
      showError(error.message);
    }
  }

  function showError(message) {
    const errorDiv = document.getElementById("login-error");
    errorDiv.textContent = message;
    errorDiv.style.display = "block"; // Show error message
  }

  // Handle login form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value.trim();
    const errorDiv = document.getElementById("login-error");

    // Reset previous errors
    errorDiv.textContent = "";
    errorDiv.style.display = "none";

    if (!email || !password) {
      showError("Email and password are required.");
      return;
    }

    loginUser(email, password);
  });

  function updateUI() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      usernameDisplay.textContent = username; // Set username text
      userDropdown.style.display = "block"; // Show user icon
      authButtons.style.display = "none"; // Hide login/signup buttons
    } else {
      userDropdown.style.display = "none"; // Hide user icon
      authButtons.style.display = "block"; // Show login/signup buttons
    }
  }

  async function fetchUserProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/user-profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("username", userData.username); // Ensure username is stored
        updateUI(); // Update UI after fetching user data
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  updateUI(); // Call function on page load
  fetchUserProfile(); // Fetch user data if token is present

  // Logout functionality
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    updateUI(); // Update UI after logout
    alert("Logged out successfully!");
    window.location.href = "index.html"; // Redirect to homepage
  });
});




