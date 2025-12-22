// ================================
// Firebase Config (Firestore)
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
// Star Hover & Click
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  let selectedRating = 0;

  stars.forEach(star => {
    const value = parseInt(star.dataset.value);

    star.addEventListener("mouseover", () => {
      stars.forEach(s => {
        const v = parseInt(s.dataset.value);
        s.classList.remove("scale1","scale2","scale3","scale4","scale5","selected");
        if(v <= value){
          const scaleLevel = value - v + 1;
          s.classList.add(`scale${scaleLevel}`);
        } else {
          s.classList.add("scale5");
        }
      });
    });

    star.addEventListener("mouseout", () => updateStars());

    star.addEventListener("click", () => {
      selectedRating = value;
      updateStars();
    });
  });

  function updateStars() {
    stars.forEach(star => {
      const v = parseInt(star.dataset.value);
      star.classList.remove("scale1","scale2","scale3","scale4","scale5","selected");
      if(v <= selectedRating){
        const scaleLevel = selectedRating - v + 1;
        star.classList.add("selected");
        star.classList.add(`scale${scaleLevel}`);
      } else {
        star.classList.add("scale5");
      }
    });
  }

  // ================================
  // Submit Review
  // ================================
  document.getElementById("submitReview").addEventListener("click", async () => {
    const comments = document.getElementById("reviewText").value.trim();
    const email = document.getElementById("reviewEmail").value.trim();
    const selectedStar = document.querySelector('.stars input:checked');
    const rating = selectedStar ? parseInt(selectedStar.dataset.value) : 0;

    if(!comments || !email || rating === 0){
      alert("Please enter your email, a review, and select a rating.");
      return;
    }

    try {
      await firestore.collection("reviews").add({
        comments,
        email,
        rating,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch(err){
      console.error("Error saving review:", err);
      alert("There was an error submitting your review. Try again!");
      return;
    }

    // Reset form
    document.getElementById("reviewText").value = "";
    document.getElementById("reviewEmail").value = "";
    if(selectedStar) selectedStar.checked = false;
    selectedRating = 0;
    updateStars();
  });

  // ================================
  // Load Reviews in real-time
  // ================================
function loadReviews() {
  const list = document.getElementById("reviewsList");
  const totalReviewsEl = document.getElementById("totalReviews");
  const averageRatingEl = document.getElementById("averageRating");

  firestore.collection("reviews")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      let total = 0;
      let sum = 0;

      snapshot.forEach(doc => {
        const r = doc.data();
        total++;
        sum += r.rating;

        const div = document.createElement("div");
        div.classList.add("review");

        const emailP = document.createElement("p");
        emailP.classList.add("review-email");
        emailP.textContent = r.email;

        const starsDiv = document.createElement("div");
        starsDiv.classList.add("review-stars");
        starsDiv.textContent =
          "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

        const text = document.createElement("p");
        text.classList.add("review-text");
        text.textContent = r.comments;

        div.appendChild(emailP);
        div.appendChild(starsDiv);
        div.appendChild(text);

        list.appendChild(div);
      });

      // Update summary
      totalReviewsEl.textContent = total;
      averageRatingEl.textContent =
        total === 0 ? "0.0" : (sum / total).toFixed(1);
    });
}


  loadReviews();
});
