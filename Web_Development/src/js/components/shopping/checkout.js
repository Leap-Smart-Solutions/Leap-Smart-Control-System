import cart from "./cart.js";
import fetchProducts from "./products.js";
import phoneInputValidator from "../../utils/phoneInputValidator.js";

let app = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');

// Load template file
const loadTemplate = async () => {
  try {
    const response = await fetch('../../pages/shopping/template.html');
    const html = await response.text();
    app.innerHTML = html;
    let contentTab = document.getElementById('contentTab');
    contentTab.innerHTML = temporaryContent.innerHTML;
    temporaryContent.innerHTML = null;
    await cart();
    await initCheckout();
  } catch (error) {
    console.error('Error loading template:', error);
  }
};

loadTemplate();

const initCheckout = async () => {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const TAX_RATE = 0.14; // 14% value-added tax rate
  const SHIPPING_RATE = 10.00; // Flat rate shipping

  // Get DOM elements
  const cartItemsContainer = document.querySelector('.cart-items');
  const subtotalElement = document.getElementById('subtotal');
  const shippingElement = document.getElementById('shipping');
  const taxElement = document.getElementById('tax');
  const totalElement = document.getElementById('total');
  const placeOrderButton = document.getElementById('placeOrder');

  // Input elements
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const addressInput = document.getElementById('address');
  const cityInput = document.getElementById('city');
  const stateInput = document.getElementById('state');
  const zipCodeInput = document.getElementById('zipCode');
  const phoneInput = document.getElementById('phone');
  const cardNameInput = document.getElementById('cardName');

  // Initialize phone input validation
  if (phoneInput) {
    phoneInputValidator.init(phoneInput, {
      maxLength: 16,  // Increased to accommodate + symbol for country codes
      autoFormat: false
    });
  }
  const cardNumberInput = document.getElementById('cardNumber');
  const expiryInput = document.getElementById('expiry');
  const cvvInput = document.getElementById('cvv');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate and update order summary
  const updateOrderSummary = async () => {
    let subtotal = 0;
    const products = await fetchProducts();
    
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    });

    const shipping = SHIPPING_RATE;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

    subtotalElement.textContent = formatCurrency(subtotal);
    shippingElement.textContent = formatCurrency(shipping);
    taxElement.textContent = formatCurrency(tax);
    totalElement.textContent = formatCurrency(total);

    return { subtotal, shipping, tax, total };
  };

  // Render cart items
  const renderCartItems = async () => {
    cartItemsContainer.innerHTML = '';
    const products = await fetchProducts();
    
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
          <div class="item">
            <div class="image">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="name">${product.name}</div>
            <div class="quantity">x${item.quantity}</div>
            <div class="price">${formatCurrency(product.price * item.quantity)}</div>
          </div>
        `;
        cartItemsContainer.appendChild(itemElement);
      }
    });
  };

  // Form validation
  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      alert('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneInput.value.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }

    // Card number validation (basic)
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumberInput.value.replace(/\D/g, ''))) {
      alert('Please enter a valid 16-digit card number');
      return false;
    }

    // Expiry date validation (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryInput.value)) {
      alert('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    // CVV validation
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(cvvInput.value)) {
      alert('Please enter a valid CVV');
      return false;
    }

    // Check if all required fields are filled
    const requiredInputs = document.querySelectorAll('input[required]');
    for (const input of requiredInputs) {
      if (!input.value.trim()) {
        alert('Please fill in all required fields');
        return false;
      }
    }

    return true;
  };

  // Handle order submission
  const handleOrderSubmission = async () => {
    if (!validateForm()) {
      return;
    }

    const { subtotal, shipping, tax, total } = await updateOrderSummary();

    const order = {
      customer: {
        fullName: fullNameInput.value,
        email: emailInput.value,
        address: addressInput.value,
        city: cityInput.value,
        state: stateInput.value,
        zipCode: zipCodeInput.value,
        phone: phoneInput.value
      },
      items: cartItems,
      payment: {
        cardName: cardNameInput.value,
        cardNumber: cardNumberInput.value.slice(-4), // Only store last 4 digits
        expiry: expiryInput.value
      },
      summary: {
        subtotal,
        shipping,
        tax,
        total
      },
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Here you would typically send the order to your backend
      console.log('Order placed:', order);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success message and redirect
      alert('Order placed successfully! Thank you for your purchase.');
      window.location.href = '../../../pages/shopping/index.html';
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  // Format card number input
  cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
  });

  // Format expiry date input
  expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
  });

  // Initialize page
  await renderCartItems();
  await updateOrderSummary();

  // Add event listener to place order button
  placeOrderButton.addEventListener('click', handleOrderSubmission);
};
