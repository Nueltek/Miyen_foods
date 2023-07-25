import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

// Replace the following placeholders with your Firebase project credentials
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

// Dynamically update the current year
const currentYearElement = document.getElementById("current-year");
if (currentYearElement) {
  const currentYear = new Date().getFullYear();
  currentYearElement.textContent = currentYear;
}
const user = JSON.parse(sessionStorage.getItem("user"));
// Quantity selection
const quantityInput = document.getElementById('quantity');
const btnMinus = document.querySelector('.btn-minus');
const btnPlus = document.querySelector('.btn-plus');

if (btnMinus && btnPlus && quantityInput) {
  btnMinus.addEventListener('click', () => {
    if (quantityInput.value > 1) {
      quantityInput.value--;
    }
  });

  btnPlus.addEventListener('click', () => {
    quantityInput.value++;
  });
}

// Toggle the menu
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const closebtn = document.getElementById("closebtn");


if (bar && nav && closebtn) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });

  closebtn.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}
  // handling sidebar 




// Display online status
const onlineStatus = document.getElementById("online-user");
const onlineStatusm = document.getElementById("online-userm");
if (onlineStatus) {

  if (user && user.email) {
    onlineStatus.classList.add("online-user");
    onlineStatusm.classList.add("online-user");
  }
}




// Star rating for 'leave us a review' form
const stars = document.querySelectorAll('.stars input[type="radio"]');
const ratingInput = document.createElement('input');
ratingInput.setAttribute('type', 'hidden');
ratingInput.setAttribute('name', 'rating');
const ratingContainer = document.getElementById('rating');

if (ratingContainer && stars.length > 0) {
  ratingContainer.appendChild(ratingInput);

  stars.forEach((star, index) => {
    star.addEventListener('change', () => {
      ratingInput.value = index + 1;
      console.log(ratingInput.value);
    });
  });



  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const review = document.getElementById('review').value;
      const rating = ratingInput.value;
  
      // Save the review data to Firebase
      const reviewsRef = ref(database, 'reviews');
      const newReviewRef = push(reviewsRef);
      set(newReviewRef, {
        name: name,
        email: email,
        review: review,
        rating: rating
      });
  
      // Clear input fields
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('review').value = '';
      ratingInput.value = '';
  
      // Display a success message (optional)
      alert('Thank you for your review, we really appreciate!');
    });
  }
  
}
