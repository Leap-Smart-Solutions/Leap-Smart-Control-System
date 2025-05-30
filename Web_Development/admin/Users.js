// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};

// Users Data
const users = [
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "0121212112",
    status: "Active",
    image: "Img/mo.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "0121211212",
    status: "UnActive",
    image: "Img/mo4.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "0121212122",
    status: "UnActive",
    image: "Img/mo2.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "0112121212",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "0121212122",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "0121221212",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "0121121212",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "012121212",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "012121212",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "012121212",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "1212121212",
    status: "Active",
    image: "Img/mo3.jpg",
  },
  {
    userName: "Mohamed Hassan",
    email: "mo@example.com",
    city: "Alexandria",
    phone: "012121",
    status: "Active",
    image: "Img/mo3.jpg",
  },
];

// Function to create a user row
function createUserRow(user, index) {
  return `
    <div class="table-row">
      <div class="user-image-cell">
        <img src="${user.image}" alt="${user.userName}" class="user-image" />
      </div>
      <div class="name-cell">${user.userName}</div>
      <div class="email-cell">${user.email}</div>
      <div class="city-cell">${user.city}</div>
      <div class="phone-cell">${user.phone}</div>
      <div class="status-cell status-${user.status.toLowerCase()}">${
    user.status
  }</div>
      <div class="manage-cell">
        <button class="manage-btn" data-index="${index}">Manage ▾</button>
        <ul class="dropdown-menu hidden" id="dropdown-${index}">
          <li>Edit</li>
          <li>Delete</li>
        </ul>
      </div>
    </div>
  `;
}

// Function to render users
function renderUsers(usersToRender) {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = usersToRender
    .map((user, index) => createUserRow(user, index))
    .join("");
  initDropdowns();
}

// Function to filter users
function filterUsers(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  return users.filter(
    (user) =>
      user.phone.toLowerCase().includes(searchTerm) ||
      user.userName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
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
      const index = btn.dataset.index;
      const dropdown = document.getElementById(`dropdown-${index}`);

      // Close other dropdowns
      closeAllDropdowns();

      // Toggle current dropdown
      dropdown.classList.toggle("hidden");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", closeAllDropdowns);
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
document.addEventListener("DOMContentLoaded", () => {
  // Display admin header
  displayAdmin(admin);

  // Initial render
  renderUsers(users);

  // Search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filteredUsers = filterUsers(e.target.value);
    renderUsers(filteredUsers);
  });
});
