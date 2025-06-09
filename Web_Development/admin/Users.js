import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  searchUsers 
} from "../src/js/firebase/userOperations.js";
import { EditUserModal } from "./components/EditUserModal.js";
import { db, auth } from "../src/js/firebase/firebaseConfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initAdminAuthCheck } from '../src/js/firebase/adminAuthCheck.js';

// Initialize edit modal
const editModal = new EditUserModal();

// Function to get current admin data
async function getCurrentAdminData() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        unsubscribe();
        reject(new Error('No user logged in'));
        return;
      }

      try {
        // First check if user is an admin
        const adminsRef = collection(db, 'admins');
        const adminQuery = query(
          adminsRef,
          where('email', '==', user.email),
          where('userID', '==', user.uid)
        );
        const adminSnapshot = await getDocs(adminQuery);
        
        if (adminSnapshot.empty) {
          unsubscribe();
          reject(new Error('No admin data found'));
          return;
        }

        // Then get user data from users collection
        const usersRef = collection(db, 'users');
        const userQuery = query(
          usersRef,
          where('email', '==', user.email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          unsubscribe();
          reject(new Error('No user data found'));
          return;
        }

        const userData = userSnapshot.docs[0].data();
        unsubscribe();
        resolve({
          userName: userData.fullName || user.displayName || 'Admin',
          image: userData.profilePicture || 'https://i.ibb.co/277hTSg8/generic-profile.jpg'
        });
      } catch (error) {
        unsubscribe();
        reject(error);
      }
    });
  });
}

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
    modal.remove();
    overlay.remove();
  });
  
  overlay.addEventListener('click', () => {
    modal.remove();
    overlay.remove();
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

// Function to create email display modal
function createEmailModal() {
  const modal = document.createElement('div');
  modal.className = 'address-modal email-modal';
  modal.innerHTML = `
    <div class="address-modal-header">
      <h3>Email Details</h3>
      <button class="address-modal-close">&times;</button>
    </div>
    <div class="address-modal-content">
      <p><span>Email:</span> <span class="email-value"></span></p>
    </div>
  `;
  
  const overlay = document.createElement('div');
  overlay.className = 'address-modal-overlay';
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Close modal when clicking close button or overlay
  modal.querySelector('.address-modal-close').addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });
  
  overlay.addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });
  
  return modal;
}

// Function to show email modal
function showEmailModal(email) {
  const modal = document.querySelector('.email-modal') || createEmailModal();
  const overlay = document.querySelector('.address-modal-overlay');
  
  modal.querySelector('.email-value').textContent = email;
  
  modal.classList.add('active');
  overlay.classList.add('active');
}

// Function to create username display modal
function createUsernameModal() {
  const modal = document.createElement('div');
  modal.className = 'address-modal username-modal';
  modal.innerHTML = `
    <div class="address-modal-header">
      <h3>Username Details</h3>
      <button class="address-modal-close">&times;</button>
    </div>
    <div class="address-modal-content">
      <p><span>Username:</span> <span class="username-value"></span></p>
    </div>
  `;
  
  const overlay = document.createElement('div');
  overlay.className = 'address-modal-overlay';
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Close modal when clicking close button or overlay
  modal.querySelector('.address-modal-close').addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });
  
  overlay.addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });
  
  return modal;
}

// Function to show username modal
function showUsernameModal(username) {
  const modal = document.querySelector('.username-modal') || createUsernameModal();
  const overlay = document.querySelector('.address-modal-overlay');
  
  modal.querySelector('.username-value').textContent = username;
  
  modal.classList.add('active');
  overlay.classList.add('active');
}

// Function to create phone display modal
function createPhoneModal() {
  const modal = document.createElement('div');
  modal.className = 'address-modal phone-modal';
  modal.innerHTML = `
    <div class="address-modal-header">
      <h3>Phone Details</h3>
      <button class="address-modal-close">&times;</button>
    </div>
    <div class="address-modal-content">
      <p><span>Phone Number:</span> <span class="phone-value"></span></p>
    </div>
  `;
  
  const overlay = document.createElement('div');
  overlay.className = 'address-modal-overlay';
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Close modal when clicking close button or overlay
  modal.querySelector('.address-modal-close').addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });
  
  overlay.addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });
  
  return modal;
}

