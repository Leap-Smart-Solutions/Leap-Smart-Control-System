import fetchProducts from "./products.js";
import cart from "./cart.js";

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
    temporaryContent.style.display = 'block';
    contentTab.innerHTML = temporaryContent.innerHTML;
    temporaryContent.innerHTML = null;
    
    await cart();
    await initApp();
    
    // Hide loading container after everything is loaded
    loadingContainer.classList.add('hidden');
  } catch (error) {
    console.error('Error loading template:', error);
    loadingContainer.innerHTML = `
      <div class="loading-content">
        <div class="loading-text">Error loading product details. Please try again.</div>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #E8BC0E; border: none; border-radius: 5px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
}

const initApp = async () => {
  try {
    const products = await fetchProducts();
    let idProduct = new URLSearchParams(window.location.search).get('id');
    let info = products.filter((value) => value.id == idProduct)[0];
    
    if(!info) {
      window.location.href = "./";
      return;
    }

    let detail = document.querySelector('.detail');
    detail.querySelector('.image img').src = info.image;
    detail.querySelector('.name').innerText = info.name;
    detail.querySelector('.price').innerText = '$' + info.price;
    detail.querySelector('.description').innerText = info.description;
    detail.querySelector('.addCart').dataset.id = idProduct;

    // Similar products
    let listProduct = document.querySelector('.listProduct');
    listProduct.innerHTML = null;
    products.filter((value) => value.id != idProduct ).forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.innerHTML =
      `
        <a href="../../../pages/shopping/detail.html?id=${product.id}">
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
    loadingContainer.innerHTML = `
      <div class="loading-content">
        <div class="loading-text">Error loading product details. Please try again.</div>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #E8BC0E; border: none; border-radius: 5px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
}

loadTemplate();
