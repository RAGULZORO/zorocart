// Account page functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeAccountPage()
})

function initializeAccountPage() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("flipmart-user"))

  if (!currentUser) {
    // Redirect to login if not logged in
    showLoginRequired()
    return
  }

  // Load user data
  loadUserData(currentUser)

  // Setup event listeners
  setupEventListeners()

  // Load account sections
  loadOrders()
  loadAddresses()
  loadWishlist()
  loadPaymentMethods()

  // Update cart display
  updateCartDisplay()
}

function showLoginRequired() {
  // Replace account content with login prompt
  const accountContent = document.querySelector(".account-layout")
  if (accountContent) {
    accountContent.innerHTML = `
      <div class="login-required">
        <i class="fas fa-user-lock" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
        <h2>Login Required</h2>
        <p>Please login to view your account details</p>
        <button class="btn-primary" onclick="openLoginModal()" style="margin-top: 20px;">
          Login Now
        </button>
      </div>
    `
  }
}

function loadUserData(user) {
  // Update profile information
  document.getElementById("user-name").textContent = user.name || user.email.split("@")[0]
  document.getElementById("user-email").textContent = user.email
  document.getElementById("user-phone").textContent = user.phone || "Not provided"
  document.getElementById("user-gender").textContent = user.gender || "Not specified"
  document.getElementById("user-dob").textContent = user.dob || "Not provided"
  document.getElementById("member-since").textContent = user.memberSince || "Recently joined"

  // Update stats
  const orders = JSON.parse(localStorage.getItem("flipmart-orders")) || []
  const wishlist = JSON.parse(localStorage.getItem("flipmart-wishlist")) || []
  const addresses = JSON.parse(localStorage.getItem("flipmart-addresses")) || []

  document.getElementById("total-orders").textContent = orders.length
  document.getElementById("wishlist-items").textContent = wishlist.length
  document.getElementById("saved-addresses").textContent = addresses.length

  // Calculate total spent
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  document.getElementById("total-spent").textContent = `₹${totalSpent.toLocaleString()}`
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("logout")) return

      // Update active tab
      document.querySelectorAll(".menu-item").forEach((i) => i.classList.remove("active"))
      item.classList.add("active")

      // Show corresponding content
      const tabId = item.getAttribute("data-tab")
      document.querySelectorAll(".account-tab-content").forEach((tab) => {
        tab.classList.remove("active")
      })
      document.getElementById(`${tabId}-section`).classList.add("active")
    })
  })

  // Logout button
  document.querySelector(".logout").addEventListener("click", () => {
    // Logout functionality should be implemented here
    localStorage.removeItem("flipmart-user")
    window.location.href = "login.html"
  })
}

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("flipmart-orders")) || []
  const ordersList = document.getElementById("orders-list")

  if (orders.length === 0) {
    ordersList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-shopping-bag" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h3>No orders yet</h3>
        <p>Your order history will appear here</p>
        <button class="btn-primary" onclick="goToPage('products.html')" style="margin-top: 16px;">
          Start Shopping
        </button>
      </div>
    `
    return
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
    <div class="order-card">
      <div class="order-header">
        <div class="order-id">Order #${order.id}</div>
        <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
        <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
      </div>
      <div class="order-items">
        ${order.items
          .map(
            (item) => `
          <div class="order-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
              <div class="item-title">${item.title}</div>
              <div class="item-price">₹${item.price.toLocaleString()} × ${item.quantity}</div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="order-footer">
        <div class="order-total">Total: ₹${order.total.toLocaleString()}</div>
        <button class="btn-secondary" onclick="trackOrder('${order.id}')">Track Order</button>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadAddresses() {
  const addresses = JSON.parse(localStorage.getItem("flipmart-addresses")) || []
  const addressesGrid = document.getElementById("addresses-grid")

  if (addresses.length === 0) {
    addressesGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-map-marker-alt" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h3>No addresses saved</h3>
        <p>Add a delivery address to speed up checkout</p>
        <button class="btn-primary" onclick="addNewAddress()" style="margin-top: 16px;">
          Add New Address
        </button>
      </div>
    `
    return
  }

  addressesGrid.innerHTML = addresses
    .map(
      (address, index) => `
    <div class="address-card ${address.default ? "default" : ""}">
      ${address.default ? '<div class="default-badge">Default</div>' : ""}
      <div class="address-type">${address.type}</div>
      <div class="address-name">${address.name}</div>
      <div class="address-details">
        ${address.street}, ${address.city}, ${address.state} ${address.pincode}
      </div>
      <div class="address-phone">${address.phone}</div>
      <div class="address-actions">
        <button class="btn-text" onclick="editAddress(${index})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-text" onclick="deleteAddress(${index})">
          <i class="fas fa-trash"></i> Delete
        </button>
        ${
          !address.default
            ? `
          <button class="btn-text" onclick="setDefaultAddress(${index})">
            <i class="fas fa-check-circle"></i> Set as Default
          </button>
        `
            : ""
        }
      </div>
    </div>
  `,
    )
    .join("")
}

function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("flipmart-wishlist")) || []
  const wishlistGrid = document.getElementById("wishlist-grid")
  const wishlistCount = document.querySelector(".wishlist-count")

  if (wishlistCount) {
    wishlistCount.textContent = `${wishlist.length} items`
  }

  if (wishlist.length === 0) {
    wishlistGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h3>Your wishlist is empty</h3>
        <p>Save items you like for later</p>
        <button class="btn-primary" onclick="goToPage('products.html')" style="margin-top: 16px;">
          Explore Products
        </button>
      </div>
    `
    return
  }

  wishlistGrid.innerHTML = wishlist
    .map(
      (item) => `
    <div class="wishlist-item">
      <button class="remove-wishlist" onclick="removeFromWishlist('${item.id}')">
        <i class="fas fa-times"></i>
      </button>
      <div class="wishlist-image" onclick="goToProductDetail('${item.id}')">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="wishlist-info">
        <h3 onclick="goToProductDetail('${item.id}')">${item.title}</h3>
        <div class="wishlist-price">
          <span class="current-price">₹${item.price.toLocaleString()}</span>
          ${item.originalPrice ? `<span class="original-price">₹${item.originalPrice.toLocaleString()}</span>` : ""}
        </div>
        <div class="wishlist-rating">
          <div class="stars">${generateStars(item.rating)}</div>
          <span>(${item.ratingCount})</span>
        </div>
        <button class="btn-primary" onclick="addToCartFromWishlist('${item.id}')">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadPaymentMethods() {
  const paymentMethods = JSON.parse(localStorage.getItem("flipmart-payment-methods")) || []
  const paymentMethodsContainer = document.getElementById("payment-methods")

  if (paymentMethods.length === 0) {
    paymentMethodsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-credit-card" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h3>No payment methods saved</h3>
        <p>Add a payment method for faster checkout</p>
        <button class="btn-primary" onclick="addPaymentMethod()" style="margin-top: 16px;">
          Add Payment Method
        </button>
      </div>
    `
    return
  }

  paymentMethodsContainer.innerHTML = paymentMethods
    .map(
      (method, index) => `
    <div class="payment-card ${method.default ? "default" : ""}">
      <div class="card-type">
        <i class="fab fa-cc-${method.type.toLowerCase()}"></i>
      </div>
      <div class="card-info">
        <div class="card-number">•••• •••• •••• ${method.lastFour}</div>
        <div class="card-expiry">Expires ${method.expiry}</div>
        <div class="card-name">${method.name}</div>
      </div>
      <div class="card-actions">
        <button class="btn-text" onclick="deletePaymentMethod(${index})">
          <i class="fas fa-trash"></i> Delete
        </button>
        ${
          !method.default
            ? `
          <button class="btn-text" onclick="setDefaultPaymentMethod(${index})">
            <i class="fas fa-check-circle"></i> Set as Default
          </button>
        `
            : ""
        }
      </div>
    </div>
  `,
    )
    .join("")
}

// Helper functions
function editProfile() {
  const user = JSON.parse(localStorage.getItem("flipmart-user"))

  // Populate form with current values
  document.getElementById("edit-first-name").value = user.name ? user.name.split(" ")[0] : ""
  document.getElementById("edit-last-name").value =
    user.name && user.name.includes(" ") ? user.name.split(" ").slice(1).join(" ") : ""
  document.getElementById("edit-email").value = user.email || ""
  document.getElementById("edit-phone").value = user.phone || ""
  document.getElementById("edit-gender").value = user.gender || "male"
  document.getElementById("edit-dob").value = user.dob || ""

  document.getElementById("edit-profile-modal").style.display = "block"
}

function saveProfile(event) {
  event.preventDefault()

  const firstName = document.getElementById("edit-first-name").value
  const lastName = document.getElementById("edit-last-name").value
  const email = document.getElementById("edit-email").value
  const phone = document.getElementById("edit-phone").value
  const gender = document.getElementById("edit-gender").value
  const dob = document.getElementById("edit-dob").value

  // Update user object
  const user = JSON.parse(localStorage.getItem("flipmart-user"))
  user.name = `${firstName} ${lastName}`.trim()
  user.email = email
  user.phone = phone
  user.gender = gender
  user.dob = dob

  // Save updated user
  localStorage.setItem("flipmart-user", JSON.stringify(user))

  // Update display
  loadUserData(user)

  // Close modal
  document.getElementById("edit-profile-modal").style.display = "none"
  showNotification("Profile updated successfully", "success")
}

function addNewAddress() {
  document.getElementById("add-address-modal").style.display = "block"
}

function addPaymentMethod() {
  document.getElementById("add-payment-modal").style.display = "block"
}

function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("flipmart-wishlist")) || []
  wishlist = wishlist.filter((item) => item.id !== productId)
  localStorage.setItem("flipmart-wishlist", JSON.stringify(wishlist))

  loadWishlist()
  showNotification("Item removed from wishlist", "success")
}

