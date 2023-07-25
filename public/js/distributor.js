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

// Get current date and time
const getCurrentDateTime = () => {
    const currentDateTime = new Date();
    const date = currentDateTime.toLocaleDateString();
    const time = currentDateTime.toLocaleTimeString();
    return { date, time };
  };
// Capture and send the distributor form data to Firebase
const submitDistributorForm = (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const companyName = document.getElementById('company-name').value;
    const industry = document.getElementById('industry').value;
    const message = document.getElementById('message').value;
  
    // Get the current date and time
   // Get current date and time
   const { date, time } = getCurrentDateTime();
  
    // Create a new distributor submission object with the form data and current date/time
    const submission = {
        name,
        email,
        phone,
        companyName,
        industry,
        message,
        date,
        time,
      };
    // Get a reference to the 'distributorSubmissions' collection in Firebase
    const distributorSubmissionsRef = ref(database, 'distributorSubmissions');
  
    // Push the submission data to Firebase
    push(distributorSubmissionsRef, submission)
      .then(() => {
        // Clear form inputs after successful submission
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('company-name').value = '';
        document.getElementById('industry').value = '';
        document.getElementById('message').value = '';
  
        console.log('Distributor form data submitted successfully.');
        alert("Thank you for expressing your interest. We have received your details, and we will get back to you as soon as possible.")
      })
      .catch((error) => {
        console.error('Error submitting distributor form:', error);
      });
  };
  
  // Attach the submit event listener to the distributor form
const distributorForm = document.getElementById('review-form');
if (distributorForm) {
  distributorForm.addEventListener('submit', submitDistributorForm);
}