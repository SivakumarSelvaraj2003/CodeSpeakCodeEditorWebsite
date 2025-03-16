// Dark Mode Toggle
var icon = document.getElementById("icon");
icon.onclick = function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    icon.src = "images/crescent-moon-png-35116 (1).png";
    document.body.style.backgroundImage = "url('background-image.png')";
  } else {
    icon.src = "images/sun-256.png";
  }
};

// Show/Hide Password
const passwordInput = document.querySelector("#password");
const togglePasswordIcon = document.querySelector("#togglePassword");

togglePasswordIcon.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePasswordIcon.classList.remove("fa-eye");
    togglePasswordIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    togglePasswordIcon.classList.remove("fa-eye-slash");
    togglePasswordIcon.classList.add("fa-eye");
  }
});

// Show/Hide Form
document.getElementById("showFormBtn").addEventListener("click", function () {
  const form = document.getElementById("signupForm");
  form.classList.toggle("hidden");
});

// Initialize Password Data-Value Attribute
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#password").setAttribute("data-value", "");
});

// Form Validation and Submission
const form = document.querySelector("#form");
const userName = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

// Update password field's data-value on input
password.addEventListener("input", function () {
  this.setAttribute("data-value", this.value);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateInputs()) return; // Prevent submission if validation fails

  const username = userName.value.trim();
  const emailVal = email.value.trim();
  const passwordVal = password.getAttribute("data-value");

  try {
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email: emailVal,
        password: passwordVal,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Signup Successful!");
      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
});

// Input Validation
function validateInputs() {
  const usernameVal = userName.value.trim();
  const emailVal = email.value.trim();
  const passwordVal = password.getAttribute("data-value") || "";
  let success = true;

  if (usernameVal === "") {
    setError(userName, "Name is required");
    success = false;
  } else {
    setSuccess(userName);
  }

  if (emailVal === "") {
    setError(email, "Email is required");
    success = false;
  } else if (!validateEmail(emailVal)) {
    setError(email, "Please enter a valid email");
    success = false;
  } else {
    setSuccess(email);
  }

  if (passwordVal === "") {
    setError(password, "Password is required");
    success = false;
  } else if (!validatePassword(passwordVal)) {
    setError(
      password,
      "Password must include uppercase, lowercase, number, special character, and be 8-100 characters long."
    );
    success = false;
  } else {
    setSuccess(password);
  }

  return success;
}

// Set Error Message
function setError(element, message) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = message;
  inputGroup.classList.add("error");
  inputGroup.classList.remove("success");
}

// Set Success
function setSuccess(element) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = "";
  inputGroup.classList.add("success");
  inputGroup.classList.remove("error");
}

// Validate Email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
};

// Validate Password
const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*#?&><)(^-_]{8,100}$/.test(
    password
  );
};


