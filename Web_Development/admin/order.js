// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};

// Order data
const orders = [
  {
    id: 1,
    name: "Ring Video Doorball 4",
    email: "john.doe@example.com",
    date: new Date(),
    reason:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam ipsa cumque ratione quidem esse, quasi asperiores omnis  iste minus labore corporis",
    status: "canceled",
  },
  {
    id: 2,
    name: "Ring Video Doorball 4",
    email: "sarah.smith@example.com",
    date: new Date(),
    reason: "-",
    status: "painting",
  },
  {
    id: 3,
    name: "Ring Video Doorball 4",
    email: "mike.wilson@example.com",
    date: new Date(),
    reason:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam ipsa cumque ratione quidem esse, quasi asperiores omnis  iste minus labore corporis",
    status: "canceled",
  },
  {
    id: 4,
    name: "Ring Video Doorball 4",
    email: "emma.brown@example.com",
    date: new Date(),
    reason: "Received",
    status: "completed",
  },
  {
    id: 5,
    name: "Ring Video Doorball 4",
    email: "alex.johnson@example.com",
    date: new Date(),
    reason: "Out of stock",
    status: "completed",
  },
  {
    id: 6,
    name: "Ring Video Doorball 4",
    email: "linda.martin@example.com",
    date: new Date(),
    reason: "Payment issue",
    status: "canceled",
  },
  {
    id: 7,
    name: "Ring Video Doorball 4",
    email: "david.james@example.com",
    date: new Date(),
    reason: "Delayed delivery",
    status: "painting",
  },
  {
    id: 8,
    name: "Ring Video Doorball 4",
    email: "chris.evans@example.com",
    date: new Date(),
    reason: "Returned due to damage",
    status: "canceled",
  },
  {
    id: 9,
    name: "Ring Video Doorball 4",
    email: "natalie.porter@example.com",
    date: new Date(),
    reason: "-",
    status: "completed",
  },
  {
    id: 10,
    name: "Ring Video Doorball 4",
    email: "tom.clark@example.com",
    date: new Date(),
    reason: "Replaced",
    status: "completed",
  },
  {
    id: 11,
    name: "Ring Video Doorball 4",
    email: "grace.lee@example.com",
    date: new Date(),
    reason: "Wrong item received",
    status: "canceled",
  },
  {
    id: 12,
    name: "Ring Video Doorball 4",
    email: "ryan.white@example.com",
    date: new Date(),
    reason: "Pending customer approval",
    status: "painting",
  },
  {
    id: 13,
    name: "Ring Video Doorball 4",
    email: "olivia.scott@example.com",
    date: new Date(),
    reason: "Partial refund processed",
    status: "completed",
  },
  {
    id: 14,
    name: "Ring Video Doorball 4",
    email: "jake.morris@example.com",
    date: new Date(),
    reason: "-",
    status: "completed",
  },
  {
    id: 15,
    name: "Ring Video Doorball 4",
    email: "amelia.watson@example.com",
    date: new Date(),
    reason: "Overcharged",
    status: "canceled",
  },
];

// Function to format date
function formatDate(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Function to truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Function to create an order row
function createOrderRow(order) {
  const truncatedReason = truncateText(order.reason, 15);
  return `
    <div class="table-row">
      <div class="order-id">#${order.id}</div>
      <div class="name">${order.name}</div>
      <div class="email">${order.email}</div>
      <div class="date">${formatDate(order.date)}</div>
      <div class="status-badge status-${order.status.toLowerCase()}">${
    order.status
  }</div>
      <div class="reason" onclick="showReason('${
        order.reason
      }')">${truncatedReason}</div>
      <div class="arrow">›</div>
    </div>
  `;
}

// Function to render orders
function renderOrders(ordersToRender) {
  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = ordersToRender
    .map((order) => createOrderRow(order))
    .join("");
}

// Function to filter orders by search input
function filterOrders(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  return orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm) ||
      order.name.toLowerCase().includes(searchTerm)
  );
}

// Function to show reason in modal
function showReason(reason) {
  const modal = document.getElementById("reasonModal");
  const modalText = document.getElementById("modalText");
  modalText.textContent = reason;
  modal.style.display = "block";
}

// Display the top header with search and admin info
function displayAdmin(admin) {
  const header = `
    <header class="dashboard-header">
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Search by Order Number, Email or Name..." />
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

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Display admin header
  displayAdmin(admin);

  // Initial render
  renderOrders(orders);

  // Menu toggle functionality
  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenu = document.querySelector(".close-menu");
  const sidebar = document.querySelector(".sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
  });

  closeMenu.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  });

  // Search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filteredOrders = filterOrders(e.target.value);
    renderOrders(filteredOrders);
  });

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter orders based on tab
      let filteredOrders = orders;
      const tabText = button.textContent.trim();

      if (tabText === "All Orders") {
        filteredOrders = orders;
      } else if (tabText === "Pending") {
        filteredOrders = orders.filter((order) => order.status === "painting");
      } else if (tabText === "Completed") {
        filteredOrders = orders.filter((order) => order.status === "completed");
      } else if (tabText === "Canceled") {
        filteredOrders = orders.filter((order) => order.status === "canceled");
      }

      renderOrders(filteredOrders);
    });
  });

  // Modal close functionality
  const modal = document.getElementById("reasonModal");
  const closeBtn = document.querySelector(".close");

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
