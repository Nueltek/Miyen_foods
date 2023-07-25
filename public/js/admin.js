import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, push, update, remove, onValue, set } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js';

window.onload = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
   
    location.replace("/login.html");
    
  }
};
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
const storage = getStorage(app);





const postForm = document.getElementById("postForm");

const deleteButton = document.getElementById("deleteButton");

const cancelButton = document.getElementById("cancelButton");

let currentPostId = null;

// Save or update a blog post
const postsRef = ref(database, "blog-posts");
postForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = postForm.title.value;
  const content = postForm.content.value;
  const date = postForm.date.value;
  const bannerFile = postForm.banner.files[0];

  if (currentPostId) {
    // Update existing post
    const postRef = ref(database, `blog-posts/${currentPostId}`);
    const updates = {
      title,
      content,
      date
    };

    if (bannerFile) {
      // Upload banner image
      const newStorageRef = storageRef(storage, `banners/${currentPostId}`);
      uploadBytes(newStorageRef, bannerFile).then(() => {
        getDownloadURL(newStorageRef).then((url) => {
          updates.bannerUrl = url;
          update(postRef, updates);
          clearForm();
        });
      });
    } else {
      update(postRef, updates);
      clearForm();
    }
  } else {
    // Create new post
    const newPostRef = push(postsRef);
    const postId = newPostRef.key;

    const post = {
      title,
      content,
      date
    };

    if (bannerFile) {
      // Upload banner image
      const newStorageRef = storageRef(storage, `banners/${postId}`);
      uploadBytes(newStorageRef, bannerFile).then(() => {
        getDownloadURL(newStorageRef).then((url) => {
          post.bannerUrl = url;
          set(newPostRef, post);
          clearForm();
        });
      });
    } else {
      set(newPostRef, post);
      clearForm();
    }
  }
});



// Cancel editing a blog post
cancelButton.addEventListener("click", () => {
  clearForm();
});

// Clear the form and reset currentPostId
function clearForm() {
  postForm.reset();
  currentPostId = null;
}

// Initialize form fields with the selected post's data for editing
function initializeFormFields(post) {
  postForm.title.value = post.title;
  postForm.content.value = post.content;
  postForm.date.value = post.date;
}

// Function to handle editing a blog post
function editPost(postId, post) {
  // Set the form fields with the selected post's data
  initializeFormFields(post);

  // Set the currentPostId to the selected postId
  currentPostId = postId;
}

// Function to handle deleting a blog post
function deletePost(postId) {
  if (postId) {
    const postRef = ref(database, `blog-posts/${postId}`);
    remove(postRef);
    clearForm();
  }
}

// Listen for changes in the blog posts
onValue(postsRef, (snapshot) => {
  const blogPosts = snapshot.val();

  // Clear the existing blog posts
  const blogPostsContainer = document.getElementById("blogPosts");
  blogPostsContainer.innerHTML = "";

  // Render each blog post
  for (const postId in blogPosts) {
    const post = blogPosts[postId];
    const postElement = createPostElement(postId, post);
    blogPostsContainer.appendChild(postElement);
  }
});

// Function to create a blog post element
function createPostElement(postId, post) {
  // Create the container div for the blog post
  const postContainer = document.createElement("div");

  postContainer.classList.add("admin-container");

   // Create the image element
   if (post.bannerUrl) {
    const imageElement = document.createElement("img");
    imageElement.src = post.bannerUrl;
    imageElement.style.width = "500px"
    postContainer.appendChild(imageElement);
  }

  // Create the title element
  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;
  postContainer.appendChild(titleElement);

    // Create the date element
    const dateElement = document.createElement("p");
    dateElement.textContent = post.date;
    dateElement.style.color = "blue"
    postContainer.appendChild(dateElement);

  // Create the content element
  const contentElement = document.createElement("p");
  contentElement.textContent = post.content;
  postContainer.appendChild(contentElement);



  // Create the edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    // Handle the edit functionality here
    editPost(postId, post);
  });
  postContainer.appendChild(editButton);

  // Create the delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    // Handle the delete functionality here
    deletePost(postId);
  });
  postContainer.appendChild(deleteButton);

  return postContainer;
}



  // Retrieve the reviews data from Firebase
  const reviewsRef = ref(database, 'reviews');
  onValue(reviewsRef, (snapshot) => {
    const reviewsData = snapshot.val();

    // Render the reviews on the admin page
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML += '';

    for (const reviewId in reviewsData) {
      const review = reviewsData[reviewId];
      const reviewElement = document.createElement('div');
      reviewElement.id = `review-${reviewId}`; // Assign a unique ID to each review element
      reviewElement.innerHTML = `
        <h3>${review.name}</h3>
        <p>Email: ${review.email}</p>
        <p>Review: ${review.review}</p>
        <p>Rating: ${review.rating}</p>
        <button onclick="deleteReview('${reviewId}')">Delete</button> <!-- Add a delete button -->
      `;
      reviewsContainer.appendChild(reviewElement);
    }
  });

  // Function to delete a review
  window.deleteReview = function (reviewId) {
    const reviewElement = document.getElementById(`review-${reviewId}`);
    if (!reviewElement) {
      console.error(`Review element with ID ${reviewId} not found.`);
      return;
    }

    const reviewRef = ref(database, `reviews/${reviewId}`);
    remove(reviewRef)
      .then(() => {
        reviewElement.remove();
        console.log(`Review with ID ${reviewId} deleted successfully.`);
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
      });
    }


