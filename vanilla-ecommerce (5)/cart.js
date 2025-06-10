// Cart page functionality
const cartItems = JSON.parse(localStorage.getItem("flipmart-cart")) || []

document.addEventListener("DOMContentLoaded", () => {
  initializeCartPage()
})

function initializeCartPage() {
  loadCartItems()
  updateCartSummary()
  setupEventListeners()
}

function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  const cartHeader = document.querySelector(".cart-header h2")

  if (!cartItemsContainer) return

  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("flipmart-user"))

  if (!currentUser) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-user-lock" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
        <h3>Login Required</h3>
        <p>Please login to view your cart</p>
        <button class="btn-primary" onclick="openLoginModal()" style="margin-top: 20px;">
          Login Now
        </button>
      </div>
    `

    if (cartHeader) {
      cartHeader.textContent = "My Cart"
    }
    return
  }

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <button class="btn-primary" onclick="goToPage('products.html')" style="margin-top: 20px;">
          Continue Shopping
        </button>
      </div>
    `

    if (cartHeader) {
      cartHeader.textContent = "My Cart (0 items)"
    }
    return
  }

  if (cartHeader) {
    cartHeader.textContent = `My Cart (${cartItems.length} items)`
  }

  cartItemsContainer.innerHTML = cartItems.map((item, index) => createCartItemHTML(item, index)).join("")
}

function createCartItemHTML(item, index) {
  const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0

  return `
    <div class="cart-item">
      <div class="item-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="item-details">
        <h3>${item.title}</h3>
        <p class="item-brand">${item.brand}</p>
        <div class="item-features">
          ${item.selectedColor ? `<span>Color: ${item.selectedColor}</span> •` : ""}
          <span>${item.fastDelivery ? "Free Delivery" : "Standard Delivery"}</span>
        </div>
        <div class="item-price">
          <span class="current-price">₹${item.price.toLocaleString()}</span>
          ${item.originalPrice ? `<span class="original-price">₹${item.originalPrice.toLocaleString()}</span>` : ""}
          ${discount > 0 ? `<span class="discount">${discount}% off</span>` : ""}
        </div>
      </div>
      <div class="item-quantity">
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <div class="item-actions">
        <button class="save-later-btn" onclick="saveForLater(${index})">
          <i class="far fa-heart"></i>
          Save for Later
        </button>
        <button class="remove-btn" onclick="removeFromCart(${index})">
          <i class="fas fa-trash"></i>
          Remove
        </button>
      </div>
    </div>
  `
}

function updateQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(index)
    return
  }

  if (newQuantity > 10) {
    showNotification("Maximum quantity is 10", "error")
    return
  }

  cartItems[index].quantity = newQuantity
  saveCartToStorage()
  loadCartItems()
  updateCartSummary()
  updateGlobalCartDisplay()
}

function removeFromCart(index) {
  const item = cartItems[index]
  cartItems.splice(index, 1)
  saveCartToStorage()
  loadCartItems()
  updateCartSummary()
  updateGlobalCartDisplay()
  showNotification(`${item.title} removed from cart`, "success")
}

function saveForLater(index) {
  const item = cartItems[index]

  // Add to wishlist
  const wishlist = JSON.parse(localStorage.getItem("flipmart-wishlist")) || []
  const existingIndex = wishlist.findIndex((w) => w.id === item.id)

  if (existingIndex === -1) {
    wishlist.push({
      ...item,
      addedAt: new Date().toISOString(),
    })
    localStorage.setItem("flipmart-wishlist", JSON.stringify(wishlist))
  }

  // Remove from cart
  removeFromCart(index)
  showNotification(`${item.title} saved for later`, "success")
}

function clearCart() {
  cartItems.length = 0
  saveCartToStorage()
  loadCartItems()
  updateCartSummary()
  updateGlobalCartDisplay()
  showNotification("Cart cleared", "success")
}

function updateCartSummary() {
  const summaryCard = document.querySelector(".summary-card")
  if (!summaryCard || cartItems.length === 0) return

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0)
  const totalDiscount = originalTotal - subtotal
  const deliveryCharges = subtotal > 500 ? 0 : 40
  const finalTotal = subtotal + deliveryCharges

  summaryCard.innerHTML = `
    <h3>Price Details</h3>
    <div class="summary-row">
      <span>Price (${cartItems.length} items)</span>
      <span>₹${originalTotal.toLocaleString()}</span>
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
    <div class="summary-row total">
      <span>Total Amount</span>
      <span>₹${finalTotal.toLocaleString()}</span>
    </div>
    ${totalDiscount > 0 ? `<div class="savings">You will save ₹${totalDiscount.toLocaleString()} on this order</div>` : ""}
  `
}

function saveCartToStorage() {
  localStorage.setItem("flipmart-cart", JSON.stringify(cartItems))
}

function updateGlobalCartDisplay() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartBadge = document.getElementById("cart-badge")
  if (cartBadge) {
    cartBadge.textContent = totalItems
    cartBadge.style.display = totalItems > 0 ? "block" : "none"
  }
}

function proceedToCheckout() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("flipmart-user"))

  if (!currentUser) {
    showNotification("Please login to checkout", "error")
    setTimeout(() => {
      alert("Please login to proceed with checkout") // Temporary fix for undeclared variable
    }, 1000)
    return
  }

  if (cartItems.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  // Proceed to checkout
  goToPage("checkout.html")
}

function setupEventListeners() {
  // Clear cart button
  const clearCartBtn = document.querySelector(".clear-cart-btn")
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        clearCart()
      }
    })
  }

  // Place order button
  const placeOrderBtn = document.querySelector(".place-order-btn")
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", proceedToCheckout)
  }

  // Continue shopping button
  const continueBtn = document.querySelector(".continue-btn")
  if (continueBtn) {
    continueBtn.addEventListener("click", () => goToPage("products.html"))
  }
}

// Export functions
window.updateQuantity = updateQuantity
window.removeFromCart = removeFromCart
window.saveForLater = saveForLater
window.clearCart = clearCart
window.proceedToCheckout = proceedToCheckout

// Declare variables
function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
}

function goToPage(page) {
  window.location.href = page
}

function openLoginModal() {
  alert("Login Modal Opened") // Temporary implementation
}
