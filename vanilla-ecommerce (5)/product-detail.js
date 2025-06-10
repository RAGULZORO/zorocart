// Product detail page functionality
let currentProduct = null
let selectedColor = "black"
let selectedQuantity = 1
let currentTab = "description"

document.addEventListener("DOMContentLoaded", () => {
  initializeProductDetail()
})

function initializeProductDetail() {
  loadProductFromUrl()
  setupEventListeners()
  loadRelatedProducts()
}

function loadProductFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (productId) {
    currentProduct = window.sampleProducts?.find((p) => p.id === productId)
    if (currentProduct) {
      populateProductDetails()
    } else {
      showNotification("Product not found", "error")
      setTimeout(() => goToPage("products.html"), 2000)
    }
  } else {
    goToPage("products.html")
  }
}

function populateProductDetails() {
  if (!currentProduct) return

  // Update breadcrumb
  const breadcrumb = document.getElementById("product-breadcrumb")
  if (breadcrumb) {
    breadcrumb.textContent = currentProduct.title
  }

  // Update page title
  document.title = `${currentProduct.title} - FlipMart`

  // Main product image
  const mainImage = document.getElementById("main-product-image")
  if (mainImage) {
    mainImage.src = currentProduct.image
    mainImage.alt = currentProduct.title
  }

  // Product title
  const title = document.getElementById("product-title")
  if (title) {
    title.textContent = currentProduct.title
  }

  // Rating
  const ratingStars = document.querySelector(".product-rating .stars")
  if (ratingStars) {
    ratingStars.innerHTML = generateStars(currentProduct.rating)
  }

  const ratingValue = document.querySelector(".rating-value")
  if (ratingValue) {
    ratingValue.textContent = currentProduct.rating
  }

  const ratingCount = document.querySelector(".rating-count")
  if (ratingCount) {
    ratingCount.textContent = `(${currentProduct.ratingCount} Reviews)`
  }

  // Pricing
  const currentPrice = document.querySelector(".current-price")
  if (currentPrice) {
    currentPrice.textContent = `₹${currentProduct.price.toLocaleString()}`
  }

  const originalPrice = document.querySelector(".original-price")
  if (originalPrice && currentProduct.originalPrice) {
    originalPrice.textContent = `₹${currentProduct.originalPrice.toLocaleString()}`
  }

  const discount = document.querySelector(".discount")
  if (discount && currentProduct.originalPrice) {
    const discountPercent = Math.round(
      ((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100,
    )
    discount.textContent = `${discountPercent}% off`
  }

  // Description in tabs
  const descriptionTab = document.getElementById("description-tab")
  if (descriptionTab) {
    const descriptionContent = `
      <h3>Product Description</h3>
      <p>${currentProduct.description}</p>
      ${
        currentProduct.features
          ? `
        <h4>Key Features</h4>
        <ul>
          ${currentProduct.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      `
          : ""
      }
    `
    descriptionTab.innerHTML = descriptionContent
  }

  // Specifications
  const specsTab = document.getElementById("specifications-tab")
  if (specsTab) {
    specsTab.innerHTML = `
      <h3>Specifications</h3>
      <table class="specs-table">
        <tr><td>Brand</td><td>${currentProduct.brand}</td></tr>
        <tr><td>Category</td><td>${currentProduct.category}</td></tr>
        <tr><td>Model</td><td>${currentProduct.id}</td></tr>
        <tr><td>In Stock</td><td>${currentProduct.inStock ? "Yes" : "No"}</td></tr>
        <tr><td>Fast Delivery</td><td>${currentProduct.fastDelivery ? "Available" : "Standard"}</td></tr>
      </table>
    `
  }
}

function setupEventListeners() {
  // Thumbnail clicks
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.addEventListener("click", () => changeMainImage(thumb))
  })

  // Color options
  document.querySelectorAll(".color-option").forEach((color) => {
    color.addEventListener("click", () => selectColor(color))
  })

  // Quantity controls
  const qtyMinus = document.getElementById("quantity-minus")
  const qtyPlus = document.getElementById("quantity-plus")
  const qtyInput = document.getElementById("quantity")

  if (qtyMinus) qtyMinus.addEventListener("click", decreaseQuantity)
  if (qtyPlus) qtyPlus.addEventListener("click", increaseQuantity)
  if (qtyInput) {
    qtyInput.addEventListener("change", (e) => {
      selectedQuantity = Math.max(1, Number.parseInt(e.target.value) || 1)
      e.target.value = selectedQuantity
    })
  }

  // Tab switching
  document.querySelectorAll(".tab-header").forEach((header) => {
    header.addEventListener("click", () => {
      const tabName = header.textContent.toLowerCase()
      switchTab(tabName)
    })
  })

  // Action buttons
  const addToCartBtn = document.querySelector(".add-to-cart")
  const buyNowBtn = document.querySelector(".buy-now")
  const wishlistBtn = document.querySelector(".wishlist-btn")

  if (addToCartBtn) addToCartBtn.addEventListener("click", addToCart)
  if (buyNowBtn) buyNowBtn.addEventListener("click", buyNow)
  if (wishlistBtn) wishlistBtn.addEventListener("click", toggleWishlist)
}

function changeMainImage(thumbnail) {
  const mainImage = document.getElementById("main-product-image")
  if (mainImage && thumbnail) {
    mainImage.src = thumbnail.src

    // Update active thumbnail
    document.querySelectorAll(".thumbnail").forEach((t) => t.classList.remove("active"))
    thumbnail.classList.add("active")
  }
}

function selectColor(colorElement) {
  selectedColor = colorElement.dataset.color

  // Update active color
  document.querySelectorAll(".color-option").forEach((c) => c.classList.remove("active"))
  colorElement.classList.add("active")
}

function decreaseQuantity() {
  if (selectedQuantity > 1) {
    selectedQuantity--
    const qtyInput = document.getElementById("quantity")
    if (qtyInput) qtyInput.value = selectedQuantity
  }
}

function increaseQuantity() {
  const maxQty = 10 // Set maximum quantity
  if (selectedQuantity < maxQty) {
    selectedQuantity++
    const qtyInput = document.getElementById("quantity")
    if (qtyInput) qtyInput.value = selectedQuantity
  }
}

function switchTab(tabName) {
  // Update tab headers
  document.querySelectorAll(".tab-header").forEach((header) => {
    header.classList.remove("active")
    if (header.textContent.toLowerCase() === tabName) {
      header.classList.add("active")
    }
  })

  // Update tab content
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active")
  })

  const targetTab = document.getElementById(`${tabName}-tab`)
  if (targetTab) {
    targetTab.classList.add("active")
  }

  currentTab = tabName
}

