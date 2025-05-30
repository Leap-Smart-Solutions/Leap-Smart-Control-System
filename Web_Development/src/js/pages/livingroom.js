// Import Firebase modules
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { app } from "../../js/firebase/firebaseConfig.js";

// Initialize Firebase Realtime Database
const database = getDatabase(app);
const lightsRef = ref(database, 'Lights/stat');

// Light state (1 = on, 0 = off)
let lightState = 0;

// Get DOM elements
const lightToggleBtn = document.getElementById('lightToggle');

// Update UI based on current light state
function updateLightUI(state) {
  if (state === 1) {
    lightToggleBtn.classList.add('active');
    // You can add more UI changes here (change colors, show indicators, etc.)
  } else {
    lightToggleBtn.classList.remove('active');
  }
}

// Toggle light state in Firebase
function toggleLight() {
  // Toggle state (0 to 1, 1 to 0)
  lightState = lightState === 0 ? 1 : 0;
  
  // Update Firebase
  set(lightsRef, lightState)
    .then(() => {
      console.log(`Light turned ${lightState === 1 ? 'ON' : 'OFF'}`);
    })
    .catch((error) => {
      console.error("Error updating light state:", error);
    });
}

// Listen for changes in Firebase
onValue(lightsRef, (snapshot) => {
  const data = snapshot.val();
  if (data !== null) {
    lightState = data;
    updateLightUI(lightState);
  }
});

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add click event to light toggle button
  lightToggleBtn.addEventListener('click', toggleLight);
  
  // Add some styling to show active state
  const style = document.createElement('style');
  style.textContent = `
    .fa-power-off.active {
      color: #ff6600;
    }
  `;
  document.head.appendChild(style);
}); 