// Delete distributor submission
const deleteDistributorSubmission = (submissionId) => {
  const submissionRef = ref(database, `distributorSubmissions/${submissionId}`);
  remove(submissionRef)
    .then(() => {
      console.log('Distributor submission deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting distributor submission:', error);
    });
    location.reload()
};

// Render distributor submissions
const renderDistributorSubmissions = (submissions) => {
  const distributorContainer = document.getElementById('distributor-container');
  distributorContainer.innerHTML += '';

  if (submissions.length === 0) {
    distributorContainer.innerHTML = '<p>No distributor submissions found</p>';
    return;
  }

  submissions.forEach((submission) => {
    const submissionDiv = document.createElement('div');
    submissionDiv.classList.add('distributor-submission');

    const namePara = document.createElement('p');
    namePara.textContent = `Name: ${submission.name}`;
    submissionDiv.appendChild(namePara);

    const emailPara = document.createElement('p');
    emailPara.textContent = `Email: ${submission.email}`;
    submissionDiv.appendChild(emailPara);

    const phonePara = document.createElement('p');
    phonePara.textContent = `Phone: ${submission.phone}`;
    submissionDiv.appendChild(phonePara);

    const companyNamePara = document.createElement('p');
    companyNamePara.textContent = `Company Name: ${submission.companyName}`;
    submissionDiv.appendChild(companyNamePara);

    const industryPara = document.createElement('p');
    industryPara.textContent = `Industry: ${submission.industry}`;
    submissionDiv.appendChild(industryPara);

    const messagePara = document.createElement('p');
    messagePara.textContent = `Message: ${submission.message}`;
    submissionDiv.appendChild(messagePara);

    const datePara = document.createElement('p');
    datePara.textContent = `Date: ${submission.date}`;
    submissionDiv.appendChild(datePara);

    const timePara = document.createElement('p');
    timePara.textContent = `Time: ${submission.time}`;
    submissionDiv.appendChild(timePara);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteDistributorSubmission(submission.id);
    });
    submissionDiv.appendChild(deleteButton);

    distributorContainer.appendChild(submissionDiv);
  });
};

// Fetch and render distributor submissions
const fetchDistributorSubmissions = () => {
  const submissionsRef = ref(database, 'distributorSubmissions');
  onValue(submissionsRef, (snapshot) => {
    const submissions = [];
    snapshot.forEach((childSnapshot) => {
      const submission = {
        id: childSnapshot.key,
        name: childSnapshot.val().name,
        email: childSnapshot.val().email,
        phone: childSnapshot.val().phone,
        companyName: childSnapshot.val().companyName,
        industry: childSnapshot.val().industry,
        message: childSnapshot.val().message,
        date: childSnapshot.val().date,
        time: childSnapshot.val().time,
      };
      submissions.push(submission);
    });
    renderDistributorSubmissions(submissions);
  });
};

// Call fetchDistributorSubmissions to initially render the distributor submissions
fetchDistributorSubmissions();


// retrieving contact us data 
const fetchContactSubmissions = () => {
  // Get a reference to the 'contactSubmissions' collection in Firebase
  const contactSubmissionsRef = ref(database, "contactSubmissions");

  // Listen for changes in the contact submissions
  onValue(contactSubmissionsRef, (snapshot) => {
    const contactSubmissions = snapshot.val();

    // Render the contact submissions on the admin page
    const contactContainer = document.getElementById("contact-container");
    contactContainer.innerHTML += "";

    for (const submissionId in contactSubmissions) {
      const submission = contactSubmissions[submissionId];

      const submissionElement = document.createElement("div");
      submissionElement.id = `submission-${submissionId}`;
      submissionElement.innerHTML = `
        <h3>Name: ${submission.name}</h3>
        <p>Email: ${submission.email}</p>
        <p>Phone: ${submission.phone}</p>
        <p>Reason: ${submission.reason}</p>
        <p>Message: ${submission.message}</p>
        <p>Timestamp: ${submission.timestamp}</p>
        <button onclick="deleteSubmission('${submissionId}')">Delete</button>
      `;

      contactContainer.appendChild(submissionElement);
    }
  });
};

// Call the function to fetch and render contact submissions
fetchContactSubmissions();
window.deleteSubmission = function (submissionId) {
  const submissionRef = ref(database, `contactSubmissions/${submissionId}`);

  // Remove the submission from Firebase
  remove(submissionRef)
    .then(() => {
      console.log(`Contact submission ${submissionId} deleted successfully.`);
      location.reload()
    })
    .catch((error) => {
      console.error(`Error deleting contact submission ${submissionId}:`, error);
    });
   
  
};
const logout = document.getElementById("admin_logout_btn")

// logout admin
logout.addEventListener("click", () => {
  // clear sessionStorage and redirect user
  sessionStorage.clear()
  window.location.href="/login"
})