function addToCart() {
  if (!currentProduct) return

  // Add to cart with selected options
  const cartItem = {
    ...currentProduct,
    selectedColor,
    quantity: selectedQuantity,
  }

  // Use the global addToCart function
  window.addToCart(currentProduct.id, selectedQuantity)
}

function buyNow() {
  if (!currentProduct) return

  // Add to cart first
  addToCart()

  // Redirect to cart
  setTimeout(() => {
    goToPage("cart.html")
  }, 500)
}

function toggleWishlist() {
  if (!currentProduct) return

  window.toggleWishlist(currentProduct.id)

  // Update wishlist button
  const wishlistBtn = document.querySelector(".wishlist-btn i")
  if (wishlistBtn) {
    const isInWishlist = window.wishlist?.some((item) => item.id === currentProduct.id)
    wishlistBtn.className = isInWishlist ? "fas fa-heart" : "far fa-heart"
  }
}

function changePincode() {
  const newPincode = prompt("Enter your pincode:")
  if (newPincode && newPincode.length === 6) {
    const deliveryInfo = document.querySelector(".delivery-item span")
    if (deliveryInfo) {
      deliveryInfo.textContent = `Deliver to: ${newPincode}`
    }
    showNotification("Pincode updated successfully!", "success")
  }
}

function loadRelatedProducts() {
  const relatedGrid = document.getElementById("related-products-grid")
  if (!relatedGrid || !currentProduct) return

  // Get products from same category, excluding current product
  const relatedProducts =
    window.sampleProducts
      ?.filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
      .slice(0, 4) || []

  relatedGrid.innerHTML = relatedProducts.map((product) => createProductCard(product)).join("")
}

function createProductCard(product) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return `
    <div class="product-card hover-lift" onclick="goToProductDetail('${product.id}')">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
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
      </div>
    </div>
  `
}

// Export functions
window.changeMainImage = changeMainImage
window.decreaseQuantity = decreaseQuantity
window.increaseQuantity = increaseQuantity
window.switchTab = switchTab
window.addToCart = addToCart
window.buyNow = buyNow
window.toggleWishlist = toggleWishlist
window.changePincode = changePincode
