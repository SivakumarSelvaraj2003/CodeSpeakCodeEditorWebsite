//dark mode and light mode
var icon = document.getElementById("icon");
icon.onclick = function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    icon.src = "images/crescent-moon-png-35116 (1).png";
    document.body.style.backgroundImage =
      "url('background image.png')".backgroundSize = "contain";
  } else {
    icon.src =  "images/sun-256.png";
  }
};



/* const passwordInput = document.querySelector("#password");
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
}); */




//form validation
 const form = document.querySelector("#form");
        const userName = document.querySelector("#name");
        const email = document.querySelector("#email");
        const password = document.querySelector("#password");

        document.getElementById("showFormBtn").addEventListener("click", function () {
            const form = document.getElementById("signupForm");
            form.classList.toggle("hidden");
        });

        form.addEventListener("submit", (e) => {
            if (!validateInputs()) {
                e.preventDefault();
            }
        });

        function validateInputs() {
            const usernameVal = userName.value.trim();
            const emailVal = email.value.trim();
            const passwordVal = password.value.trim();
            let success = true;

            // Validate username
            if (usernameVal === "") {
                setError(userName, "Name is required");
                success = false;
            } else {
                setSuccess(userName);
            }

            // Validate email
            if (emailVal === "") {
                setError(email, "Email is required");
                success = false;
            } else if (!validateEmail(emailVal)) {
                setError(email, "Please enter a valid email");
                success = false;
            } else {
                setSuccess(email);
            }

            // Validate password
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

        function setError(element, message) {
            const inputGroup = element.parentElement;
            const errorElement = inputGroup.querySelector(".error");
            errorElement.innerText = message;
            inputGroup.classList.add("error"); // Correct class addition
            inputGroup.classList.remove("success");
        }

        function setSuccess(element) {
            const inputGroup = element.parentElement;
            const errorElement = inputGroup.querySelector(".error");
            errorElement.innerText = "";
            inputGroup.classList.add("success"); // Correct class addition
            inputGroup.classList.remove("error");
        }

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        }; 
        const validatePassword = (password) => {
            return String(password).match(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*#?&><)(^-_]{8,100}$/
            );
        }; 
    

        //fancy password


          (()=>{
  var to;
  var fields = document.querySelectorAll('[type=fancyPassword]');
  Array.from(fields).forEach(ele=>{
    ele.setAttribute("data-value", "");
    ele.addEventListener('keyup', function(){
        if(to) clearTimeout(to);
        if(!this.value.length) return;
        var typed = this.value.split('').pop();
        this.setAttribute("data-value", this.getAttribute("data-value")+typed);
        this.value = "•".repeat(this.value.length-1)+typed;
        to = setTimeout(()=>this.value = "•".repeat(this.value.length),500);
    });
  });
})();
       
   










       /*  document
          .getElementById("form")
          .addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission for validation

            // Clear previous error messages
            clearErrors();

            const username = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            let valid = true;

            // Validate Username
            if (!validateUsername(username)) {
              setError(
                document.getElementById("name"),
                "Username must be at least 3 characters long and cannot contain spaces."
              );
              valid = false;
            } else {
              setSuccess(document.getElementById("name"));
            }

            // Validate Email
            if (!validateEmail(email)) {
              setError(
                document.getElementById("email"),
                "Please enter a valid email address."
              );
              valid = false;
            } else {
              setSuccess(document.getElementById("email"));
            }

            // Validate Password
            if (!validatePassword(password)) {
              setError(
                document.getElementById("password"),
                "Password must include uppercase, lowercase, number, special character, and be 8-100 characters long."
              );
              valid = false;
            } else {
              setSuccess(document.getElementById("password"));
            }

            // If all fields are valid, submit the form or perform the desired action
            if (valid) {
              // Perform form submission or other actions
              console.log("Form submitted successfully!");
            }
          });

        function validateUsername(username) {
          return username.length >= 3 && !/\s/.test(username);
        }

        function validateEmail(email) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(email);
        }

        function validatePassword(password) {
          const re =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*#?&><)(^-_]{8,100}$/;
          return re.test(password);
        }

        function setError(element, message) {
          const inputGroup = element.parentElement;
          const errorElement = inputGroup.querySelector(".error");
          errorElement.innerText = message;
          inputGroup.classList.add("error");
          inputGroup.classList.remove("success");
        }

        function setSuccess(element) {
          const inputGroup = element.parentElement;
          const errorElement = inputGroup.querySelector(".error");
          errorElement.innerText = "";
          inputGroup.classList.add("success");
          inputGroup.classList.remove("error");
        }

        function clearErrors() {
          const errorElements = document.querySelectorAll(".error");
          errorElements.forEach((errorElement) => {
            errorElement.innerText = "";
          });

          const inputGroups = document.querySelectorAll(".inputGroup");
          inputGroups.forEach((group) => {
            group.classList.remove("error", "success");
          });
        }
 */