function addToCartFromWishlist(productId) {
  addToCart(productId)
  removeFromWishlist(productId)
}

function trackOrder(orderId) {
  showNotification("Order tracking will be available soon", "info")
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let starsHTML = ""

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem("flipmart-cart")) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartBadge = document.getElementById("cart-badge")
  if (cartBadge) {
    cartBadge.textContent = totalItems
    cartBadge.style.display = totalItems > 0 ? "block" : "none"
  }
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

function logout() {
  localStorage.removeItem("flipmart-user")
  window.location.href = "login.html"
}

function addToCart(productId) {
  // Add to cart functionality should be implemented here
  const cart = JSON.parse(localStorage.getItem("flipmart-cart")) || []
  const product = {
    id: productId,
    title: "Product Title", // Placeholder for actual product title
    price: 1000, // Placeholder for actual product price
    quantity: 1, // Placeholder for actual quantity
  }
  cart.push(product)
  localStorage.setItem("flipmart-cart", JSON.stringify(cart))
}

function editAddress(index) {
  // Edit address functionality should be implemented here
  console.log("Edit address at index:", index)
}

function deleteAddress(index) {
  // Delete address functionality should be implemented here
  const addresses = JSON.parse(localStorage.getItem("flipmart-addresses")) || []
  addresses.splice(index, 1)
  localStorage.setItem("flipmart-addresses", JSON.stringify(addresses))
  loadAddresses()
}

