import cart from "./cart.js";
import fetchProducts from "./products.js";

let app = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');
let loadingContainer = document.querySelector('.loading-container');

// load template file
const loadTemplate = async () => {
  try {
    const response = await fetch('../../../src/pages/shopping/template.html');
    const html = await response.text();
    
    app.innerHTML = html;
    let contentTab = document.getElementById('contentTab');
    contentTab.innerHTML = temporaryContent.innerHTML;
    temporaryContent.innerHTML = null;
    
    // Initialize cart
    await cart();
    
    // Initialize products
    await initApp();
    
    // Hide loading container after everything is loaded
    loadingContainer.classList.add('hidden');
  } catch (error) {
    console.error('Error loading template:', error);
    loadingContainer.innerHTML = `
      <div class="loading-content">
        <div class="loading-text">Error loading products. Please try again.</div>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #E8BC0E; border: none; border-radius: 5px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
};

const initApp = async () => {
  // load list product
  let listProduct = document.querySelector('.listProduct');
  listProduct.innerHTML = null;

  try {
    // Wait for products to be loaded
    const products = await fetchProducts();
    
    products.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.innerHTML = `
        <div class="item-content" onclick="window.location.href='../shopping/detail.html?id=${product.id}'">
          <img src="${product.image}"/>
          <h2>${product.name}</h2>
          <div class="price">$${product.price}</div>
        </div>
        <button class="addCart" data-id="${product.id}">
          Add To Cart
        </button>
      `;
      listProduct.appendChild(newProduct);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    listProduct.innerHTML = `
      <div style="text-align: center; color: #fff; padding: 20px;">
        <p>Error loading products. Please try again.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #E8BC0E; border: none; border-radius: 5px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
};

// Start loading process
loadTemplate();
