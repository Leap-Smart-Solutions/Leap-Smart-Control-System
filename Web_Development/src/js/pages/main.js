"use strict";
const dateEl = document.querySelector(".date");
const subMenu = document.querySelector(".display-nav-links");
const menuIcon = document.querySelector(".menu");
let isMenuOpen = false;

const updateDate = function () {
  const today = new Date();
  const dateOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  const dateFormat = today.toLocaleDateString("en-US", dateOptions);
  dateEl.textContent = dateFormat;
};
updateDate();

// Mobile menu toggle functionality
function initializeMenuToggle() {
  if (menuIcon && subMenu) {
    menuIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      isMenuOpen = !isMenuOpen;
      subMenu.style.display = isMenuOpen ? 'block' : 'none';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuIcon.contains(e.target) && !subMenu.contains(e.target)) {
        isMenuOpen = false;
        subMenu.style.display = 'none';
      }
    });

    // Prevent clicks inside the menu from closing it
    subMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

function handleResize() {
  if (window.innerWidth <= 768) {
    // Show mobile menu elements
    if (subMenu) {
      subMenu.style.display = 'none';
    }
  } else {
    // Hide mobile menu on larger screens
    if (subMenu) {
      subMenu.style.display = 'none';
    }
  }
}

// Run on page load
handleResize();

// Listen for window resize
window.addEventListener("resize", handleResize);

if(document.getElementById('play')) {
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");

  playButton.addEventListener("click", () => {
    playButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    // Add logic to play audio
  });

  pauseButton.addEventListener("click", () => {
    pauseButton.style.display = "none";
    playButton.style.display = "inline-block";
    // Add logic to pause audio
  });
}

// Initialize menu toggle when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeMenuToggle();
});
