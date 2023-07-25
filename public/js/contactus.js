// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, push } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyARIm3oun3kA__y5c9Tof7VZ8072JFov5g",
    authDomain: "miyenfoodsblog.firebaseapp.com",
    databaseURL: "https://miyenfoodsblog-default-rtdb.firebaseio.com",
    projectId: "miyenfoodsblog",
    storageBucket: "miyenfoodsblog.appspot.com",
    messagingSenderId: "956097013175",
    appId: "1:956097013175:web:ab9b03253142878c393432"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


  const submitContactForm = (event) => {
    event.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const reason = document.getElementById("reason").value;
    const message = document.getElementById("review").value;
  
    // Create a new contact submission object
    const submission = {
      name,
      email,
      phone,
      reason,
      message,
      timestamp: new Date().toISOString(),
    };
  
    // Get a reference to the 'contactSubmissions' collection in Firebase
    const contactSubmissionsRef = ref(database, "contactSubmissions");
  
    // Push the submission data to Firebase
    push(contactSubmissionsRef, submission)
      .then(() => {
        // Clear form inputs after successful submission
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("reason").value = "";
        document.getElementById("review").value = "";
  
        console.log("Contact form data submitted successfully.");
        alert("Thank you for contacting us. We have received your message and will get back to you shortly.");
      })
      .catch((error) => {
        console.error("Error submitting contact form:", error);
      });
  };
  
  const contactForm = document.getElementById("review-form");
if (contactForm) {
  contactForm.addEventListener("submit", submitContactForm);
}