function setDefaultAddress(index) {
  // Set default address functionality should be implemented here
  const addresses = JSON.parse(localStorage.getItem("flipmart-addresses")) || []
  addresses.forEach((address) => (address.default = false))
  addresses[index].default = true
  localStorage.setItem("flipmart-addresses", JSON.stringify(addresses))
  loadAddresses()
}

function deletePaymentMethod(index) {
  // Delete payment method functionality should be implemented here
  const paymentMethods = JSON.parse(localStorage.getItem("flipmart-payment-methods")) || []
  paymentMethods.splice(index, 1)
  localStorage.setItem("flipmart-payment-methods", JSON.stringify(paymentMethods))
  loadPaymentMethods()
}

function setDefaultPaymentMethod(index) {
  // Set default payment method functionality should be implemented here
  const paymentMethods = JSON.parse(localStorage.getItem("flipmart-payment-methods")) || []
  paymentMethods.forEach((method) => (method.default = false))
  paymentMethods[index].default = true
  localStorage.setItem("flipmart-payment-methods", JSON.stringify(paymentMethods))
  loadPaymentMethods()
}

function goToPage(page) {
  window.location.href = page
}

function goToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`
}

// Export functions
window.editProfile = editProfile
window.saveProfile = saveProfile
window.addNewAddress = addNewAddress
window.addPaymentMethod = addPaymentMethod
window.removeFromWishlist = removeFromWishlist
window.addToCartFromWishlist = addToCartFromWishlist
window.trackOrder = trackOrder
window.logout = logout
window.openModal = openModal
window.closeModal = closeModal
window.showNotification = showNotification
window.addToCart = addToCart
window.editAddress = editAddress
window.deleteAddress = deleteAddress
window.setDefaultAddress = setDefaultAddress
window.deletePaymentMethod = deletePaymentMethod
window.setDefaultPaymentMethod = setDefaultPaymentMethod
window.goToPage = goToPage
window.goToProductDetail = goToProductDetail
