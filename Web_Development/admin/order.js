// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};

// Import Firebase modules
import { db } from "../src/js/firebase/firebaseConfig.js";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Function to format date
function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = timestamp.toDate();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Function to truncate text
function truncateText(text, maxLength) {
  if (!text || text === '-') return '-';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Function to fetch product details from Firestore
async function fetchProductDetails(productId) {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (productDoc.exists()) {
      return productDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

// Function to create an order row
async function createOrderRow(order) {
  // Get user email from users collection
  let userEmail = '-';
  try {
    const userDoc = await getDoc(doc(db, 'users', order.userId));
    if (userDoc.exists()) {
      userEmail = userDoc.data().email;
    }
  } catch (error) {
    console.error("Error fetching user email:", error);
  }

  // Fetch product details for each item
  let orderDetails = '-';
  let fullDetails = [];
  
  if (order.items && order.items.length > 0) {
    const detailsPromises = order.items.map(async (item) => {
      const productDetails = await fetchProductDetails(item.product_id);
      if (productDetails) {
        const totalPrice = (productDetails.price * item.quantity).toFixed(2);
        return {
          name: productDetails.name,
          image: productDetails.image,
          price: productDetails.price,
          quantity: item.quantity,
          totalPrice: totalPrice,
          summary: order.summary || null
        };
      }
      return null;
    });

    const details = await Promise.all(detailsPromises);
    fullDetails = details.filter(detail => detail !== null);
    
    // Create a summary string for the table display
    orderDetails = fullDetails.map(detail => 
      `${detail.name} (${detail.quantity})`
    ).join(', ');
  }

  const truncatedReason = truncateText(order.reason || '-', 15);
  const truncatedOrderId = truncateText(order.id, 15);
  const truncatedDetails = truncateText(orderDetails, 15);
  const statusOptions = ['pending', 'completed', 'canceled'];
  const statusSelect = `
    <select class="status-select status-${order.status.toLowerCase()}" data-order-id="${order.id}">
      ${statusOptions.map(opt => `<option value="${opt}" ${order.status === opt ? 'selected' : ''}>${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`).join('')}
    </select>
  `;
  return `
    <div class="table-row" data-order-id="${order.id}" data-reason="${order.reason || '-'}" data-details='${JSON.stringify(fullDetails)}'>
      <div class="order-id">#${truncatedOrderId}</div>
      <div class="details">${truncatedDetails}</div>
      <div class="email">${userEmail}</div>
      <div class="date">${formatDate(order.createdAt)}</div>
      <div class="status-cell">${statusSelect}</div>
      <div class="reason">${truncatedReason}</div>
      <div class="arrow">›</div>
    </div>
  `;
}

// Function to render orders
async function renderOrders(ordersToRender) {
  const ordersList = document.getElementById("ordersList");
  const orderRows = await Promise.all(ordersToRender.map(order => createOrderRow(order)));
  ordersList.innerHTML = orderRows.join("");
}

// Function to fetch orders from Firestore
async function fetchOrders() {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Function to filter orders by search input
function filterOrders(orders, searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  return orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm) ||
      order.items?.some(item => item.name.toLowerCase().includes(searchTerm))
  );
}

// Function to show reason in modal
function showReason(reason) {
  const modal = document.getElementById("reasonModal");
  const modalText = document.getElementById("modalText");
  modalText.textContent = reason;
  modal.style.display = "block";
}

// Function to show order ID in modal
function showOrderId(orderId) {
  const modal = document.getElementById("orderIdModal");
  const modalText = document.getElementById("orderIdModalText");
  modalText.textContent = orderId;
  modal.style.display = "block";
}

// Function to show details in modal
function showDetails(details) {
  const modal = document.getElementById("detailsModal");
  const modalText = document.getElementById("detailsModalText");
  
  try {
    const detailsArray = JSON.parse(details);
    
    // Format the details with proper styling
    const formattedDetails = detailsArray.map(item => {
      let summaryHtml = '';
      if (item.summary && typeof item.summary === 'object') {
        summaryHtml = `
          <div class="summary-table">
            <div><span>Shipping:</span> $${item.summary.shipping ?? '-'}</div>
            <div><span>Subtotal:</span> $${item.summary.subtotal ?? '-'}</div>
            <div><span>Tax:</span> $${item.summary.tax ?? '-'}</div>
            <div><span>Total:</span> $${item.summary.total ?? '-'}</div>
          </div>
        `;
      } else if (item.summary) {
        summaryHtml = `<div class="detail-summary">${item.summary}</div>`;
      } else {
        summaryHtml = `<div class="detail-summary">No summary available</div>`;
      }
      return `
        <div class="detail-item">
          <div class="detail-header">
            <img src="${item.image}" alt="${item.name}" class="detail-image">
            <div class="detail-info">
              <div class="detail-name">${item.name}</div>
              <div class="detail-price">
                <span>Price: $${item.price}</span>
                <span>Quantity: ${item.quantity}</span>
                <span>Total: $${item.totalPrice}</span>
              </div>
            </div>
          </div>
          ${summaryHtml}
        </div>
      `;
    }).join('');
    
    modalText.innerHTML = formattedDetails;
    modal.style.display = "block";
  } catch (error) {
    console.error("Error displaying details:", error);
    modalText.textContent = "Error displaying order details";
    modal.style.display = "block";
  }
}

// Display the top header with search and admin info
function displayAdmin(admin) {
  const header = `
    <header class="dashboard-header">
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Search by Order ID or Product Name..." />
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
document.addEventListener("DOMContentLoaded", async () => {
  // Display admin header
  displayAdmin(admin);

  // Fetch and render initial orders
  let orders = await fetchOrders();
  await renderOrders(orders);

  // Add event delegation for order ID, details, and reason clicks
  const ordersList = document.getElementById("ordersList");
  ordersList.addEventListener("click", (e) => {
    const row = e.target.closest(".table-row");
    if (!row) return;

    if (e.target.classList.contains("order-id")) {
      const orderId = row.dataset.orderId;
      showOrderId(orderId);
    } else if (e.target.classList.contains("details")) {
      const details = row.dataset.details;
      showDetails(details);
    } else if (e.target.classList.contains("reason")) {
      const reason = row.dataset.reason;
      showReason(reason);
    }
  });

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
    const filteredOrders = filterOrders(orders, e.target.value);
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
        filteredOrders = orders.filter((order) => order.status === "pending");
      } else if (tabText === "Completed") {
        filteredOrders = orders.filter((order) => order.status === "completed");
      } else if (tabText === "Canceled") {
        filteredOrders = orders.filter((order) => order.status === "canceled");
      }

      renderOrders(filteredOrders);
    });
  });

  // Modal close functionality for both modals
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.close');

  closeBtns.forEach(btn => {
    btn.onclick = function() {
      btn.closest('.modal').style.display = "none";
    }
  });

  window.onclick = function(event) {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  };

  // Event delegation for status change
  document.getElementById("ordersList").addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-select")) {
      const row = e.target.closest(".table-row");
      const orderId = e.target.dataset.orderId;
      const newStatus = e.target.value;
      let newReason = row.dataset.reason;
      if (newStatus === "canceled") {
        newReason = prompt("Please enter the reason for cancellation:", newReason !== '-' ? newReason : '');
        if (!newReason) {
          // If no reason entered, revert to previous status
          e.target.value = orders.find(o => o.id === orderId).status;
          return;
        }
      } else {
        newReason = '-';
      }
      // Update Firestore
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: newStatus,
          reason: newReason
        });
        // Update local orders array and re-render
        orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus, reason: newReason } : o);
        await renderOrders(orders);
      } catch (err) {
        alert("Failed to update order status. Please try again.");
        e.target.value = orders.find(o => o.id === orderId).status;
      }
    }
  });
});
