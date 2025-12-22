// ================================
// Firebase Config
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyDL1SFXlYH_WwXYNXu6Q74LXGacEztnacs",
  authDomain: "bites-of-india-8fa73.firebaseapp.com",
  projectId: "bites-of-india-8fa73",
  storageBucket: "bites-of-india-8fa73.firebasestorage.app",
  messagingSenderId: "237371321420",
  appId: "1:237371321420:web:acee71337ade380bcbd8e9",
  measurementId: "G-CCDHW22L1B"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// ================================
// DOM
// ================================
const reviewCard = document.getElementById("homeReviewCard");
const emailEl = reviewCard.querySelector(".home-review-email");
const textEl = reviewCard.querySelector(".home-review-text");
const starsEl = reviewCard.querySelector(".home-review-stars");

let reviews = [];
let currentIndex = 0;

// ================================
// Load Reviews
// ================================
function loadHomeReviews() {
  firestore.collection("reviews")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      reviews = snapshot.docs.map(doc => doc.data());
      if (reviews.length > 0) {
        currentIndex = 0;
        showReview(currentIndex);
      }
    });
}

// ================================
// Show review
// ================================
function showReview(index) {
  const r = reviews[index];
  if (!r) return;

  emailEl.textContent = r.email;

  // truncate message to 80 chars
  let msg = r.comments;
  if (msg.length > 80) msg = msg.slice(0, 77) + "...";
  textEl.textContent = msg;

  starsEl.textContent = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
}

// ================================
// Slide reviews every 5 seconds
// ================================
function startReviewSlider() {
  setInterval(() => {
    if (reviews.length === 0) return;
    currentIndex = (currentIndex + 1) % reviews.length;
    slideToReview(currentIndex);
  }, 5000);
}

// ================================
// Slide animation
// ================================
function slideToReview(index) {
  // slide out to left
  reviewCard.style.transform = "translateX(100%)";
  reviewCard.style.opacity = "0";

  setTimeout(() => {
    showReview(index);
    // slide in from right
    reviewCard.style.transition = "none";
    reviewCard.style.transform = "translateX(-100%)";
    reviewCard.style.opacity = "0.5";

    setTimeout(() => {
      reviewCard.style.transition = "transform 0.5s ease, opacity 0.5s ease";
      reviewCard.style.transform = "translateX(0)";
      reviewCard.style.opacity = "1";
    }, 50);
  }, 500);
}

// ================================
// Click to view full review
// ================================
reviewCard.addEventListener("click", () => {
  const r = reviews[currentIndex];
  if (!r) return;
  alert(`Email: ${r.email}\nRating: ${r.rating} ⭐\n\n${r.comments}`);
});

// ================================
// Init
// ================================
loadHomeReviews();
startReviewSlider();
