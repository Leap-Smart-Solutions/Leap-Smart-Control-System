// Import Firebase configuration
import { db, auth } from '../src/js/firebase/firebaseConfig.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initAdminAuthCheck } from '../src/js/firebase/adminAuthCheck.js';

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
        // Get user data directly from users collection using the user's UID
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          unsubscribe();
          reject(new Error('No user data found'));
          return;
        }

        const userData = userDoc.data();
        unsubscribe();
        resolve({
          userName: userData.fullName || userData.displayName || user.displayName || 'Admin',
          image: userData.profilePicture || userData.image || user.photoURL || 'https://i.ibb.co/277hTSg8/generic-profile.jpg'
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        unsubscribe();
        reject(error);
      }
    });
  });
}

// Function to display admin header
async function displayAdmin() {
  try {
    const adminData = await getCurrentAdminData();
    const header = `
      <header class="dashboard-header">
        <div class="admin-info">
          <img src="${adminData.image}" alt="Admin" />
          <span>${adminData.userName}</span>
        </div>
      </header>
    `;
    document
      .querySelector(".main-content")
      .insertAdjacentHTML("afterbegin", header);
  } catch (error) {
    console.error('Error displaying admin info:', error);
    // Redirect to login if not authenticated
    if (error.message === 'No user logged in' || error.message === 'No admin data found') {
      window.location.href = "login.html";
    }
  }
}

// ImgBB API Key
const IMGBB_API_KEY = "7358f23b1f2d81c20df3232eaaee1567";

// Initialize inventory from localStorage or use empty array if none exists
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// Initialize admin auth check
initAdminAuthCheck();

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

// Reorder Modal Elements
const reorderModal = document.getElementById("reorderModal");
const reorderForm = document.getElementById("reorderForm");
const reorderComponent = document.getElementById("reorderComponent");
const reorderQuantity = document.getElementById("reorderQuantity");
const totalItems = document.getElementById("totalItems");
const totalCost = document.getElementById("totalCost");

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

// Fetch components from Firestore
async function fetchComponents() {
  try {
    const partsCollection = collection(db, 'parts');
    const querySnapshot = await getDocs(partsCollection);
    const components = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      components.push({
        id: doc.id,
        name: data.name,
        price: data.price,
        image: data.image,
        quantity: data.quantity,
        description: data.description
      });
    });
    
    return components;
  } catch (error) {
    console.error("Error fetching components:", error);
    return [];
  }
}

