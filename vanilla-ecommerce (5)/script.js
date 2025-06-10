// Global variables
let currentUser = null
let cart = JSON.parse(localStorage.getItem("flipmart-cart")) || []
const wishlist = JSON.parse(localStorage.getItem("flipmart-wishlist")) || []
let currentSlide = 0
let isAuthMode = "signin"
let searchTimeout = null

// DOM elements
const themeIcon = document.getElementById("theme-icon")
const cartBadge = document.getElementById("cart-badge")
const backToTop = document.getElementById("back-to-top")
const notification = document.getElementById("notification")

// Modal elements
const cartModal = document.getElementById("cart-modal")
const authModal = document.getElementById("auth-modal")
const productModal = document.getElementById("product-modal")
const quickViewModal = document.getElementById("quick-view-modal")
const loginModal = document.getElementById("login-modal")

// Declare openModal and closeModal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
  }
}

// Firebase declaration
const firebase = {
  auth: () => ({
    onAuthStateChanged: (callback) => {
      // Mock implementation for demonstration purposes
      callback(currentUser)
    },
  }),
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

async function initializeApp() {
  // Initialize theme
  initializeTheme()

  // Initialize event listeners
  initializeEventListeners()

  // Initialize scroll animations
  initializeScrollAnimations()

  // Start hero slider
  startHeroSlider()

  // Load featured products
  loadFeaturedProducts()

  // Start deal timer
  startDealTimer()

  // Update cart display
  updateCartDisplay()

  // Initialize auth state
  initializeAuth()
}

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem("flipmart-theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("flipmart-theme", newTheme)
  updateThemeIcon(newTheme)

  showNotification(`Switched to ${newTheme} mode`, "success")
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("theme-icon")
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
  }
}

// Hero slider
function startHeroSlider() {
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")

  if (slides.length === 0) return

  setInterval(() => {
    nextSlide()
  }, 5000)
}

function nextSlide() {
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")

  if (slides.length === 0) return

  slides[currentSlide].classList.remove("active")
  dots[currentSlide]?.classList.remove("active")

  currentSlide = (currentSlide + 1) % slides.length

  slides[currentSlide].classList.add("active")
  dots[currentSlide]?.classList.add("active")
}

function previousSlide() {
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")

  if (slides.length === 0) return

  slides[currentSlide].classList.remove("active")
  dots[currentSlide]?.classList.remove("active")

  currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1

  slides[currentSlide].classList.add("active")
  dots[currentSlide]?.classList.add("active")
}

function currentSlideSet(n) {
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")

  if (slides.length === 0) return

  slides[currentSlide].classList.remove("active")
  dots[currentSlide]?.classList.remove("active")

  currentSlide = n - 1

  slides[currentSlide].classList.add("active")
  dots[currentSlide]?.classList.add("active")
}

// Load featured products
function loadFeaturedProducts() {
  const grid = document.getElementById("featured-products-grid")
  if (!grid) return

  const featuredProducts = window.sampleProducts?.slice(0, 4) || []

  grid.innerHTML = featuredProducts.map((product) => createProductCard(product)).join("")

  // Add scroll animations
  setTimeout(() => {
    initializeScrollAnimations()
  }, 100)
}

function createProductCard(product) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return `
    <div class="product-card hover-lift" onclick="goToProductDetail('${product.id}')">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
        <div class="product-actions">
          <button class="action-btn" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="Add to Wishlist">
            <i class="far fa-heart"></i>
          </button>
          <button class="action-btn" onclick="event.stopPropagation(); quickViewProduct('${product.id}')" title="Quick View">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">
          <div class="stars">${generateStars(product.rating)}</div>
          <span class="rating-count">(${product.ratingCount})</span>
        </div>
        <div class="product-price">
          <span class="current-price">₹${product.price.toLocaleString()}</span>
          ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ""}
          ${discount > 0 ? `<span class="discount">${discount}% off</span>` : ""}
        </div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">
          <i class="fas fa-shopping-cart"></i>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  `
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

