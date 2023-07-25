import { sendAuthData } from "./common.js";
import { showError } from "./common.js"
// Check if user is already logged in and redirect if necessary



const currentYear = new Date().getFullYear();
document.getElementById("current-year").textContent = currentYear;

const loader = document.querySelector(".loader");


// Toggle visibility of password field
const togglePasswordVisibility = (passwordInput, toggleBtn) => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.innerHTML = "&#x1f576;";
  } else {
    passwordInput.type = "password";
    toggleBtn.innerHTML = "&#x1F440;";
  }
};

// Validate email using a regular expression
const validateEmail = (email) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};


const firstNameInput = document.querySelector("#first-name") || null;
const lastNameInput = document.querySelector("#last-name") || null;
const emailInput = document.querySelector("#email");
const confirmPasswordInput = document.querySelector("#confirm-password") || null;
const termsCheckbox = document.querySelector("#terms") || null;
const passwordInput = document.querySelector("#password");


// Validate form data and perform sign-up or login action
const submitBtn = document.getElementById("submitBtn");


submitBtn.addEventListener("click", () => {


  // handle login page
  if( firstNameInput && confirmPasswordInput && lastNameInput && termsCheckbox ){
    const firstName = firstNameInput.value.trim() || null;
    const lastName = lastNameInput.value.trim() || null;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim() || null;
        // handle sign up
    if (!firstName) {
      showError("First name is required");
    }else if (!lastName) {
      showError("Last name is required");
    }else if (!email) {
      showError("Email is required");
    } else if (!validateEmail(email)) {
      showError("Invalid email address");
    }else if (!password) {
      showError("Password is required");
    }else if (password !== confirmPassword) {
      showError("Passwords do not match");
    }else if (!termsCheckbox.checked) {
      showError("Please agree to the terms and conditions");
    
    } else {
  
      loader.style.display = "block";
      sendAuthData("/signup", {
        firstName,
        lastName,
        email,
        password,
        termsCheckbox: termsCheckbox.checked,
        confirmPassword,
      });
    }
  }else if( emailInput && passwordInput){
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
      showError("Email is required");
    } else if (!validateEmail(email)) {
      showError("Invalid email address");
    }else if (!password) {
      showError("Password is required");
    }else{
      loader.style.display = "block"
      sendAuthData("/login", {
      email,
      password
    })
    }

  }
})




// Toggle password visibility when the corresponding button is clicked
const passwordInputForToggle = document.getElementById("password");
const confirmedPasswordInput = document.getElementById("confirm-password");

// ...

const passwordToggleBtn = document.querySelector(".toggle-btn");
passwordToggleBtn.addEventListener("click", () =>
  togglePasswordVisibility(passwordInputForToggle, passwordToggleBtn)
);

const passwordToggleBtn2 = document.querySelector(".toggle-btn2");
passwordToggleBtn2.addEventListener("click", () =>
  togglePasswordVisibility(confirmedPasswordInput, passwordToggleBtn2)
);