// Render component cards
async function renderComponentCards() {
  const components = await fetchComponents();
  
  componentCards.innerHTML = components
    .map(
      (component) => `
    <div class="component-card">
      <div class="component-image">
        <img src="${component.image}" alt="${component.name}" />
      </div>
      <h3>${component.name}</h3>
      <div class="component-stats">
        <div class="stat-item">
          <p class="stat-label">Quantity</p>
          <p class="stat-value">${component.quantity}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Price</p>
          <p class="stat-value">$${component.price.toFixed(2)}</p>
        </div>
      </div>
      <div class="component-description" onclick="showDescriptionModal('${component.name}', '${component.description?.replace(/'/g, "\\'") || 'No description available'}')">
        <p>${component.description ? (component.description.length > 15 ? component.description.substring(0, 15) + '...' : component.description) : 'No description available'}</p>
      </div>
      <div class="card-actions" style="display: flex; gap: 8px; justify-content: flex-end;">
        <button class="edit-btn card-edit-btn" title="Edit Component" onclick="editComponent('${component.id}')">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-btn card-delete-btn" title="Delete Component" onclick="deleteComponent('${component.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
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
  descriptionModal.querySelector(".description-modal-content").innerHTML = modalContent;

  // Reattach close button event listener
  document
    .querySelector(".description-modal-close")
    .addEventListener("click", () => {
      descriptionModal.style.display = "none";
    });

  descriptionModal.style.display = "block";
}

// Expose globally for HTML onclick
window.showDescriptionModal = showDescriptionModal;

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === descriptionModal) {
    descriptionModal.style.display = "none";
  }
});

// Adjust component quantity
async function adjustQuantity(componentId, adjustment) {
  try {
    const componentRef = doc(db, "parts", componentId);
    const componentDoc = await getDoc(componentRef);
    
    if (!componentDoc.exists()) {
      alert("Component not found!");
      return;
    }

    const currentQuantity = componentDoc.data().quantity;
    const newQuantity = currentQuantity + adjustment;

    if (newQuantity >= 0) {
      await updateDoc(componentRef, { quantity: newQuantity });
      await renderComponentCards();
      await renderInventoryTable();
    } else {
      alert("Quantity cannot be negative!");
    }
  } catch (error) {
    console.error("Error adjusting quantity:", error);
    alert("Failed to adjust quantity. Please try again.");
  }
}

// Delete component
async function deleteComponent(componentId) {
  if (confirm("Are you sure you want to delete this component?")) {
    try {
      await deleteDoc(doc(db, "parts", componentId));
      alert("Component deleted successfully!");
      
      // If the deleted component was being edited, reset the form
      if (editingComponentId === componentId) {
        const addInventoryForm = document.getElementById("addInventoryForm");
        const imagePreview = document.getElementById("imagePreview");
        addInventoryForm.reset();
        imagePreview.innerHTML = `
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <span>Upload Image</span>
        `;
        editingComponentId = null;
        document.querySelector(".submit-btn").textContent = "Add Component";
      }
      
      // Refresh the components list
      await renderComponentCards();
      await renderInventoryTable();
    } catch (error) {
      console.error("Error deleting component:", error);
      alert("Failed to delete component. Please try again.");
    }
  }
}

// Edit component
let editingComponentId = null;

async function editComponent(componentId) {
  try {
    // Get the component document
    const componentDoc = await getDoc(doc(db, "parts", componentId));
    if (!componentDoc.exists()) {
      alert("Component not found!");
      return;
    }

    const component = componentDoc.data();
    editingComponentId = componentId;

    // Fill form with component data
    document.getElementById("componentName").value = component.name || '';
    document.getElementById("componentPrice").value = component.price || '';
    document.getElementById("componentQuantity").value = component.quantity ?? '';
    document.getElementById("componentDescription").value = component.description || '';
    
    // Show image preview
    document.getElementById("imagePreview").innerHTML = `<img src="${component.image}" alt="Preview">`;

    // Change submit button text
    document.querySelector(".submit-btn").textContent = "Update Component";

    // Scroll to form
    document.querySelector(".add-inventory-section").scrollIntoView({ behavior: "smooth" });

    document.querySelector(".add-inventory-section h2").textContent = "Edit a component";
  } catch (error) {
    console.error("Error preparing edit:", error);
    alert("Error preparing component for edit. Please try again.");
  }
}

window.editComponent = editComponent;

// Handle form submission
inventoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imageInput = document.getElementById("componentImage");
  const nameInput = document.getElementById("componentName");
  const priceInput = document.getElementById("componentPrice");
  const quantityInput = document.getElementById("componentQuantity");
  const descriptionInput = document.getElementById("componentDescription");
  const submitBtn = document.querySelector(".submit-btn");

  // Validate inputs
  if (!nameInput.value || !priceInput.value || !quantityInput.value || !descriptionInput.value) {
    alert("Please fill in all required fields");
    return;
  }

  // Additional validation for new items
  if (!editingComponentId && !imageInput.files[0]) {
    alert("Please select an image for the new component");
    return;
  }

  try {
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = editingComponentId ? "Updating Component..." : "Adding Component...";

    let imageUrl;
    
    // Only handle image upload if a new image is selected
    if (imageInput.files[0]) {
      const file = imageInput.files[0];
      const reader = new FileReader();
      
      imageUrl = await new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64Data = reader.result.split(",")[1];
            const formData = new FormData();
            formData.append("key", IMGBB_API_KEY);
            formData.append("image", base64Data);

            const res = await fetch("https://api.imgbb.com/1/upload", {
              method: "POST",
              body: formData
            });
            
            const json = await res.json();
            if (!json.success) throw new Error(json.error.message);
            resolve(json.data.url);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    }

    // Prepare component data
    const componentData = {
      name: nameInput.value,
      price: parseFloat(priceInput.value),
      quantity: parseInt(quantityInput.value),
      description: descriptionInput.value
    };

    // Add image URL if a new image was uploaded
    if (imageUrl) {
      componentData.image = imageUrl;
    }

    if (editingComponentId) {
      // Update existing component
      await updateDoc(doc(db, "parts", editingComponentId), componentData);
      alert("Component updated successfully!");
    } else {
      // Add new component
      await addDoc(collection(db, "parts"), componentData);
      alert("Component added successfully!");
    }

    // Reset form and state
    e.target.reset();
    document.getElementById("imagePreview").innerHTML = `
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <span>Upload Image</span>
    `;
    editingComponentId = null;
    submitBtn.textContent = "Add Component";
    document.querySelector(".add-inventory-section h2").textContent = "Add New Component";

    // Refresh the components list
    await renderComponentCards();
    await renderInventoryTable();

  } catch (error) {
    console.error("Error in form submission:", error);
    alert("An error occurred. Please try again.");
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = editingComponentId ? "Update Component" : "Add Component";
  }
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

// Prevent negative numbers and minus sign in quantity inputs
const quantityInputs = ['componentQuantity', 'reorderQuantity'];

quantityInputs.forEach(inputId => {
  const input = document.getElementById(inputId);
  
  // Prevent typing minus sign
  input.addEventListener('keypress', (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  });
  
  // Ensure value is not negative
  input.addEventListener('input', (e) => {
    if (e.target.value < 0) {
      e.target.value = 0;
    }
  });
  
  // Set min attribute
  input.setAttribute('min', '0');
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

window.deleteComponent = deleteComponent;

// Open reorder modal
window.openReorderModal = function() {
  reorderModal.style.display = "block";
  populateReorderComponents();
};

// Close reorder modal
document.querySelector(".reorder-modal-close").addEventListener("click", () => {
  reorderModal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === reorderModal) {
    reorderModal.style.display = "none";
  }
});

// Populate reorder components dropdown
async function populateReorderComponents() {
  try {
    const components = await fetchComponents();
    reorderComponent.innerHTML = '<option value="">Select a component</option>';
    
    components.forEach(component => {
      const option = document.createElement('option');
      option.value = component.id;
      option.textContent = component.name;
      option.dataset.price = component.price;
      reorderComponent.appendChild(option);
    });
  } catch (error) {
    console.error("Error populating reorder components:", error);
  }
}

// Update order summary when quantity changes
reorderQuantity.addEventListener("input", updateOrderSummary);
reorderComponent.addEventListener("change", updateOrderSummary);

function updateOrderSummary() {
  const quantity = parseInt(reorderQuantity.value) || 0;
  const selectedOption = reorderComponent.options[reorderComponent.selectedIndex];
  const price = selectedOption ? parseFloat(selectedOption.dataset.price) || 0 : 0;
  
  totalItems.textContent = quantity;
  totalCost.textContent = (quantity * price).toFixed(2);
}

// Handle reorder form submission
reorderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const componentId = reorderComponent.value;
  const quantity = parseInt(reorderQuantity.value);
  const selectedOption = reorderComponent.options[reorderComponent.selectedIndex];
  const componentName = selectedOption.textContent;
  
  if (!componentId || !quantity) {
    alert("Please select a component and quantity");
    return;
  }
  
  try {
    // Get current user email
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place a reorder");
      return;
    }
    
    // Get the current part document
    const partRef = doc(db, 'parts', componentId);
    const partDoc = await getDoc(partRef);
    
    if (!partDoc.exists()) {
      alert("Component not found!");
      return;
    }
    
    const currentQuantity = partDoc.data().quantity;
    const newQuantity = currentQuantity + quantity;
    
    // Update the part's quantity
    await updateDoc(partRef, {
      quantity: newQuantity
    });
    
    // Create reorder document
    const reorderData = {
      name: componentName,
      quantity: quantity,
      reordered_by: user.email,
      timestamp: new Date(),
      total_cost: (quantity * parseFloat(selectedOption.dataset.price)).toFixed(2)
    };
    
    // Add to reorders collection
    await addDoc(collection(db, 'reorders'), reorderData);
    
    alert("Reorder placed successfully and inventory updated!");
    reorderModal.style.display = "none";
    reorderForm.reset();
    updateOrderSummary();
    
    // Refresh the components display
    await renderComponentCards();
    await renderInventoryTable();
    
  } catch (error) {
    console.error("Error placing reorder:", error);
    alert("Failed to place reorder. Please try again.");
  }
});

// Fetch reorders from Firestore
async function fetchReorders() {
  try {
    const reordersCollection = collection(db, 'reorders');
    const querySnapshot = await getDocs(reordersCollection);
    const reorders = [];
    
    for (const reorderDoc of querySnapshot.docs) {
      const reorderData = reorderDoc.data();
      
      // Get the corresponding part data
      const partsCollection = collection(db, 'parts');
      const partQuery = query(partsCollection, where('name', '==', reorderData.name));
      const partSnapshot = await getDocs(partQuery);
      
      if (!partSnapshot.empty) {
        const partData = partSnapshot.docs[0].data();
        reorders.push({
          id: reorderDoc.id,
          image: partData.image,
          name: reorderData.name,
          timestamp: reorderData.timestamp.toDate(),
          total_cost: reorderData.total_cost,
          quantity: reorderData.quantity,
          description: partData.description
        });
      }
    }
    
    return reorders;
  } catch (error) {
    console.error("Error fetching reorders:", error);
    return [];
  }
}

// Format date to DD/MM/YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Render reorders table
async function renderReordersTable() {
  const reorders = await fetchReorders();
  
  inventoryList.innerHTML = reorders
    .map((reorder) => {
      const shortDescription = reorder.description.length > 15 
        ? reorder.description.substring(0, 15) + '...' 
        : reorder.description;

      return `
        <div class="table-row">
          <div class="image-cell">
            <img src="${reorder.image}" alt="${reorder.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
          </div>
          <div class="type-cell">${reorder.name}</div>
          <div class="date-cell">${formatDate(reorder.timestamp)}</div>
          <div class="price-cell">$${reorder.total_cost}</div>
          <div class="quantity-cell">${reorder.quantity}</div>
          <div class="description-cell" onclick="showDescriptionModal('${reorder.name}', '${reorder.description.replace(/'/g, "\\'")}')">
            ${shortDescription}
          </div>
        </div>
      `;
    })
    .join("");
}

// Initial render
renderComponentCards();
renderReordersTable();

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  // Display admin header
  await displayAdmin();

  // Initialize inventory from localStorage or use empty array if none exists
  inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  // Calculate last used ID
  if (inventory.length > 0) {
    lastUsedId = Math.max(...inventory.map((item) => parseInt(item.id)));
  } else {
    lastUsedId = 0;
  }

  // Initial render
  await renderComponentCards();
  renderInventoryTable();
  await populateReorderComponents();
  await renderReordersTable();

  // ... rest of the initialization code ...
});
