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

// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
  email: "mohamed.hassan@example.com",
  inventory: {
    remainingItems: 150,
    remainingParts: 300,
  },
};

// Functions
// get the first name
const getFirstName = function (name) {
  const first = name.split(" ")[0];
  return first;
};

// Handle image preview
function setupProfileImagePreview() {
  const imageInput = document.getElementById("profileImage");
  const imagePreview = document.getElementById("profileImagePreview");

  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Handle form submissions
function handleSettingsSubmit(e) {
  e.preventDefault();
  const formId = e.target.id;

  switch (formId) {
    case "photoForm":
      // Handle photo update
      const newPhoto = document.getElementById("profileImage").files[0];
      if (newPhoto) {
        admin.image = URL.createObjectURL(newPhoto);
        updateAdminDisplay();
      }
      break;

    case "emailForm":
      // Handle email update
      const newEmail = document.getElementById("newEmail").value;
      if (newEmail) {
        admin.email = newEmail;
        alert("Email updated successfully!");
      }
      break;

    case "passwordForm":
      // Handle password update
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
      }
      // Add your password validation logic here
      alert("Password updated successfully!");
      break;
  }
}

// Handle logout
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    // Add your logout logic here
    window.location.href = "login.html"; // Redirect to login page
  }
}

// Display the dashboard content
const displayDashboard = function () {
  const html = `
    <header class="dashboard-header">
      <div class="profile">
        <h2>Welcome, <span>${getFirstName(admin.userName)}</span></h2>
      </div>
      <div class="admin-info">
        <img src="${admin.image}" alt="Admin" />
        <span>${admin.userName}</span>
      </div>
    </header>
    
    <div class="settings-container">
      <!-- Photo Section -->
      <div class="settings-section">
        <h3>Profile Photo</h3>
        <form id="photoForm" onsubmit="handleSettingsSubmit(event)">
          <div class="photo-preview">
            <img id="profileImagePreview" src="${
              admin.image
            }" alt="Profile Preview">
          </div>
          <div class="form-group">
            <label for="profileImage">Change Photo</label>
            <input type="file" id="profileImage" accept="image/*">
          </div>
          <button type="submit">Update Photo</button>
        </form>
      </div>

      <!-- Email Section -->
      <div class="settings-section">
        <h3>Email Settings</h3>
        <form id="emailForm" onsubmit="handleSettingsSubmit(event)">
          <div class="form-group">
            <label for="currentEmail">Current Email</label>
            <input type="email" id="currentEmail" value="${
              admin.email
            }" disabled>
          </div>
          <div class="form-group">
            <label for="newEmail">New Email</label>
            <input type="email" id="newEmail" required>
          </div>
          <button type="submit">Update Email</button>
        </form>
      </div>

      <!-- Password Section -->
      <div class="settings-section">
        <h3>Change Password</h3>
        <form id="passwordForm" onsubmit="handleSettingsSubmit(event)">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" required>
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input type="password" id="newPassword" required>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" required>
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>

      <!-- Logout Section -->
      <div class="settings-section">
        <h3>Logout</h3>
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
      </div>
    </div>
  `;

  document.querySelector(".main-content").innerHTML = html;
  setupProfileImagePreview();
};

// Function to update admin display after changes
function updateAdminDisplay() {
  const adminImage = document.querySelector(".admin-info img");
  const profilePreview = document.getElementById("profileImagePreview");
  if (adminImage) adminImage.src = admin.image;
  if (profilePreview) profilePreview.src = admin.image;
}

// Initialize the page
displayDashboard();
