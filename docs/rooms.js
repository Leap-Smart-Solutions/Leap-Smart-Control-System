document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu");
  const dropdownMenu = document.querySelector(".display-nav-links");

  // Initially hide the dropdown
  dropdownMenu.style.display = "none";

  menuIcon.addEventListener("click", function (event) {
    // Toggle dropdown visibility
    if (dropdownMenu.style.display === "none") {
      dropdownMenu.style.display = "block";
    } else {
      dropdownMenu.style.display = "none";
    }

    // Prevent the click from closing the menu immediately
    event.stopPropagation();
  });

  document.addEventListener("click", function (event) {
    if (!dropdownMenu.contains(event.target) && event.target !== menuIcon) {
      dropdownMenu.style.display = "none";
    }
  });
});
