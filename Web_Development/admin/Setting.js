// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Menu Toggle Functionality
  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenu = document.querySelector(".close-menu");
  const sidebar = document.querySelector(".sidebar");

  // Toggle menu - show sidebar when menu is clicked
  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
    menuToggle.style.display = "none";
  });

  // Close menu - hide sidebar when close is clicked
  closeMenu.addEventListener("click", () => {
    sidebar.classList.remove("active");
    menuToggle.style.display = "flex";
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("active");
      if (window.innerWidth <= 992) {
        menuToggle.style.display = "flex";
      }
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      menuToggle.style.display = "none";
      sidebar.classList.remove("active");
    } else if (!sidebar.classList.contains("active")) {
      menuToggle.style.display = "flex";
    }
  });

  // DOM Elements
  const loadingContainer = document.querySelector(".loading-container");
  const adminName = document.getElementById("adminName");
  const adminFullName = document.getElementById("adminFullName");
  const adminProfilePic = document.getElementById("adminProfilePic");
  const profileImagePreview = document.getElementById("profileImagePreview");
  const profileImage = document.getElementById("profileImage");
  const currentEmail = document.getElementById("currentEmail");
  const currentPassword = document.getElementById("currentPassword");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const passwordModal = document.getElementById("passwordModal");
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Admin data (replace with actual data from your backend)
  const admin = {
    userName: "Administrator",
    image: "Img/mo.jpg",
    fallbackImage: "https://i.ibb.co/tptmQ9jw/admin-Photoroom.png",
    email: "mohamed.hassan@example.com"
  };

  // Initialize the page
  function initializePage() {
    // Set initial values
    adminName.textContent = getFirstName(admin.userName);
    adminFullName.textContent = admin.userName;
    
    // Set profile images with fallback
    const setProfileImage = (imgElement) => {
      imgElement.onerror = () => {
        imgElement.src = admin.fallbackImage;
      };
      imgElement.src = admin.image;
    };
    
    setProfileImage(adminProfilePic);
    setProfileImage(profileImagePreview);
    
    currentEmail.value = admin.email;

    // Hide loading screen
    loadingContainer.classList.add("hidden");
  }

  // Get first name
  function getFirstName(name) {
    return name.split(" ")[0];
  }

  // Modal functionality
  function openPasswordModal() {
    passwordModal.style.display = "block";
    // Clear form fields when opening modal
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  }

  function closePasswordModal() {
    passwordModal.style.display = "none";
  }

  // Event Listeners
  changePasswordBtn.addEventListener("click", openPasswordModal);
  closeModalBtn.addEventListener("click", closePasswordModal);
  
  // Close modal when clicking outside
  window.addEventListener("click", function(event) {
    if (event.target === passwordModal) {
      closePasswordModal();
    }
  });

  // Handle profile image upload
  profileImage.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const newImageSrc = e.target.result;
        profileImagePreview.src = newImageSrc;
        adminProfilePic.src = newImageSrc;
        admin.image = newImageSrc;
      };
      reader.onerror = () => {
        profileImagePreview.src = admin.fallbackImage;
        adminProfilePic.src = admin.fallbackImage;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle password form submission
  document.getElementById("passwordForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const newPasswordValue = newPassword.value;
    const confirmPasswordValue = confirmPassword.value;

    if (newPasswordValue !== confirmPasswordValue) {
      alert("New passwords do not match!");
      return;
    }

    // Add your password update logic here
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    alert("Password updated successfully!");
    closePasswordModal();
  });

  // Handle logout
  logoutBtn.addEventListener("click", function() {
    if (confirm("Are you sure you want to logout?")) {
      // Add your logout logic here
      window.location.href = "login.html";
    }
  });

  // Initialize the page
  initializePage();
});
