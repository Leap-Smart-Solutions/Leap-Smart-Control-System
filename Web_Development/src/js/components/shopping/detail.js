import fetchProducts from "./products.js";
import cart from "./cart.js";

let app = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');
let loadingOverlay = document.getElementById('loading-overlay');

// Ensure loading overlay is visible initially
if (loadingOverlay) {
  loadingOverlay.style.display = 'flex';
  loadingOverlay.classList.remove('hidden');
}

// load template file
const loadTemplate = async () => {
  try {
    const response = await fetch('../../../src/pages/shopping/template.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    
    app.innerHTML = html;
    let contentTab = document.getElementById('contentTab');
    if (!contentTab) {
      throw new Error('Content tab not found');
    }
    
    temporaryContent.style.display = 'block';
    contentTab.innerHTML = temporaryContent.innerHTML;
    temporaryContent.innerHTML = null;
    
    await cart();
    await initApp();
    
    // Hide loading overlay after everything is loaded
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500); // Add a small delay to allow for fade out
    }
  } catch (error) {
    console.error('Error loading template:', error);
    if (loadingOverlay) {
      loadingOverlay.innerHTML = `
        <div class="loading-container">
          <div class="loading-text" style="color: #ff3b30;">Error loading product details</div>
          <div class="loading-message">${error.message}</div>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #E8BC0E; border: none; border-radius: 5px; cursor: pointer;">
            Retry
          </button>
        </div>
      `;
    }
  }
}

const initApp = async () => {
  try {
    const products = await fetchProducts();
    let idProduct = new URLSearchParams(window.location.search).get('id');
    if (!idProduct) {
      throw new Error('No product ID provided');
    }
    
    let info = products.filter((value) => value.id == idProduct)[0];
    if(!info) {
      window.location.href = "./";
      return;
    }

    let detail = document.querySelector('.detail');
    if (!detail) {
      throw new Error('Detail section not found');
    }
    
    detail.querySelector('.image img').src = info.image;
    detail.querySelector('.name').innerText = info.name;
    detail.querySelector('.price').innerText = '$' + info.price;
    detail.querySelector('.description').innerText = info.description;
    detail.querySelector('.addCart').dataset.id = idProduct;

    // Similar products
    let listProduct = document.querySelector('.listProduct');
    if (!listProduct) {
      throw new Error('Product list section not found');
    }
    
    listProduct.innerHTML = null;
    products.filter((value) => value.id != idProduct ).forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.innerHTML =
      `
        <a href="../../pages/shopping/detail.html?id=${product.id}">
        <img src="${product.image}"/>
        <h2>${product.name}</h2>
        <div class="price">${product.price}</div>
        <button class="addCart" data-id="${product.id}">
          Add To Cart
        </button>
      `;
      listProduct.appendChild(newProduct);
    });
  } catch (error) {
    console.error('Error loading product details:', error);
    if (loadingOverlay) {
      loadingOverlay.innerHTML = `
        <div class="loading-container">
          <div class="loading-text" style="color: #ff3b30;">Error loading product details</div>
          <div class="loading-message">${error.message}</div>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #E8BC0E; border: none; border-radius: 5px; cursor: pointer;">
            Retry
          </button>
        </div>
      `;
    }
  }
}

// Start loading process
loadTemplate();
