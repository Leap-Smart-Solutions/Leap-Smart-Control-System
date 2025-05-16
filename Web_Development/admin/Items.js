// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
};
// Declare Variables
const itemPage = document.querySelector(".Items");

// Navigation elements
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const closeMenu = document.querySelector(".close-menu");
const mainContent = document.querySelector(".main-content");

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

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  const isClickInsideSidebar = sidebar.contains(e.target);
  const isClickOnMenuToggle = menuToggle.contains(e.target);

  if (
    !isClickInsideSidebar &&
    !isClickOnMenuToggle &&
    sidebar.classList.contains("active")
  ) {
    sidebar.classList.remove("active");
    menuToggle.style.opacity = "1";
    menuToggle.style.pointerEvents = "auto";
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    sidebar.classList.remove("active");
    menuToggle.style.display = "none";
  } else {
    menuToggle.style.display = "flex";
    if (!sidebar.classList.contains("active")) {
      menuToggle.style.opacity = "1";
      menuToggle.style.pointerEvents = "auto";
    }
  }
});

// Display the top header with search and admin info
function displayAdmin(admin) {
  const header = `
    <header class="dashboard-header">
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Search by ID, Type or Description..." />
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

// Initialize header
displayAdmin(admin);

// Event Handlers
itemPage.addEventListener("click", function (e) {
  e.preventDefault();
});

// Items array to store all items
let items = JSON.parse(localStorage.getItem("items")) || [];
let currentItemId = parseInt(localStorage.getItem("currentItemId")) || 1;
let editingItemId = null;

// Function to generate unique item ID
function generateItemId() {
  const id = `ITEM-${String(currentItemId).padStart(3, "0")}`;
  currentItemId++;
  localStorage.setItem("currentItemId", currentItemId);
  return id;
}

// Function to handle image preview
function setupImagePreview() {
  const imageInput = document.getElementById("itemImage");
  const imagePreview = document.getElementById("imagePreview");

  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Function to adjust item quantity
function adjustQuantity(itemId, adjustment) {
  const itemIndex = items.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    const newQuantity = items[itemIndex].quantity + adjustment;
    if (newQuantity >= 0) {
      items[itemIndex].quantity = newQuantity;
      localStorage.setItem("items", JSON.stringify(items));
      renderItems();
    }
  }
}

// Function to show description modal
function showDescriptionModal(description) {
  const modal = document.getElementById("descriptionModal");
  const modalBody = document.getElementById("descriptionModalBody");
  modalBody.textContent = description;
  modal.style.display = "block";
}

// Function to create an item row
function createItemRow(item) {
  const shortDescription =
    item.description.length > 30
      ? item.description.substring(0, 30) + "..."
      : item.description;

  return `
    <div class="table-row" data-id="${item.id}">
      <div class="id-cell">${item.id}</div>
      <div class="image-cell">
        <img src="${item.image}" alt="${item.type}" class="item-thumbnail">
      </div>
      <div class="type-cell">${item.type}</div>
      <div class="price-cell">$${item.price.toFixed(2)}</div>
      <div class="quantity-cell">${item.quantity}</div>
      <div class="description-cell" onclick="showDescriptionModal('${item.description.replace(
        /'/g,
        "\\'"
      )}')">${shortDescription}</div>
      <div class="actions-cell">
        <button class="quantity-btn subtract" onclick="adjustQuantity('${
          item.id
        }', -1)" title="Decrease Quantity">
          <i class="fas fa-minus"></i>
        </button>
        <button class="quantity-btn add" onclick="adjustQuantity('${
          item.id
        }', 1)" title="Increase Quantity">
          <i class="fas fa-plus"></i>
        </button>
        <button class="edit-btn" onclick="editItem('${
          item.id
        }')" title="Edit Item">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" onclick="deleteItem('${
          item.id
        }')" title="Delete Item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `;
}

// Function to render items
function renderItems(itemsToRender = items) {
  const itemsList = document.getElementById("itemsList");
  itemsList.innerHTML = itemsToRender
    .map((item) => createItemRow(item))
    .join("");
}

