// Checkout page functionality
const selectedAddress = null
const cartItems = JSON.parse(localStorage.getItem("flipmart-cart")) || []
const savedAddresses = JSON.parse(localStorage.getItem("flipmart-addresses")) || [
  {
    id: 1,
    name: "John Doe",
    phone: "+91 9876543210",
    street: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    type: "home",
    isDefault: true,
  },
]

function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
}

function goToPage(page) {
  window.location.href = page
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCheckoutPage()
})

function initializeCheckoutPage() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("flipmart-user"))

  if (!currentUser) {
    // Redirect to login if not logged in
    showLoginRequired()
    return
  }

  // Check if cart has items
  const cartItems = JSON.parse(localStorage.getItem("flipmart-cart")) || []

  if (cartItems.length === 0) {
    // Redirect to cart if empty
    showEmptyCartMessage()
    return
  }

  // Load checkout data
  loadCheckoutData(cartItems)

  // Setup event listeners
  setupEventListeners()
}

function showLoginRequired() {
  // Replace checkout content with login prompt
  const checkoutContent = document.querySelector(".checkout-container")
  if (checkoutContent) {
    checkoutContent.innerHTML = `
      <div class="login-required">
        <i class="fas fa-user-lock" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
        <h2>Login Required</h2>
        <p>Please login to proceed with checkout</p>
        <button class="btn-primary" onclick="openLoginModal()" style="margin-top: 20px;">
          Login Now
        </button>
      </div>
    `
  }
}

