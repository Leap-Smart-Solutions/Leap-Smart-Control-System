import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  searchUsers 
} from "../src/js/firebase/userOperations.js";
import { EditUserModal } from "./components/EditUserModal.js";

// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};

// Initialize edit modal
const editModal = new EditUserModal();

// Function to create a user rowe
function createUserRow(user, index) {
  return `
    <div class="table-row">
      <div class="user-image-cell">
        <img src="${user.profilePicture || 'Img/default-avatar.jpg'}" alt="${user.fullName || user.username || user.name}" class="user-image" />
      </div>
      <div class="name-cell">${user.fullName || user.username || user.name}</div>
      <div class="email-cell">${user.email}</div>
      <div class="city-cell">${user.city || '         -         '}</div>
      <div class="phone-cell">${user.phone || '         -         '}</div>
      <div class="status-cell status-${user.phoneVerified || 'inactive'}">${user.phoneVerified || 'Inactive'}</div>
      <div class="manage-cell">
        <button class="manage-btn" data-user-id="${user.id}">Manage ▾</button>
        <ul class="dropdown-menu hidden" id="dropdown-${user.id}">
          <li class="edit-user" data-user-id="${user.id}">Edit</li>
          <li class="delete-user" data-user-id="${user.id}">Delete</li>
        </ul>
      </div>
    </div>
  `;
}

// Function to render users
async function renderUsers(usersToRender) {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = usersToRender
    .map((user, index) => createUserRow(user, index))
    .join("");
  initDropdowns();
  initUserActions();
}

// Function to filter users
async function filterUsers(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  const allUsers = await getAllUsers();
  return allUsers.filter(
    (user) =>
      (user.phone?.toLowerCase().includes(searchTerm)) ||
      (user.fullName?.toLowerCase().includes(searchTerm)) ||
      (user.username?.toLowerCase().includes(searchTerm)) ||
      (user.email?.toLowerCase().includes(searchTerm))
  );
}

// Display the top header with search and admin info
function displayAdmin(admin) {
  const header = `
    <header class="dashboard-header">
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Search by name, email or phone..." />
        <i class="fa fa-search"></i>
      </div>
      <div class="admin-info">
        <img src="${admin.image}" alt="Admin" />
        <span>${admin.userName}</span>
      </div>
    </header>
  `;
  document
    .querySelector(".main-content")
    .insertAdjacentHTML("afterbegin", header);
}

// Initialize dropdowns
function initDropdowns() {
  const buttons = document.querySelectorAll(".manage-btn");

  // Close all dropdowns
  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  }

  // Add click handlers to buttons
  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const userId = btn.dataset.userId;
      const dropdown = document.getElementById(`dropdown-${userId}`);

      // Close other dropdowns
      closeAllDropdowns();

      // Toggle current dropdown
      dropdown.classList.toggle("hidden");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", closeAllDropdowns);
}

// Initialize user actions (edit/delete)
function initUserActions() {
  // Edit user
  document.querySelectorAll('.edit-user').forEach(button => {
    button.addEventListener('click', async (e) => {
      const userId = e.target.dataset.userId;
      try {
        const user = await getUserById(userId);
        editModal.openModal(user);
      } catch (error) {
        console.error('Error fetching user for edit:', error);
        alert('Error fetching user details');
      }
    });
  });

  // Delete user
  document.querySelectorAll('.delete-user').forEach(button => {
    button.addEventListener('click', async (e) => {
      const userId = e.target.dataset.userId;
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await deleteUser(userId);
          // Refresh the user list
          const users = await getAllUsers();
          renderUsers(users);
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('Error deleting user');
        }
      }
    });
  });
}

// Navigation elements
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const closeMenu = document.querySelector(".close-menu");

// Navigation Toggle
menuToggle.addEventListener("click", () => {
  sidebar.classList.add("active");
  menuToggle.style.opacity = "0";
  menuToggle.style.pointerEvents = "none";
});

closeMenu.addEventListener("click", () => {
  sidebar.classList.remove("active");
  menuToggle.style.opacity = "1";
  menuToggle.style.pointerEvents = "auto";
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    sidebar.classList.remove("active");
    menuToggle.style.opacity = "1";
    menuToggle.style.pointerEvents = "auto";
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 993) {
    sidebar.classList.remove("active");
    menuToggle.style.opacity = "1";
    menuToggle.style.pointerEvents = "auto";
  }
});

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  // Create edit modal
  editModal.createModal();

  // Listen for user updates
  document.addEventListener('userUpdated', async () => {
    const users = await getAllUsers();
    renderUsers(users);
  });

  // Display admin header
  displayAdmin(admin);

  try {
    // Initial render
    const users = await getAllUsers();
    renderUsers(users);

    // Search functionality
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", async (e) => {
      const filteredUsers = await filterUsers(e.target.value);
      renderUsers(filteredUsers);
    });
  } catch (error) {
    console.error("Error initializing users page:", error);
    alert("Error loading users. Please refresh the page.");
  }
});