// Deal timer
function startDealTimer() {
  const hoursEl = document.getElementById("hours")
  const minutesEl = document.getElementById("minutes")
  const secondsEl = document.getElementById("seconds")

  if (!hoursEl || !minutesEl || !secondsEl) return

  let hours = 12
  let minutes = 34
  let seconds = 56

  setInterval(() => {
    seconds--

    if (seconds < 0) {
      seconds = 59
      minutes--

      if (minutes < 0) {
        minutes = 59
        hours--

        if (hours < 0) {
          hours = 23
        }
      }
    }

    hoursEl.textContent = hours.toString().padStart(2, "0")
    minutesEl.textContent = minutes.toString().padStart(2, "0")
    secondsEl.textContent = seconds.toString().padStart(2, "0")
  }, 1000)
}

// Cart management
function addToCart(productId, quantity = 1) {
  const product = window.sampleProducts?.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      ...product,
      quantity: quantity,
      addedAt: new Date().toISOString(),
    })
  }

  updateCartDisplay()
  saveCart()
  showNotification(`${product.title} added to cart!`, "success")

  // Animate cart button
  if (cartBadge) {
    cartBadge.style.transform = "scale(1.3)"
    setTimeout(() => {
      cartBadge.style.transform = "scale(1)"
    }, 200)
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartDisplay()
  saveCart()
  renderCartItems()
  showNotification("Item removed from cart", "success")
}

function updateCartQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }

  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.quantity = newQuantity
    updateCartDisplay()
    saveCart()
    renderCartItems()
  }
}

function clearCart() {
  cart = []
  updateCartDisplay()
  saveCart()
  renderCartItems()
  showNotification("Cart cleared", "success")
}

function updateCartDisplay() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  if (cartBadge) {
    cartBadge.textContent = totalItems
    cartBadge.style.display = totalItems > 0 ? "block" : "none"
  }
}

function saveCart() {
  localStorage.setItem("flipmart-cart", JSON.stringify(cart))
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// Wishlist management
function toggleWishlist(productId) {
  const product = window.sampleProducts?.find((p) => p.id === productId)
  if (!product) return

  const existingIndex = wishlist.findIndex((item) => item.id === productId)

  if (existingIndex >= 0) {
    wishlist.splice(existingIndex, 1)
    showNotification(`${product.title} removed from wishlist`, "success")
  } else {
    wishlist.push({
      ...product,
      addedAt: new Date().toISOString(),
    })
    showNotification(`${product.title} added to wishlist!`, "success")
  }

  saveWishlist()
}

function saveWishlist() {
  localStorage.setItem("flipmart-wishlist", JSON.stringify(wishlist))
}

// Modal management
function openCartModal() {
  renderCartItems()
  openModal("cart-modal")
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateCartQuantity('${item.id}', parseInt(this.value))" min="1">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="cart-remove" onclick="removeFromCart('${item.id}')" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `,
      )
      .join("")
  }

  cartTotal.textContent = getCartTotal().toFixed(2)
}

// Authentication
function initializeAuth() {
  // Check if user is logged in from localStorage
  const savedUser = localStorage.getItem("flipmart-user")
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser)
      updateAuthDisplay()
    } catch (e) {
      // Invalid user data
      localStorage.removeItem("flipmart-user")
      currentUser = null
    }
  }
}

function updateAuthDisplay() {
  // Update UI based on auth state
  const authBtn = document.querySelector(".action-item:has(.fa-user), .action-item:has(.fa-user-check)")
  if (authBtn) {
    if (currentUser) {
      authBtn.querySelector("span").textContent = "Account"
      authBtn.querySelector("i").className = "fas fa-user-check"
      authBtn.onclick = () => goToPage("account.html")
    } else {
      authBtn.querySelector("span").textContent = "Login"
      authBtn.querySelector("i").className = "fas fa-user"
      authBtn.onclick = openLoginModal
    }
  }
}

function openLoginModal() {
  if (currentUser) {
    // Show user menu or go to account page
    goToPage("account.html")
    return
  }

  setupAuthModal("signin")
  openModal("login-modal")
}

