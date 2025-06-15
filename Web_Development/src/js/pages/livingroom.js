// Import Firebase modules
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { app } from "../../js/firebase/firebaseConfig.js";

// Initialize Firebase Realtime Database
const database = getDatabase(app);
const lightsRef = ref(database, 'Lights/stat');
const doorRef = ref(database, 'Door/stat');

// Light state (1 = on, 0 = off)
let lightState = 0;
// Door state (1 = open, 0 = closed)
let doorState = 0;

// Get DOM elements
const lightToggleBtn = document.getElementById('lightToggle');
const doorToggleBtn = document.querySelector('.doorlock-detailes > i:nth-child(2)');

// Update UI based on current light state
function updateLightUI(state) {
  if (state === 1) {
    lightToggleBtn.classList.add('active');
    lightToggleBtn.style.color = '#ff6600';
    lightToggleBtn.style.transform = 'scale(1.2)';
    lightToggleBtn.style.transition = 'all 0.3s ease';
    lightToggleBtn.title = 'Light is ON';
  } else {
    lightToggleBtn.classList.remove('active');
    lightToggleBtn.style.color = '#666';
    lightToggleBtn.style.transform = 'scale(1)';
    lightToggleBtn.title = 'Light is OFF';
  }
}

// Update UI based on current door state
function updateDoorUI(state) {
  if (state === 1) {
    doorToggleBtn.classList.add('active');
    doorToggleBtn.style.color = '#ff6600';
    doorToggleBtn.style.transform = 'scale(1.2)';
    doorToggleBtn.style.transition = 'all 0.3s ease';
    doorToggleBtn.title = 'Door is OPEN';
  } else {
    doorToggleBtn.classList.remove('active');
    doorToggleBtn.style.color = '#666';
    doorToggleBtn.style.transform = 'scale(1)';
    doorToggleBtn.title = 'Door is CLOSED';
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
      // Add visual feedback
      lightToggleBtn.style.transform = 'scale(1.3)';
      setTimeout(() => {
        lightToggleBtn.style.transform = lightState === 1 ? 'scale(1.2)' : 'scale(1)';
      }, 200);
    })
    .catch((error) => {
      console.error("Error updating light state:", error);
    });
}

// Toggle door state in Firebase
function toggleDoor() {
  // Toggle state (0 to 1, 1 to 0)
  doorState = doorState === 0 ? 1 : 0;
  
  // Update Firebase
  set(doorRef, doorState)
    .then(() => {
      console.log(`Door ${doorState === 1 ? 'OPENED' : 'CLOSED'}`);
      // Add visual feedback
      doorToggleBtn.style.transform = 'scale(1.3)';
      setTimeout(() => {
        doorToggleBtn.style.transform = doorState === 1 ? 'scale(1.2)' : 'scale(1)';
      }, 200);
    })
    .catch((error) => {
      console.error("Error updating door state:", error);
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

// Listen for door state changes in Firebase
onValue(doorRef, (snapshot) => {
  const data = snapshot.val();
  if (data !== null) {
    doorState = data;
    updateDoorUI(doorState);
  }
});

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add click event to light toggle button
  lightToggleBtn.addEventListener('click', toggleLight);
  
  // Add click event to door toggle button
  doorToggleBtn.addEventListener('click', toggleDoor);
  
  // Add some styling to show active state
  const style = document.createElement('style');
  style.textContent = `
    .fa-power-off {
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .fa-power-off:hover {
      opacity: 0.8;
    }
    .fa-power-off.active {
      color: #ff6600;
    }
  `;
  document.head.appendChild(style);

  // Initialize UI states
  updateLightUI(lightState);
  updateDoorUI(doorState);
}); 