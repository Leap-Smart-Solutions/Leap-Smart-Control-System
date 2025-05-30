// Initialize inventory from localStorage or use empty array if none exists
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// Component types
const componentTypes = [
  "Esp-01s",
  "Relay",
  "MPU-6050",
  "Lipo battery",
  "PCB",
  "Esp-32 CAM",
];

// Keep track of the last used ID
let lastUsedId = 0;
if (inventory.length > 0) {
  // Find the highest ID number in the existing inventory
  lastUsedId = Math.max(...inventory.map((item) => parseInt(item.id)));
} else {
  // Start from 0 if no items exist
  lastUsedId = 0;
}

// DOM Elements
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const closeMenu = document.querySelector(".close-menu");
const inventoryForm = document.getElementById("addInventoryForm");
const componentCards = document.getElementById("componentCards");
const inventoryList = document.getElementById("inventoryList");
const descriptionModal = document.getElementById("descriptionModal");
const descriptionModalBody = document.getElementById("descriptionModalBody");
const descriptionModalClose = document.querySelector(
  ".description-modal-close"
);

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

// Generate unique ID for components
function generateComponentId() {
  lastUsedId++;
  return String(lastUsedId).padStart(3, "0");
}

// Calculate component statistics
function calculateComponentStats() {
  return componentTypes.map((type) => {
    const components = inventory.filter((item) => item.type === type);
    const totalQuantity = components.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalValue = components.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const averagePrice = components.length ? totalValue / totalQuantity : 0;

    return {
      type,
      quantity: totalQuantity,
      totalValue: totalValue,
      averagePrice: averagePrice,
    };
  });
}

// Render component cards
function renderComponentCards() {
  const stats = calculateComponentStats();
  componentCards.innerHTML = stats
    .map(
      (stat) => `
    <div class="component-card">
      <h3>${stat.type}</h3>
      <div class="component-stats">
        <div class="stat-item">
          <p class="stat-label">Quantity</p>
          <p class="stat-value">${stat.quantity}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Total Value</p>
          <p class="stat-value">$${stat.totalValue.toFixed(2)}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Avg. Price</p>
          <p class="stat-value">$${stat.averagePrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Render inventory table
function renderInventoryTable() {
  inventoryList.innerHTML = inventory
    .map((item) => {
      const shortDescription =
        item.description.length > 30
          ? item.description.substring(0, 30) + "..."
          : item.description;

      return `
      <div class="table-row" data-id="${item.id}">
        <div class="id-cell">${item.id}</div>
        <div class="image-cell">
          <img src="${item.image}" alt="${
        item.type
      }" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
        </div>
        <div class="type-cell">${item.type}</div>
        <div class="price-cell">$${item.price.toFixed(2)}</div>
        <div class="quantity-cell">${item.quantity}</div>
        <div class="description-cell" onclick="showDescriptionModal('${
          item.type
        }', '${item.description.replace(
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
          <button class="edit-btn" onclick="editComponent('${
            item.id
          }')" title="Edit Component">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="delete-btn" onclick="deleteComponent('${
            item.id
          }')" title="Delete Component">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

// Show description modal
function showDescriptionModal(componentName, description) {
  const modalContent = `
    <div class="description-modal-header">
      <h3 class="description-modal-title">${componentName}</h3>
      <span class="description-modal-close">&times;</span>
    </div>
    <div class="description-modal-body">
      ${description}
    </div>
  `;
  descriptionModal.querySelector(".description-modal-content").innerHTML =
    modalContent;

  // Reattach close button event listener
  document
    .querySelector(".description-modal-close")
    .addEventListener("click", () => {
      descriptionModal.style.display = "none";
    });

  descriptionModal.style.display = "block";
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === descriptionModal) {
    descriptionModal.style.display = "none";
  }
});

// Adjust component quantity
function adjustQuantity(componentId, adjustment) {
  const componentIndex = inventory.findIndex((item) => item.id === componentId);
  if (componentIndex !== -1) {
    const newQuantity = inventory[componentIndex].quantity + adjustment;
    if (newQuantity >= 0) {
      inventory[componentIndex].quantity = newQuantity;
      saveAndRender();
    }
  }
}

// Delete component
function deleteComponent(componentId) {
  if (confirm("Are you sure you want to delete this component?")) {
    inventory = inventory.filter((item) => item.id !== componentId);
    saveAndRender();
  }
}

// Edit component
let editingComponentId = null;

function editComponent(componentId) {
  const component = inventory.find((item) => item.id === componentId);
  if (!component) return;

  editingComponentId = componentId;

  // Fill form with component data
  document.getElementById("componentType").value = component.type;
  document.getElementById("componentPrice").value = component.price;
  document.getElementById("componentQuantity").value = component.quantity;
  document.getElementById("componentDescription").value = component.description;

  // Show image preview
  document.getElementById(
    "imagePreview"
  ).innerHTML = `<img src="${component.image}" alt="Preview">`;

  // Change submit button text
  document.querySelector(".submit-btn").textContent = "Update Component";

  // Scroll to form
  document
    .querySelector(".add-inventory-section")
    .scrollIntoView({ behavior: "smooth" });
}

// Handle form submission
inventoryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const imageInput = document.getElementById("componentImage");
  const typeInput = document.getElementById("componentType");
  const priceInput = document.getElementById("componentPrice");
  const quantityInput = document.getElementById("componentQuantity");
  const descriptionInput = document.getElementById("componentDescription");

  if (editingComponentId) {
    // Update existing component
    const componentIndex = inventory.findIndex(
      (item) => item.id === editingComponentId
    );
    if (componentIndex !== -1) {
      const updatedComponent = { ...inventory[componentIndex] };

      if (typeInput.value) updatedComponent.type = typeInput.value;
      if (priceInput.value)
        updatedComponent.price = parseFloat(priceInput.value);
      if (quantityInput.value)
        updatedComponent.quantity = parseInt(quantityInput.value);
      if (descriptionInput.value)
        updatedComponent.description = descriptionInput.value;
      if (imageInput.files[0]) {
        updatedComponent.image = URL.createObjectURL(imageInput.files[0]);
      }

      inventory[componentIndex] = updatedComponent;
      editingComponentId = null;
      document.querySelector(".submit-btn").textContent = "Add Component";
    }
  } else {
    // Add new component
    if (!imageInput.files[0]) {
      alert("Please select an image");
      return;
    }

    const newComponent = {
      id: generateComponentId(),
      type: typeInput.value,
      price: parseFloat(priceInput.value),
      quantity: parseInt(quantityInput.value),
      description: descriptionInput.value,
      image: URL.createObjectURL(imageInput.files[0]),
    };
    inventory.push(newComponent);
  }

  // Save and render
  saveAndRender();

  // Reset form
  e.target.reset();
  document.getElementById("imagePreview").innerHTML = `
    <i class="fa-solid fa-cloud-arrow-up"></i>
    <span>Upload Image</span>
  `;
});

// Handle image preview
document
  .getElementById("componentImage")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("imagePreview").innerHTML = `
        <img src="${e.target.result}" alt="Preview">
      `;
      };
      reader.readAsDataURL(file);
    }
  });

// Save to localStorage and render
function saveAndRender() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderComponentCards();
  renderInventoryTable();
}

// Initial render
renderComponentCards();
renderInventoryTable();
