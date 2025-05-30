import fetchProducts from "./products.js";

const cart = async () => {
  let iconCart = document.querySelector('.icon-cart');
  let closeBtn = document.querySelector('.cartTab .close');
  let body = document.querySelector('body');
  let cart = [];
  let products = [];

  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Error loading products for cart:", error);
    return;
  }

  iconCart.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
  })

  closeBtn.addEventListener('click', () => {
    body.classList.toggle('activeTabCart');
  })

  const setProductInCart = (idProduct, quantity, position) => {
    if(quantity > 0) {
      if(position < 0) {
        cart.push({
          product_id: idProduct,
          quantity: quantity
        });
      } else {
        cart[position].quantity = quantity;
      }
    } else {
      cart.splice(position, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    refreshCartHTML();
  }

  const refreshCartHTML = () => {
    let listHTML = document.querySelector('.listCart');
    let totalHTML = document.querySelector('.icon-cart span');
    let totalQuantity = 0;
    let subtotal = 0;
    listHTML.innerHTML = null;

    // Add cart items
    cart.forEach(item => {
      totalQuantity = totalQuantity + item.quantity;
      let position = products.findIndex((value) => value.id == item.product_id);
      let info = products[position];
      subtotal += info.price * item.quantity;
      let newItem = document.createElement('div');
      newItem.classList.add('item');
      newItem.innerHTML = 
      `
        <div class="image">
          <img src="${info.image}" />
        </div>
        <div class="name">${info.name}</div>
        <div class="totalPrice">$
        ${info.price * item.quantity}
        </div>
        <div class="quantity">
          <span class="minus" data-id="${info.id}">-</span>
          <span>${item.quantity}</span>
          <span class="plus" data-id="${info.id}">+</span>
        </div>
      `; 

      listHTML.appendChild(newItem);
    });

    // Add cart summary
    if (cart.length > 0) {
      const cartSummary = document.createElement('div');
      cartSummary.classList.add('cart-summary');
      cartSummary.innerHTML = `
        <div class="subtotal">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
      `;
      listHTML.appendChild(cartSummary);
    }

    // Update cart icon counter
    totalHTML.innerText = totalQuantity;

    // Add event listener to the checkout button
    const checkoutBtn = document.querySelector('.cartTab .btn .checkOut');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        window.location.href = '../../../pages/shopping/checkout.html';
      });
    }
  }

  // event click
  document.addEventListener('click', (event) => {
    let buttonClick = event.target;
    let idProduct = buttonClick.dataset.id;
    let position = cart.findIndex((value) => value.product_id == idProduct);
    let quantity = position < 0 ? 0 : cart[position].quantity;
    if(buttonClick.classList.contains('addCart') || buttonClick.classList.contains('plus')) {
      quantity++;
      setProductInCart(idProduct, quantity, position);
    } else if ( buttonClick.classList.contains('minus') ) {
      quantity--;
      setProductInCart(idProduct, quantity, position);
    }
  })

  const initApp = () => {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    refreshCartHTML();
  }
  initApp();
}

export default cart;
