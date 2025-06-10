// Products page specific functionality
let allProducts = []
let filteredProducts = []
let currentPage = 1
const productsPerPage = 20
let activeFilters = {
  categories: [],
  brands: [],
  priceRange: { min: 0, max: 100000 },
  rating: [],
}

// Initialize products page
document.addEventListener("DOMContentLoaded", () => {
  initializeProductsPage()
})

async function initializeProductsPage() {
  await loadProducts()
  setupFilters()
  applyUrlFilters()
  renderProducts()
  updateResultsCount()
}

async function loadProducts() {
  try {
    // Use sample products for demo
    allProducts = window.sampleProducts || []
    filteredProducts = [...allProducts]
  } catch (error) {
    console.error("Error loading products:", error)
    showNotification("Error loading products", "error")
  }
}

function setupFilters() {
  // Price range sliders
  const priceMin = document.getElementById("price-min")
  const priceMax = document.getElementById("price-max")

  if (priceMin && priceMax) {
    priceMin.addEventListener("input", updatePriceRange)
    priceMax.addEventListener("input", updatePriceRange)
  }

  // Filter checkboxes
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters)
  })

  // Sort dropdown
  const sortSelect = document.getElementById("sort-select")
  if (sortSelect) {
    sortSelect.addEventListener("change", sortProducts)
  }
}

function applyUrlFilters() {
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")
  const search = urlParams.get("search")

  if (category) {
    const categoryCheckbox = document.querySelector(`input[value="${category}"]`)
    if (categoryCheckbox) {
      categoryCheckbox.checked = true
      activeFilters.categories.push(category)
    }
  }

  if (search) {
    const searchInput = document.getElementById("search-input")
    if (searchInput) {
      searchInput.value = search
    }
    filterBySearch(search)
  }
}

function applyFilters() {
  // Reset filters
  activeFilters = {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 100000 },
    rating: [],
  }

  // Collect category filters
  document
    .querySelectorAll('input[value="electronics"], input[value="fashion"], input[value="home"], input[value="books"]')
    .forEach((checkbox) => {
      if (checkbox.checked) {
        activeFilters.categories.push(checkbox.value)
      }
    })

  // Collect brand filters
  document.querySelectorAll('input[value="samsung"], input[value="apple"], input[value="nike"]').forEach((checkbox) => {
    if (checkbox.checked) {
      activeFilters.brands.push(checkbox.value)
    }
  })

  // Collect rating filters
  document.querySelectorAll('input[value="4"], input[value="3"]').forEach((checkbox) => {
    if (checkbox.checked) {
      activeFilters.rating.push(Number.parseInt(checkbox.value))
    }
  })

  // Apply price range
  const priceMin = document.getElementById("price-min")
  const priceMax = document.getElementById("price-max")
  if (priceMin && priceMax) {
    activeFilters.priceRange.min = Number.parseInt(priceMin.value)
    activeFilters.priceRange.max = Number.parseInt(priceMax.value)
  }

  filterProducts()
}

function filterProducts() {
  filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
      return false
    }

    // Brand filter
    if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand.toLowerCase())) {
      return false
    }

    // Price filter
    if (product.price < activeFilters.priceRange.min || product.price > activeFilters.priceRange.max) {
      return false
    }

    // Rating filter
    if (activeFilters.rating.length > 0 && !activeFilters.rating.some((rating) => product.rating >= rating)) {
      return false
    }

    return true
  })

  currentPage = 1
  renderProducts()
  updateResultsCount()
}

function filterBySearch(query) {
  const searchQuery = query.toLowerCase()
  filteredProducts = allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery),
  )

  currentPage = 1
  renderProducts()
  updateResultsCount()
}

function updatePriceRange() {
  const priceMin = document.getElementById("price-min")
  const priceMax = document.getElementById("price-max")
  const priceMinValue = document.getElementById("price-min-value")
  const priceMaxValue = document.getElementById("price-max-value")

  if (priceMin && priceMax && priceMinValue && priceMaxValue) {
    const min = Number.parseInt(priceMin.value)
    const max = Number.parseInt(priceMax.value)

    // Ensure min doesn't exceed max
    if (min > max) {
      priceMin.value = max
      return
    }

    priceMinValue.textContent = `₹${min.toLocaleString()}`
    priceMaxValue.textContent = `₹${max.toLocaleString()}`

    // Apply filter after a delay
    clearTimeout(window.priceFilterTimeout)
    window.priceFilterTimeout = setTimeout(applyFilters, 500)
  }
}

function sortProducts() {
  const sortSelect = document.getElementById("sort-select")
  if (!sortSelect) return

  const sortValue = sortSelect.value

  switch (sortValue) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      break
    default:
      // relevance - keep original order
      break
  }

  renderProducts()
}

function renderProducts() {
  const grid = document.getElementById("products-grid")
  if (!grid) return

  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const productsToShow = filteredProducts.slice(startIndex, endIndex)

  if (productsToShow.length === 0) {
    grid.innerHTML = `
      <div class="no-products">
        <i class="fas fa-search" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `
    return
  }

  grid.innerHTML = productsToShow.map((product) => createProductCard(product)).join("")

  // Update pagination
  updatePagination()

  // Add scroll animations
  setTimeout(() => {
    initializeScrollAnimations()
  }, 100)
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

function updateResultsCount() {
  const resultsCount = document.getElementById("results-count")
  if (resultsCount) {
    const total = filteredProducts.length
    const startIndex = (currentPage - 1) * productsPerPage + 1
    const endIndex = Math.min(currentPage * productsPerPage, total)

    resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} results`
  }
}

function updatePagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const pageNumbers = document.getElementById("page-numbers")

  if (!pageNumbers || totalPages <= 1) return

  let paginationHTML = ""

  // Always show first page
  if (currentPage > 3) {
    paginationHTML += `<span class="page-num" onclick="goToPage(1)">1</span>`
    if (currentPage > 4) {
      paginationHTML += `<span class="page-ellipsis">...</span>`
    }
  }

  // Show pages around current page
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, currentPage + 2)

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<span class="page-num ${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</span>`
  }

  // Always show last page
  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      paginationHTML += `<span class="page-ellipsis">...</span>`
    }
    paginationHTML += `<span class="page-num" onclick="goToPage(${totalPages})">${totalPages}</span>`
  }

  pageNumbers.innerHTML = paginationHTML
}

function goToPage(page) {
  currentPage = page
  renderProducts()
  updateResultsCount()

  // Scroll to top of products
  const productsContent = document.querySelector(".products-content")
  if (productsContent) {
    productsContent.scrollIntoView({ behavior: "smooth" })
  }
}

function previousPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1)
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  if (currentPage < totalPages) {
    goToPage(currentPage + 1)
  }
}

function clearAllFilters() {
  // Uncheck all checkboxes
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false
  })

  // Reset price range
  const priceMin = document.getElementById("price-min")
  const priceMax = document.getElementById("price-max")
  if (priceMin && priceMax) {
    priceMin.value = 0
    priceMax.value = 100000
    updatePriceRange()
  }

  // Reset sort
  const sortSelect = document.getElementById("sort-select")
  if (sortSelect) {
    sortSelect.value = "relevance"
  }

  // Apply filters
  applyFilters()

  showNotification("All filters cleared", "success")
}

// Export functions
window.applyFilters = applyFilters
window.updatePriceRange = updatePriceRange
window.sortProducts = sortProducts
window.clearAllFilters = clearAllFilters
window.goToPage = goToPage
window.previousPage = previousPage
window.nextPage = nextPage