function setupAuthModal(mode) {
  isAuthMode = mode
  const title = document.querySelector("#login-modal .modal-header h3")
  const submitBtn = document.querySelector("#login-modal button[type='submit']")
  const switchLink = document.querySelector("#login-modal .modal-footer a")

  if (mode === "signin") {
    if (title) title.textContent = "Login"
    if (submitBtn) submitBtn.textContent = "Login"
    if (switchLink) {
      switchLink.textContent = "Create an account"
      switchLink.onclick = () => setupAuthModal("signup")
    }
  } else {
    if (title) title.textContent = "Sign Up"
    if (submitBtn) submitBtn.textContent = "Sign Up"
    if (switchLink) {
      switchLink.textContent = "Already have an account? Login"
      switchLink.onclick = () => setupAuthModal("signin")
    }
  }
}

function handleLogin(event) {
  event.preventDefault()
  const form = event.target
  const email = form.querySelector('input[type="text"]').value
  const password = form.querySelector('input[type="password"]').value

  if (email && password) {
    // Create user object with basic info
    currentUser = {
      email: email,
      name: email.split("@")[0], // Use part of email as name
      phone: "",
      gender: "Not specified",
      dob: "",
      memberSince: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
    }
    localStorage.setItem("flipmart-user", JSON.stringify(currentUser))
    closeModal("login-modal")
    showNotification("Logged in successfully!", "success")
    updateAuthDisplay()
  } else {
    showNotification("Please fill in all fields", "error")
  }
}

// Navigation functions
function goToPage(page) {
  window.location.href = page
}

function goToCategory(category) {
  window.location.href = `products.html?category=${category}`
}

function goToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`
}

// Search functionality
function performSearch() {
  const searchInput = document.getElementById("search-input")
  const query = searchInput?.value.trim()

  if (query) {
    window.location.href = `products.html?search=${encodeURIComponent(query)}`
  }
}

function setupSearchSuggestions() {
  const searchInput = document.getElementById("search-input")
  const suggestions = document.getElementById("search-suggestions")

  if (!searchInput || !suggestions) return

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim()

    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (query.length > 2) {
        showSearchSuggestions(query, suggestions)
      } else {
        suggestions.style.display = "none"
      }
    }, 300)
  })

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.style.display = "none"
    }
  })
}

function showSearchSuggestions(query, container) {
  const products = window.sampleProducts || []
  const matches = products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 5)

  if (matches.length > 0) {
    container.innerHTML = matches
      .map(
        (product) => `
      <div class="suggestion-item" onclick="goToProductDetail('${product.id}')">
        <img src="${product.image}" alt="${product.title}">
        <div>
          <div class="suggestion-title">${product.title}</div>
          <div class="suggestion-price">₹${product.price.toLocaleString()}</div>
        </div>
      </div>
    `,
      )
      .join("")
    container.style.display = "block"
  } else {
    container.style.display = "none"
  }
}

// Quick view
function quickViewProduct(productId) {
  const product = window.sampleProducts?.find((p) => p.id === productId)
  if (!product) return

  // Populate quick view modal
  const modal = document.getElementById("quick-view-modal")
  if (modal) {
    modal.querySelector("#quick-view-image").src = product.image
    modal.querySelector("#quick-view-title").textContent = product.title
    modal.querySelector("#quick-view-rating").innerHTML = generateStars(product.rating)
    modal.querySelector("#quick-view-rating-count").textContent = `(${product.ratingCount} reviews)`
    modal.querySelector("#quick-view-price").textContent = `₹${product.price.toLocaleString()}`

    const originalPriceEl = modal.querySelector("#quick-view-original-price")
    if (originalPriceEl) {
      originalPriceEl.textContent = product.originalPrice ? `₹${product.originalPrice.toLocaleString()}` : ""
    }

    const discountEl = modal.querySelector("#quick-view-discount")
    if (discountEl && product.originalPrice) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      discountEl.textContent = `${discount}% off`
    }

    modal.querySelector("#quick-view-description").textContent = product.description

    // Set up action buttons
    const addToCartBtn = modal.querySelector('button[onclick*="addToCartFromQuickView"]')
    if (addToCartBtn) {
      addToCartBtn.onclick = () => {
        addToCart(productId)
        closeModal("quick-view-modal")
      }
    }

    const viewDetailsBtn = modal.querySelector('button[onclick*="viewProductDetails"]')
    if (viewDetailsBtn) {
      viewDetailsBtn.onclick = () => {
        closeModal("quick-view-modal")
        goToProductDetail(productId)
      }
    }

    openModal("quick-view-modal")
  }
}

// Categories
function toggleCategories() {
  const dropdown = document.getElementById("categories-dropdown")
  if (dropdown) {
    dropdown.classList.toggle("active")
  }
}

// Utility functions
function showNotification(message, type = "success") {
  if (!notification) return

  const icon = notification.querySelector(".notification-icon")
  const messageEl = notification.querySelector(".notification-message")

  notification.className = `notification ${type}`

  if (icon) {
    icon.className =
      type === "success" ? "fas fa-check-circle notification-icon" : "fas fa-exclamation-circle notification-icon"
  }

  if (messageEl) {
    messageEl.textContent = message
  }

  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

function closeBanner() {
  const banner = document.querySelector(".top-banner")
  if (banner) {
    banner.style.display = "none"
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function subscribeNewsletter(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value

  if (email) {
    showNotification("Successfully subscribed to newsletter!", "success")
    event.target.reset()
  }
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right").forEach((el) => {
    observer.observe(el)
  })
}

// Event listeners
function initializeEventListeners() {
  // Theme toggle - fix the selector
  document.addEventListener("click", (e) => {
    if (e.target.closest(".action-item") && e.target.closest(".action-item").onclick === toggleTheme) {
      toggleTheme()
    }
  })

  // Add direct event listener for theme toggle
  const themeToggleBtn = document.querySelector('[onclick="toggleTheme()"]')
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", (e) => {
      e.preventDefault()
      toggleTheme()
    })
  }

  // Rest of the existing event listeners...
  // Search
  const searchInput = document.getElementById("search-input")
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
    setupSearchSuggestions()
  }

  // Auth form
  const authForm = document.querySelector("#login-modal form")
  if (authForm) {
    authForm.addEventListener("submit", handleLogin)
  }

  // Modal close buttons
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal")
      if (modal) {
        closeModal(modal.id)
      }
    })
  })

  // Modal background click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id)
      }
    })
  })

  // Scroll events
  window.addEventListener("scroll", () => {
    // Back to top button
    if (backToTop) {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible")
      } else {
        backToTop.classList.remove("visible")
      }
    }

    // Header scroll effect
    const header = document.querySelector(".header")
    if (header) {
      if (window.scrollY > 100) {
        header.style.boxShadow = "var(--shadow-strong)"
      } else {
        header.style.boxShadow = "var(--shadow-light)"
      }
    }
  })

  // Click outside categories dropdown
  document.addEventListener("click", (e) => {
    const categoriesMenu = document.querySelector(".categories-menu")
    const dropdown = document.getElementById("categories-dropdown")

    if (categoriesMenu && dropdown && !categoriesMenu.contains(e.target)) {
      dropdown.classList.remove("active")
    }
  })

  // Escape key to close modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((modal) => {
        closeModal(modal.id)
      })
    }
  })

  // Deal cards
  document.querySelectorAll(".deal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showNotification("Deal added to cart!", "success")
    })
  })

  // Category cards
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.getAttribute("onclick")?.match(/'([^']+)'/)?.[1]
      if (category) {
        goToCategory(category)
      }
    })
  })
}

// Initialize everything
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp)
} else {
  initializeApp()
}

// Export functions for global use
window.toggleTheme = toggleTheme
window.performSearch = performSearch
window.goToPage = goToPage
window.goToCategory = goToCategory
window.goToProductDetail = goToProductDetail
window.addToCart = addToCart
window.toggleWishlist = toggleWishlist
window.openLoginModal = openLoginModal
window.openSignupModal = () => setupAuthModal("signup")
window.handleLogin = handleLogin
window.toggleCategories = toggleCategories
window.nextSlide = nextSlide
window.previousSlide = previousSlide
window.currentSlide = currentSlideSet
window.closeBanner = closeBanner
window.scrollToTop = scrollToTop
window.subscribeNewsletter = subscribeNewsletter
window.quickViewProduct = quickViewProduct
window.openModal = openModal
window.closeModal = closeModal
window.logout = logout

function logout() {
  localStorage.removeItem("flipmart-user")
  currentUser = null
  updateAuthDisplay()
  showNotification("Logged out successfully", "success")

  // Redirect to home if on account page
  if (window.location.href.includes("account.html")) {
    goToPage("index.html")
  }
}