// Function to filter items
function filterItems(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  return items.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
  );
}

// Function to edit item
function editItem(itemId) {
  const item = items.find((item) => item.id === itemId);
  if (!item) return;

  editingItemId = itemId;

  // Fill form with item data
  document.getElementById("itemType").value = item.type || "";
  document.getElementById("itemPrice").value = item.price || "";
  document.getElementById("itemQuantity").value = item.quantity || "";
  document.getElementById("itemDescription").value = item.description || "";

  // Show image preview if exists
  if (item.image) {
    document.getElementById(
      "imagePreview"
    ).innerHTML = `<img src="${item.image}" alt="Preview">`;
  }

  // Change submit button text
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "Update Item";

  // Scroll to form
  document
    .querySelector(".add-item-section")
    .scrollIntoView({ behavior: "smooth" });
}

// Function to handle form submission (both add and edit)
function handleFormSubmit(e) {
  e.preventDefault();

  const imageInput = document.getElementById("itemImage");
  const typeInput = document.getElementById("itemType");
  const priceInput = document.getElementById("itemPrice");
  const quantityInput = document.getElementById("itemQuantity");
  const descriptionInput = document.getElementById("itemDescription");

  if (editingItemId) {
    // Update existing item
    const itemIndex = items.findIndex((item) => item.id === editingItemId);
    if (itemIndex !== -1) {
      // Only update fields that have been changed
      const updatedItem = { ...items[itemIndex] }; // Create a copy of the existing item

      if (typeInput.value) updatedItem.type = typeInput.value;
      if (priceInput.value) updatedItem.price = parseFloat(priceInput.value);
      if (quantityInput.value)
        updatedItem.quantity = parseInt(quantityInput.value);
      if (descriptionInput.value)
        updatedItem.description = descriptionInput.value;
      if (imageInput.files[0]) {
        updatedItem.image = URL.createObjectURL(imageInput.files[0]);
      }

      // Update the item in the array
      items[itemIndex] = updatedItem;

      // Reset editing state
      editingItemId = null;

      // Reset button text
      document.querySelector(".submit-btn").textContent = "Add Item";
    }
  } else {
    // Add new item - validate all fields including image
    if (
      !typeInput.value ||
      !priceInput.value ||
      !quantityInput.value ||
      !descriptionInput.value ||
      !imageInput.files[0]
    ) {
      alert("Please fill in all fields for new items");
      return;
    }

    // Add new item
    const newItem = {
      id: generateItemId(),
      type: typeInput.value,
      price: parseFloat(priceInput.value),
      quantity: parseInt(quantityInput.value),
      description: descriptionInput.value,
      image: URL.createObjectURL(imageInput.files[0]),
    };
    items.push(newItem);
  }

  // Save to localStorage
  localStorage.setItem("items", JSON.stringify(items));

  // Reset form
  e.target.reset();
  document.getElementById("imagePreview").innerHTML = `
    <i class="fa-solid fa-cloud-arrow-up"></i>
    <span>Upload Image</span>
  `;

  // Re-render items table
  renderItems();
}

// Function to delete item
function deleteItem(itemId) {
  if (confirm("Are you sure you want to delete this item?")) {
    items = items.filter((item) => item.id !== itemId);
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();

    // If the deleted item was being edited, reset the form
    if (editingItemId === itemId) {
      editingItemId = null;
      document.getElementById("addItemForm").reset();
      document.getElementById("imagePreview").innerHTML = `
        <i class="fa-solid fa-cloud-arrow-up"></i>
        <span>Upload Image</span>
      `;
      document.querySelector(".submit-btn").textContent = "Add Item";
    }
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Setup image preview
  setupImagePreview();

  // Setup form submission
  const addItemForm = document.getElementById("addItemForm");
  addItemForm.addEventListener("submit", handleFormSubmit);

  // Setup search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filteredItems = filterItems(e.target.value);
    renderItems(filteredItems);
  });

  // Setup modal close functionality
  const modal = document.getElementById("descriptionModal");
  const closeBtn = document.querySelector(".description-modal-close");

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Initial render
  renderItems();
});