function showEmptyCartMessage() {
  // Replace checkout content with empty cart message
  const checkoutContent = document.querySelector(".checkout-container")
  if (checkoutContent) {
    checkoutContent.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
        <h2>Your Cart is Empty</h2>
        <p>Add some products before proceeding to checkout</p>
        <button class="btn-primary" onclick="goToPage('products.html')" style="margin-top: 20px;">
          Continue Shopping
        </button>
      </div>
    `
  }
}

function loadCheckoutData(cartItems) {
  // Load cart summary
  loadCartSummary(cartItems)

  // Load user addresses
  loadUserAddresses()

  // Load payment methods
  loadPaymentMethods()
}

function loadCartSummary(cartItems) {
  const cartSummary = document.querySelector(".cart-summary")
  if (!cartSummary) return

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0)
  const totalDiscount = originalTotal - subtotal
  const deliveryCharges = subtotal > 500 ? 0 : 40
  const finalTotal = subtotal + deliveryCharges

  cartSummary.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-items">
      ${cartItems
        .map(
          (item) => `
        <div class="summary-item">
          <div class="item-info">
            <span class="item-name">${item.title}</span>
            <span class="item-quantity">× ${item.quantity}</span>
          </div>
          <span class="item-price">₹${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="summary-divider"></div>
    <div class="summary-row">
      <span>Subtotal</span>
      <span>₹${subtotal.toLocaleString()}</span>
    </div>
    <div class="summary-row">
      <span>Discount</span>
      <span class="discount-amount">-₹${totalDiscount.toLocaleString()}</span>
    </div>
    <div class="summary-row">
      <span>Delivery Charges</span>
      <span class="${deliveryCharges === 0 ? "free" : ""}">
        ${deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
      </span>
    </div>
    <div class="summary-divider"></div>
    <div class="summary-row total">
      <span>Total Amount</span>
      <span>₹${finalTotal.toLocaleString()}</span>
    </div>
    ${totalDiscount > 0 ? `<div class="savings">You will save ₹${totalDiscount.toLocaleString()} on this order</div>` : ""}
  `
}

function loadUserAddresses() {
  const addressesContainer = document.querySelector(".address-selection")
  if (!addressesContainer) return

  const addresses = JSON.parse(localStorage.getItem("flipmart-addresses")) || []

  if (addresses.length === 0) {
    addressesContainer.innerHTML = `
      <div class="no-addresses">
        <p>No saved addresses found</p>
        <button class="btn-primary" onclick="addNewAddress()">
          <i class="fas fa-plus"></i> Add New Address
        </button>
      </div>
    `
    return
  }

  addressesContainer.innerHTML = `
    <div class="addresses-list">
      ${addresses
        .map(
          (address, index) => `
        <div class="address-option">
          <input type="radio" name="delivery-address" id="address-${index}" value="${index}" ${address.default ? "checked" : ""}>
          <label for="address-${index}">
            <div class="address-details">
              <div class="address-type">${address.type}</div>
              <div class="address-name">${address.name}</div>
              <div class="address-text">${address.street}, ${address.city}, ${address.state} ${address.pincode}</div>
              <div class="address-phone">${address.phone}</div>
            </div>
          </label>
        </div>
      `,
        )
        .join("")}
    </div>
    <button class="btn-secondary" onclick="addNewAddress()">
      <i class="fas fa-plus"></i> Add New Address
    </button>
  `
}

function loadPaymentMethods() {
  const paymentContainer = document.querySelector(".payment-selection")
  if (!paymentContainer) return

  const paymentMethods = JSON.parse(localStorage.getItem("flipmart-payment-methods")) || []

  // Always show COD option
  let paymentHTML = `
    <div class="payment-option">
      <input type="radio" name="payment-method" id="payment-cod" value="cod" checked>
      <label for="payment-cod">
        <div class="payment-icon"><i class="fas fa-money-bill-wave"></i></div>
        <div class="payment-details">
          <div class="payment-name">Cash on Delivery</div>
          <div class="payment-description">Pay when you receive your order</div>
        </div>
      </label>
    </div>
  `

  // Add saved payment methods
  if (paymentMethods.length > 0) {
    paymentHTML += paymentMethods
      .map(
        (method, index) => `
      <div class="payment-option">
        <input type="radio" name="payment-method" id="payment-${index}" value="${index}" ${method.default ? "checked" : ""}>
        <label for="payment-${index}">
          <div class="payment-icon"><i class="fab fa-cc-${method.type.toLowerCase()}"></i></div>
          <div class="payment-details">
            <div class="payment-name">${method.type} ending in ${method.lastFour}</div>
            <div class="payment-description">Expires ${method.expiry}</div>
          </div>
        </label>
      </div>
    `,
      )
      .join("")
  }

  // Add new payment method option
  paymentHTML += `
    <button class="btn-secondary" onclick="addPaymentMethod()">
      <i class="fas fa-plus"></i> Add Payment Method
    </button>
  `

  paymentContainer.innerHTML = paymentHTML
}

function setupEventListeners() {
  // Place order button
  const placeOrderBtn = document.querySelector(".place-order-btn")
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", placeOrder)
  }

  // Apply coupon button
  const applyCouponBtn = document.querySelector(".apply-coupon-btn")
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", applyCoupon)
  }
}

function placeOrder() {
  // Get selected address
  const selectedAddressInput = document.querySelector('input[name="delivery-address"]:checked')
  if (!selectedAddressInput) {
    showNotification("Please select a delivery address", "error")
    return
  }

  // Get selected payment method
  const selectedPaymentInput = document.querySelector('input[name="payment-method"]:checked')
  if (!selectedPaymentInput) {
    showNotification("Please select a payment method", "error")
    return
  }

  // Show processing
  showNotification("Processing your order...", "info")

  // Simulate order processing
  setTimeout(() => {
    // Create order
    createOrder(selectedAddressInput.value, selectedPaymentInput.value)

    // Clear cart
    localStorage.setItem("flipmart-cart", "[]")

    // Show success
    showOrderSuccess()
  }, 2000)
}

function createOrder(addressIndex, paymentMethod) {
  // Get cart items
  const cartItems = JSON.parse(localStorage.getItem("flipmart-cart")) || []

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryCharges = subtotal > 500 ? 0 : 40
  const finalTotal = subtotal + deliveryCharges

  // Create order object
  const order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    items: cartItems,
    total: finalTotal,
    subtotal: subtotal,
    deliveryCharges: deliveryCharges,
    status: "Processing",
    paymentMethod: paymentMethod,
    addressIndex: addressIndex,
  }

  // Save order
  const orders = JSON.parse(localStorage.getItem("flipmart-orders")) || []
  orders.push(order)
  localStorage.setItem("flipmart-orders", JSON.stringify(orders))
}

function generateOrderId() {
  return "ORD" + Math.random().toString(36).substr(2, 9).toUpperCase()
}

function showOrderSuccess() {
  const checkoutContainer = document.querySelector(".checkout-container")
  if (!checkoutContainer) return

  checkoutContainer.innerHTML = `
    <div class="order-success">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2>Order Placed Successfully!</h2>
      <p>Your order has been placed and will be processed soon.</p>
      <div class="order-actions">
        <button class="btn-primary" onclick="goToPage('account.html')">
          View Orders
        </button>
        <button class="btn-secondary" onclick="goToPage('products.html')">
          Continue Shopping
        </button>
      </div>
    </div>
  `
}

function applyCoupon() {
  const couponInput = document.querySelector(".coupon-input")
  if (!couponInput || !couponInput.value) {
    showNotification("Please enter a coupon code", "error")
    return
  }

  const couponCode = couponInput.value.toUpperCase()

  // Check for valid coupons
  if (couponCode === "WELCOME10") {
    showNotification("Coupon applied successfully! 10% off", "success")
    // In a real app, would update the order total
  } else if (couponCode === "FREESHIP") {
    showNotification("Free shipping coupon applied!", "success")
    // In a real app, would update the shipping cost
  } else {
    showNotification("Invalid coupon code", "error")
  }
}

function addNewAddress() {
  showNotification("Address functionality coming soon!", "info")
  // In a real app, would open an address form modal
}

function addPaymentMethod() {
  showNotification("Payment method functionality coming soon!", "info")
  // In a real app, would open a payment form modal
}

// Export functions
window.placeOrder = placeOrder
window.applyCoupon = applyCoupon
window.addNewAddress = addNewAddress
window.addPaymentMethod = addPaymentMethod
