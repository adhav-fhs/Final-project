// ---------- FIREBASE CONFIG ----------
const firebaseConfig = {
  apiKey: "AIzaSyDL1SFXlYH_WwXYNXu6Q74LXGacEztnacs",
  authDomain: "bites-of-india-8fa73.firebaseapp.com",
  projectId: "bites-of-india-8fa73",
  storageBucket: "bites-of-india-8fa73.appspot.com",
  messagingSenderId: "237371321420",
  appId: "1:237371321420:web:acee71337ade380bcbd8e9",
  measurementId: "G-CCDHW22L1B"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ---------- USER ID (ONE RATING PER USER) ----------
let userId = localStorage.getItem("bitesUserId");
if (!userId) {
  userId = "user_" + Math.random().toString(36).slice(2);
  localStorage.setItem("bitesUserId", userId);
}

// ---------- DOM ----------
const dishList = document.getElementById("dishList");
const addDishBtn = document.querySelector(".addDishBtn");
const dishNameInput = document.getElementById("dishName");
const dishDescInput = document.getElementById("dishDesc");

// ---------- HELPERS ----------
function calculateAverage(ratings = {}) {
  const values = Object.values(ratings);
  if (values.length === 0) return "No ratings";
  const sum = values.reduce((a, b) => a + b, 0);
  return (sum / values.length).toFixed(1);
}

function createStarsHTML(docId) {
  return `
    <div class="stars">
      <input type="radio" id="${docId}-5" name="star-${docId}" value="5">
      <label class="star" for="${docId}-5">★</label>

      <input type="radio" id="${docId}-4" name="star-${docId}" value="4">
      <label class="star" for="${docId}-4">★</label>

      <input type="radio" id="${docId}-3" name="star-${docId}" value="3">
      <label class="star" for="${docId}-3">★</label>

      <input type="radio" id="${docId}-2" name="star-${docId}" value="2">
      <label class="star" for="${docId}-2">★</label>

      <input type="radio" id="${docId}-1" name="star-${docId}" value="1">
      <label class="star" for="${docId}-1">★</label>
    </div>
  `;
}

// ---------- RENDER DISH ----------
function renderDish(doc) {
  const data = doc.data();
  const ratings = data.ratings || {};
  const avg = calculateAverage(ratings);

  const card = document.createElement("div");
  card.className = "dish-card";

  card.innerHTML = `
    <div class="dish-info">
      <h3>${data["recipe-name"]}</h3>
      <p>${data["recipe-description"]}</p>

      ${createStarsHTML(doc.id)}

      <p><strong>⭐ ${avg}</strong> (${Object.keys(ratings).length} votes)</p>
    </div>
  `;

  // ---------- RESTORE USER'S RATING ----------
  const userRating = ratings[userId];
  if (userRating) {
    const checkedStar = card.querySelector(
      `input[value="${userRating}"]`
    );
    if (checkedStar) checkedStar.checked = true;
  }

  // ---------- STAR CLICK HANDLER ----------
  card.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", async () => {
      const value = Number(input.value);
      try {
        await db.collection("recipes").doc(doc.id).update({
          [`ratings.${userId}`]: value
        });
      } catch (err) {
        console.error("Error updating rating:", err);
      }
    });
  });

  dishList.prepend(card);
}

// ---------- REAL-TIME LISTENER ----------
db.collection("recipes")
  .orderBy(firebase.firestore.FieldPath.documentId())
  .onSnapshot((snapshot) => {
    dishList.innerHTML = "";
    snapshot.forEach(renderDish);
  });

// ---------- ADD DISH ----------
addDishBtn.addEventListener("click", async () => {
  const name = dishNameInput.value.trim();
  const desc = dishDescInput.value.trim();

  if (!name || !desc) return;

  try {
    await db.collection("recipes").add({
      "recipe-name": name,
      "recipe-description": desc,
      ratings: {}
    });

    dishNameInput.value = "";
    dishDescInput.value = "";
  } catch (err) {
    console.error("Error adding dish:", err);
  }
});
