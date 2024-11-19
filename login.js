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
  const form = document.querySelector("form");

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

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    console.log("Email:", email);
    console.log("Password:", password);

    alert(
      "Login form submitted! (This is a demo and does not actually submit)"
    );
  });
});

//fancy password

(() => {
  var to;
  var fields = document.querySelectorAll("[type=fancyPassword]");
  Array.from(fields).forEach((ele) => {
    ele.setAttribute("data-value", "");
    ele.addEventListener("keyup", function () {
      if (to) clearTimeout(to);
      if (!this.value.length) return;
      var typed = this.value.split("").pop();
      this.setAttribute("data-value", this.getAttribute("data-value") + typed);
      this.value = "•".repeat(this.value.length - 1) + typed;
      to = setTimeout(() => (this.value = "•".repeat(this.value.length)), 500);
    });
  });
})();


      document.addEventListener("DOMContentLoaded", function () {
        const form = document.querySelector("form");
        const emailInput = document.querySelector("input[name='username']"); // Use 'username' for email input
        const passwordInput = document.querySelector("input[name='password']");

        form.addEventListener("submit", function (event) {
          let valid = true;

          // Clear previous error messages
          const errorMessages = document.querySelectorAll(".error-message");
          errorMessages.forEach((msg) => {
            msg.innerText = ""; // Clear any previous messages
          });

          // Validate email format
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailInput.value) {
            valid = false;
            displayErrorMessage(emailInput, "Email cannot be empty.");
          } else if (!emailPattern.test(emailInput.value)) {
            valid = false;
            displayErrorMessage(
              emailInput,
              "Please enter a valid email address."
            );
          }

          // Check if the email and password match the predefined credentials
          const predefinedEmail = "siva4142@example.com"; // Replace with your predefined email
          const predefinedPassword = "12345678";

          if (
            valid &&
            (emailInput.value !== predefinedEmail ||
              passwordInput.value !== predefinedPassword)
          ) {
            valid = false;
            displayErrorMessage(emailInput, "Invalid email or password.");
          }

          // If invalid, prevent form submission
          if (!valid) {
            event.preventDefault(); // Prevent form submission
          }
        });

        function displayErrorMessage(inputElement, message) {
          // Find the error message div following the input element
          const errorDiv = inputElement.nextElementSibling;
          errorDiv.className = "error-message text-danger"; // Ensure it has the correct class for styling
          errorDiv.innerText = message; // Set the error message text
        }
      });