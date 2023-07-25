// Firebase to maintain blog posts
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

// Firebase project credentials
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
const blogPostsRef = ref(database, "blog-posts");

// Retrieve blog posts
onValue(blogPostsRef, (snapshot) => {
  const blogPosts = snapshot.val();
  let blogPostsHtml = "";

  for (const postId in blogPosts) {
    const post = blogPosts[postId];
    let bannerHtml = "";
    if (post.bannerUrl) {
      bannerHtml = `<img src="${post.bannerUrl}" alt="Banner">`;
    }

    // Truncate the content to a specific length
    const truncatedContent = truncateText(post.content, 400); // Adjust the truncation length as desired

    blogPostsHtml += `
      <div class="container blogging-content">
        <div class="blogImg">
          ${bannerHtml}
        </div>
        <div class="blogText">
          <h4>${post.title}</h4>
          <span class="date">${post.date} | By Admin</span>
          <p class="truncated-content">${truncatedContent}</p>
          <p class="full-content" style="display: none;">${post.content}</p>
          <button class="read-more-button" id="readmore" >Read More \u2193</button>
          <button class="read-less-button" id="readmore" style="display: none;">Read Less \u2191</button>
        </div>
      </div>
    `;
  }

  document.getElementById("blogging").innerHTML += blogPostsHtml;

  // Add event listeners to the "Read More" buttons
  const readMoreButtons = document.getElementsByClassName("read-more-button");
  Array.from(readMoreButtons).forEach((button) => {
    button.addEventListener("click", () => {
      const blogText = button.parentElement.querySelector(".truncated-content");
      const fullContent = button.parentElement.querySelector(".full-content");
      const readLessButton = button.parentElement.querySelector(".read-less-button");
      blogText.style.display = "none";
      fullContent.style.display = "block";
      button.style.display = "none";
      readLessButton.style.display = "block";

      // Scroll to the top of the article
      const articleTop = button.parentElement.parentElement.offsetTop;
      window.scrollTo({
        top: articleTop,
        behavior: "smooth",
      });
    });
  });

  // Add event listeners to the "Read Less" buttons
  const readLessButtons = document.getElementsByClassName("read-less-button");
  Array.from(readLessButtons).forEach((button) => {
    button.addEventListener("click", () => {
      const blogText = button.parentElement.querySelector(".truncated-content");
      const fullContent = button.parentElement.querySelector(".full-content");
      const readMoreButton = button.parentElement.querySelector(".read-more-button");
      blogText.style.display = "block";
      fullContent.style.display = "none";
      button.style.display = "none";
      readMoreButton.style.display = "block";

      // Scroll to the top of the article
      const articleTop = button.parentElement.parentElement.offsetTop;
      window.scrollTo({
        top: articleTop,
        behavior: "smooth",
      });
    });
  });
});

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncatedText = text.substr(0, maxLength);
  return truncatedText.substr(0, truncatedText.lastIndexOf(" ")) + "...";
}