// Function to show phone modal
function showPhoneModal(phone) {
  const modal = document.querySelector('.phone-modal') || createPhoneModal();
  const overlay = document.querySelector('.address-modal-overlay');
  
  modal.querySelector('.phone-value').textContent = phone;
  
  modal.classList.add('active');
  overlay.classList.add('active');
}

// Function to pad text with dots if longer than specified length
function padTextWithDots(text, length) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Function to create a user row
async function createUserRow(user, index) {
  const statusClass = user.phoneVerified === true ? 'status-active' : 'status-unactive';
  const addressData = await getUserAddress(user.id);
  const addressText = addressData ? padTextWithDots(`${addressData.address}, ${addressData.city}, ${addressData.town}`, 20) : '-';
  const emailText = padTextWithDots(user.email, 15);
  const usernameText = padTextWithDots(user.username || '-', 11);
  const phoneText = padTextWithDots(user.phone || '-', 12);
  
  return `
    <div class="table-row">
      <div class="user-image-cell">
        <img src="${user.profilePicture || 'https://i.ibb.co/277hTSg8/generic-profile.jpg'}" alt="${user.fullName || user.username || user.name}" class="user-image" />
      </div>
      <div class="name-cell">${user.fullName || user.username || user.name}</div>
      <div class="email-cell" data-email="${user.email}">${emailText}</div>
      <div class="city-cell truncated" data-username="${user.username || '-'}">${usernameText}</div>
      <div class="phone-cell truncated" data-phone="${user.phone || '-'}">${phoneText}</div>
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
  initEmailClicks();
  initUsernameAndPhoneClicks();
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
async function displayAdmin() {
  try {
    const adminData = await getCurrentAdminData();
    console.log('Admin data retrieved:', adminData);

    // Remove existing header if it exists
    const existingHeader = document.querySelector('.dashboard-header');
    if (existingHeader) {
      existingHeader.remove();
    }

    const header = `
      <header class="dashboard-header">
        <div class="search-box">
          <input type="text" id="search-input" placeholder="Search by name, email or phone..." />
          <i class="fa fa-search"></i>
        </div>
        <div class="admin-info">
          <img src="${adminData.image}" alt="Admin" />
          <span>${adminData.userName}</span>
        </div>
      </header>
    `;

    const mainContent = document.querySelector(".main-content");
    if (!mainContent) {
      throw new Error('Main content element not found');
    }

    // Insert header at the beginning of main content
    mainContent.insertAdjacentHTML('afterbegin', header);
    console.log('Admin header inserted successfully');
  } catch (error) {
    console.error('Error displaying admin info:', error);
    // Redirect to login if not authenticated
    if (error.message === 'No user logged in' || error.message === 'No admin data found') {
      window.location.href = "login.html";
    }
  }
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

// Initialize email clicks
function initEmailClicks() {
  document.querySelectorAll('.email-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const email = cell.dataset.email;
      if (email) {
        showEmailModal(email);
      }
    });
  });
}

// Initialize username and phone clicks
function initUsernameAndPhoneClicks() {
  document.querySelectorAll('.city-cell.truncated').forEach(cell => {
    cell.addEventListener('click', () => {
      const username = cell.dataset.username;
      if (username) {
        showUsernameModal(username);
      }
    });
  });

  document.querySelectorAll('.phone-cell.truncated').forEach(cell => {
    cell.addEventListener('click', () => {
      const phone = cell.dataset.phone;
      if (phone) {
        showPhoneModal(phone);
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
async function initializePage() {
  try {
    // Create edit modal
    editModal.createModal();

    // Initialize admin auth check
    initAdminAuthCheck();

    // Display admin header
    await displayAdmin();

    // Initial render of users
    const users = await getAllUsers();
    await renderUsers(users);

    // Set up search functionality
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", async (e) => {
        const filteredUsers = await filterUsers(e.target.value);
        renderUsers(filteredUsers);
      });
    }

    // Listen for user updates
    document.addEventListener('userUpdated', async () => {
      const users = await getAllUsers();
      renderUsers(users);
    });
  } catch (error) {
    console.error("Error initializing users page:", error);
    alert("Error loading users. Please refresh the page.");
  }
}

// Start the page when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);
