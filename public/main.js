// ---------- FIREBASE ----------
const firebaseConfig = {
  apiKey: "AIzaSyDL1SFXlYH_WwXYNXu6Q74LXGacEztnacs",
  authDomain: "bites-of-india-8fa73.firebaseapp.com",
  projectId: "bites-of-india-8fa73",
  storageBucket: "bites-of-india-8fa73.firebasestorage.app",
  messagingSenderId: "237371321420",
  appId: "1:237371321420:web:acee71337ade380bcbd8e9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ---------- DOM ----------
const card = document.getElementById("homeReviewCard");
const emailEl = document.querySelector(".home-review-email");
const textEl = document.querySelector(".home-review-text");
const starsEl = document.querySelector(".home-review-stars");

let reviews = [];
let index = 0;

// ---------- HELPERS ----------
function truncate(text, max = 120) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function renderReview(r) {
  emailEl.textContent = r.email;
  textEl.textContent = truncate(r.comments);
  starsEl.textContent =
    "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
}

// ---------- LOAD REVIEWS ----------
db.collection("reviews")
  .orderBy("createdAt", "desc")
  .limit(10)
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => reviews.push(doc.data()));

    if (reviews.length > 0) {
      renderReview(reviews[0]);

      setInterval(() => {
        index = (index + 1) % reviews.length;
        renderReview(reviews[index]);
      }, 30000);
    }
  });

// ---------- CLICK → FULL PAGE ----------
card.addEventListener("click", () => {
  window.location.href = "reviews/reviews.html";
});
