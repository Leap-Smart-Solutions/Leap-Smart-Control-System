// Import Firebase modules
import { db } from '../src/js/firebase/firebaseConfig.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ImgBB API Key
const IMGBB_API_KEY = "7358f23b1f2d81c20df3232eaaee1567";

// Check if Firebase is properly initialized
console.log("Firebase db instance:", db);

// Admin data
const admin = {
  userName: "Mohamed Hassan",
  image: "../Img/mo.jpg",
};
// Declare Variables
const itemPage = document.querySelector(".Items");

// Navigation elements
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const closeMenu = document.querySelector(".close-menu");
const mainContent = document.querySelector(".main-content");

// Make functions available globally
window.showDescriptionModal = function(text, title) {
  const modal = document.getElementById("descriptionModal");
  const modalBody = document.getElementById("descriptionModalBody");
  const modalTitle = document.querySelector(".description-modal-title");
  
  modalTitle.textContent = title;
  modalBody.textContent = text;
  modal.style.display = "block";
};

window.editItem = function(itemId) {
  // Implement edit functionality
  console.log("Edit item:", itemId);
};

window.deleteItem = function(itemId) {
  // Implement delete functionality
  console.log("Delete item:", itemId);
};

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
        <input type="text" id="search-input" placeholder="Search by name or description..." />
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

// Function to create an item row
function createItemRow(item) {
  // Add null checks and default values for item properties
  const description = item.description || '';
  const name = item.name || '';
  const price = item.price || 0;
  const image = item.image || '../Img/default-product.jpg';

  const shortDescription = description.length > 15
    ? description.substring(0, 15) + "..."
    : description;
    
  const shortName = name.length > 15
    ? name.substring(0, 15) + "..."
    : name;

  return `
    <div class="table-row" data-id="${item.id}">
      <div class="image-cell">
        <img src="${image}" alt="${name}" class="item-thumbnail">
      </div>
      <div class="name-cell" onclick="showDescriptionModal('${name.replace(/'/g, "\\'")}', 'Name')">${shortName}</div>
      <div class="price-cell">$${price.toFixed(2)}</div>
      <div class="description-cell" onclick="showDescriptionModal('${description.replace(/'/g, "\\'")}', 'Description')">${shortDescription}</div>
      <div class="actions-cell">
        <button class="edit-btn" onclick="editItem('${item.id}')" title="Edit Item">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" onclick="deleteItem('${item.id}')" title="Delete Item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `;
}

// Function to render items
function renderItems(itemsToRender) {
  const itemsList = document.getElementById("itemsList");
  itemsList.innerHTML = itemsToRender
    .map((item) => createItemRow(item))
    .join("");
}

// Function to filter items
function filterItems(searchTerm, items) {
  searchTerm = searchTerm.toLowerCase();
  return items.filter(
    (item) =>
      (item.name || '').toLowerCase().includes(searchTerm) ||
      (item.description || '').toLowerCase().includes(searchTerm)
  );
}

// Function to fetch items from Firestore
async function fetchItems() {
  console.log("Starting fetchItems function");
  try {
    const productsCollection = collection(db, "products");
    console.log("Collection reference created");
    
    const querySnapshot = await getDocs(productsCollection);
    console.log("Query snapshot received:", querySnapshot.size, "documents");
    
    const items = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Special logging for the Eufy item
      if (data.name === "Eufy Security Video Smart Lock S330") {
        console.log("Found Eufy item!");
        console.log("Raw document data:", data);
      }
      
      // Ensure all required fields exist with default values
      const item = {
        id: doc.id,
        name: data.name || '',
        // Check for both "description" and " description" fields
        description: data.description || data[" description"] || '',
        price: data.price || 0,
        image: data.image || '../Img/default-product.jpg'
      };
      
      items.push(item);
    });
    
    console.log("Final items array:", items);
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
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

// Function to handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const imageInput = document.getElementById("itemImage");
  const nameInput = document.getElementById("itemName");
  const priceInput = document.getElementById("itemPrice");
  const descriptionInput = document.getElementById("itemDescription");
  const submitBtn = document.querySelector(".submit-btn");
  const imagePreview = document.getElementById("imagePreview");

  // Validate inputs
  if (!imageInput.files[0] || !nameInput.value || !priceInput.value || !descriptionInput.value) {
    alert("Please fill in all fields");
    return;
  }

  try {
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding Item...";

    // 1. Upload image to ImgBB
    const file = imageInput.files[0];
    const reader = new FileReader();
    
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

        // 2. Get the hosted URL
        const imageUrl = json.data.url;

        // 3. Create item in Firestore
        const itemData = {
          name: nameInput.value,
          price: parseFloat(priceInput.value),
          description: descriptionInput.value,
          image: imageUrl
        };

        const docRef = await addDoc(collection(db, "products"), itemData);
        console.log("Item added with ID:", docRef.id);

        // 4. Reset form and preview
        e.target.reset();
        imagePreview.innerHTML = `
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <span>Upload Image</span>
        `;

        // 5. Refresh the items list
        const items = await fetchItems();
        renderItems(items);

        // Show success message
        alert("Item added successfully!");

      } catch (error) {
        console.error("Error adding item:", error);
        alert("Failed to add item. Please try again.");
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = "Add Item";
      }
    };

    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      alert("Could not read file.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Add Item";
    };

    reader.readAsDataURL(file);

  } catch (error) {
    console.error("Error in form submission:", error);
    alert("An error occurred. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Add Item";
  }
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

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded");
  // Fetch items from Firestore
  const items = await fetchItems();
  console.log("Items fetched:", items);
  
  // Setup search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filteredItems = filterItems(e.target.value, items);
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

  // Setup image preview
  setupImagePreview();

  // Setup form submission
  const addItemForm = document.getElementById("addItemForm");
  addItemForm.addEventListener("submit", handleFormSubmit);

  // Initial render
  renderItems(items);
});
