"use strict";
const dateEl = document.querySelector(".date");
const subMenu = document.querySelector(".display-nav-links");
const menuIcon = document.querySelector(".menu");

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

function toggleMenu() {
  subMenu.classList.toggle("hidden");
}

function handleResize() {
  if (window.innerWidth <= 768) {
    // Ensure event listener is added only once
    if (!menuIcon.hasAttribute("data-listener")) {
      menuIcon.addEventListener("click", toggleMenu);
      menuIcon.setAttribute("data-listener", "true"); // Prevents duplicate event listeners
    }
  } else {
    subMenu.classList.add("hidden"); // Hide menu on large screens
    menuIcon.removeEventListener("click", toggleMenu);
    menuIcon.removeAttribute("data-listener");
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
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelector(".nav-links");

  menuIcon.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
});
menuIcon.addEventListener("click", function () {
  if (subMenu.style.display === "none") {
    subMenu.style.display = "block";
  } else {
    subMenu.style.display = "none";sss
  }
});
