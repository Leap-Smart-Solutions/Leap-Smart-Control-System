import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  searchUsers 
} from "../src/js/firebase/userOperations.js";
import { EditUserModal } from "./components/EditUserModal.js";
import { db } from "../src/js/firebase/firebaseConfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};

// Initialize edit modal
const editModal = new EditUserModal();

// Function to get user's latest order address
async function getUserAddress(userId) {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Get the most recent order
      const latestOrder = querySnapshot.docs[0].data();
      if (latestOrder.customer) {
        return {
          address: latestOrder.customer.address || '-',
          city: latestOrder.customer.city || '-',
          town: latestOrder.customer.town || '-'
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching user address:', error);
    return null;
  }
}

// Function to create address display modal
function createAddressModal() {
  const modal = document.createElement('div');
  modal.className = 'address-modal';
  modal.innerHTML = `
    <div class="address-modal-header">
      <h3>Address Details</h3>
      <button class="address-modal-close">&times;</button>
    </div>
    <div class="address-modal-content">
      <p><span>Address:</span> <span class="address-value"></span></p>
      <p><span>City:</span> <span class="city-value"></span></p>
      <p><span>Town:</span> <span class="town-value"></span></p>
    </div>
  `;
  
  const overlay = document.createElement('div');
  overlay.className = 'address-modal-overlay';
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Close modal when clicking close button or overlay
  modal.querySelector('.address-modal-close').addEventListener('click', () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });
  
  overlay.addEventListener('click', () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });
  
  return modal;
}

// Function to show address modal
function showAddressModal(addressData) {
  const modal = document.querySelector('.address-modal') || createAddressModal();
  const overlay = document.querySelector('.address-modal-overlay');
  
  modal.querySelector('.address-value').textContent = addressData.address;
  modal.querySelector('.city-value').textContent = addressData.city;
  modal.querySelector('.town-value').textContent = addressData.town;
  
  modal.classList.add('active');
  overlay.classList.add('active');
}

// Function to pad text with dots if longer than 20 chars
function padTextWithDots(text, length = 20) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Function to create a user row
async function createUserRow(user, index) {
  const statusClass = user.phoneVerified === true ? 'status-active' : 'status-unactive';
  const addressData = await getUserAddress(user.id);
  const addressText = addressData ? padTextWithDots(`${addressData.address}, ${addressData.city}, ${addressData.town}`) : '-';
  
  return `
    <div class="table-row">
      <div class="user-image-cell">
        <img src="${user.profilePicture || 'https://i.ibb.co/277hTSg8/generic-profile.jpg'}" alt="${user.fullName || user.username || user.name}" class="user-image" />
      </div>
      <div class="name-cell">${user.fullName || user.username || user.name}</div>
      <div class="email-cell">${user.email}</div>
      <div class="city-cell">${user.username || '-'}</div>
      <div class="phone-cell">${user.phone || '-'}</div>
      <div class="status-cell ${statusClass}">${user.phoneVerified === true ? 'true' : 'false'}</div>
      <div class="address-cell" data-user-id="${user.id}">${addressText}</div>
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
  const rows = await Promise.all(usersToRender.map((user, index) => createUserRow(user, index)));
  usersList.innerHTML = rows.join("");
  initDropdowns();
  initUserActions();
  initAddressClicks();
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

// Initialize address clicks
function initAddressClicks() {
  document.querySelectorAll('.address-cell').forEach(cell => {
    cell.addEventListener('click', async () => {
      const userId = cell.dataset.userId;
      const addressData = await getUserAddress(userId);
      if (addressData) {
        showAddressModal(addressData);
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
