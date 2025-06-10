// Deals page functionality
let currentDealsPage = 1
const dealsPerPage = 20
let allDeals = []
let filteredDeals = []
let activeFilters = {
  type: [],
  discount: [],
  category: [],
}

// Sample deals data
const sampleDeals = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    brand: "Apple",
    image: "https://m.media-amazon.com/images/I/81dT7CUY6GL._AC_UF1000,1000_QL80_.jpg",
    originalPrice: 159900,
    currentPrice: 139900,
    discount: 13,
    category: "electronics",
    type: "flash",
    rating: 4.5,
    reviews: 2847,
    timeLeft: "2h 30m",
    badge: "Flash Deal",
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    image: "https://rukminim3.flixcart.com/image/850/1250/xif0q/mobile/5/i/7/-original-imahfu766ybd5h4z.jpeg?q=90&crop=false",
    originalPrice: 134999,
    currentPrice: 109999,
    discount: 19,
    category: "electronics",
    type: "daily",
    rating: 4.4,
    reviews: 1923,
    timeLeft: "1 day",
    badge: "Daily Deal",
  },
  {
    id: 3,
    title: "Nike Air Max 270",
    brand: "Nike",
    image: "https://static.nike.com/a/images/t_default/1518d6fb-ded7-45af-a879-6e1c130f1a95/W+AIR+MAX+270.png",
    originalPrice: 12995,
    currentPrice: 7797,
    discount: 40,
    category: "fashion",
    type: "clearance",
    rating: 4.3,
    reviews: 856,
    timeLeft: "3 days",
    badge: "40% OFF",
  },
  {
    id: 4,
    title: "MacBook Air M2",
    brand: "Apple",
    image: "https://images.moneycontrol.com/static-mcnews/2021/05/Apple-M2-MacBook-Air.jpg?impolicy=website&width=1600&height=900",
    originalPrice: 114900,
    currentPrice: 99900,
    discount: 13,
    category: "electronics",
    type: "bundle",
    rating: 4.6,
    reviews: 1245,
    timeLeft: "5 days",
    badge: "Bundle Offer",
  },
  {
    id: 5,
    title: "Sony WH-1000XM5",
    brand: "Sony",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg4B3TIdphrYORtUzO3wCjhWKNqDr-MKxIUA&s",
    originalPrice: 29990,
    currentPrice: 19990,
    discount: 33,
    category: "electronics",
    type: "flash",
    rating: 4.7,
    reviews: 2156,
    timeLeft: "1h 45m",
    badge: "Flash Deal",
  },
  {
    id: 6,
    title: "Adidas Ultraboost 22",
    brand: "Adidas",
    image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/09c586f7bbc3477f8165af1f00f70356_9366/Ultraboost_22_Shoes_Blue_HP9933_01_standard.jpg",
    originalPrice: 16999,
    currentPrice: 8499,
    discount: 50,
    category: "fashion",
    type: "clearance",
    rating: 4.2,
    reviews: 743,
    timeLeft: "2 days",
    badge: "50% OFF",
  },
]

// Initialize deals page
document.addEventListener("DOMContentLoaded", () => {
  allDeals = [...sampleDeals]
  filteredDeals = [...allDeals]
  loadDeals()
  startFlashTimer()
  updateCartBadge()
})

// Load deals into grid
function loadDeals() {
  const dealsGrid = document.getElementById("dealsGrid")
  const startIndex = (currentDealsPage - 1) * dealsPerPage
  const endIndex = startIndex + dealsPerPage
  const dealsToShow = filteredDeals.slice(startIndex, endIndex)

  dealsGrid.innerHTML = dealsToShow
    .map(
      (deal) => `
        <div class="deal-card" onclick="viewDeal(${deal.id})">
            <div class="deal-image">
                <img src="${deal.image}" alt="${deal.title}">
                <div class="deal-badge">${deal.badge}</div>
                <div class="deal-timer">${deal.timeLeft}</div>
            </div>
            <div class="deal-info">
                <div class="deal-brand">${deal.brand}</div>
                <h3 class="deal-title">${deal.title}</h3>
                <div class="deal-rating">
                    <div class="stars">
                        ${generateStars(deal.rating)}
                    </div>
                    <span class="rating-count">(${deal.reviews})</span>
                </div>
                <div class="deal-pricing">
                    <span class="current-price">₹${deal.currentPrice.toLocaleString()}</span>
                    <span class="original-price">₹${deal.originalPrice.toLocaleString()}</span>
                    <span class="discount">${deal.discount}% off</span>
                </div>
                <button class="deal-btn" onclick="event.stopPropagation(); addToCart(${deal.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `,
    )
    .join("")

  updateDealsCount()
  updatePagination()
}

// Generate star rating
function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>'
  }

  return stars
}

// Filter deals by type
function filterDeals(type) {
  activeFilters.type = [type]
  applyFilters()

  // Update active category card
  document.querySelectorAll(".deal-category-card").forEach((card) => {
    card.classList.remove("active")
  })
  event.target.closest(".deal-category-card").classList.add("active")
}

// Apply filter
function applyFilter(filterType, checkbox) {
  const value = checkbox.value

  if (checkbox.checked) {
    if (!activeFilters[filterType].includes(value)) {
      activeFilters[filterType].push(value)
    }
  } else {
    activeFilters[filterType] = activeFilters[filterType].filter((item) => item !== value)
  }

  applyFilters()
}

// Apply all filters
function applyFilters() {
  filteredDeals = allDeals.filter((deal) => {
    // Filter by type
    if (activeFilters.type.length > 0 && !activeFilters.type.includes(deal.type)) {
      return false
    }

    // Filter by discount
    if (activeFilters.discount.length > 0) {
      const discountMatch = activeFilters.discount.some((range) => {
        if (range === "10-25") return deal.discount >= 10 && deal.discount <= 25
        if (range === "25-50") return deal.discount >= 25 && deal.discount <= 50
        if (range === "50-75") return deal.discount >= 50 && deal.discount <= 75
        if (range === "75+") return deal.discount >= 75
        return false
      })
      if (!discountMatch) return false
    }

    // Filter by category
    if (activeFilters.category.length > 0 && !activeFilters.category.includes(deal.category)) {
      return false
    }

    return true
  })

  currentDealsPage = 1
  loadDeals()
}

// Clear all filters
function clearAllFilters() {
  activeFilters = {
    type: [],
    discount: [],
    category: [],
  }

  // Uncheck all checkboxes
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false
  })

  filteredDeals = [...allDeals]
  currentDealsPage = 1
  loadDeals()
}

// Sort deals
function sortDeals(sortBy) {
  switch (sortBy) {
    case "discount-high":
      filteredDeals.sort((a, b) => b.discount - a.discount)
      break
    case "discount-low":
      filteredDeals.sort((a, b) => a.discount - b.discount)
      break
    case "price-low":
      filteredDeals.sort((a, b) => a.currentPrice - b.currentPrice)
      break
    case "price-high":
      filteredDeals.sort((a, b) => b.currentPrice - a.currentPrice)
      break
    case "ending-soon":
      filteredDeals.sort((a, b) => {
        const timeA = parseTimeLeft(a.timeLeft)
        const timeB = parseTimeLeft(b.timeLeft)
        return timeA - timeB
      })
      break
    default:
      // Relevance - keep original order
      break
  }

  currentDealsPage = 1
  loadDeals()
}

// Parse time left for sorting
function parseTimeLeft(timeLeft) {
  if (timeLeft.includes("h")) {
    return Number.parseInt(timeLeft) * 60 // Convert to minutes
  } else if (timeLeft.includes("day")) {
    return Number.parseInt(timeLeft) * 24 * 60 // Convert to minutes
  } else if (timeLeft.includes("m")) {
    return Number.parseInt(timeLeft)
  }
  return 0
}

// Update deals count
function updateDealsCount() {
  const dealsCount = document.getElementById("dealsCount")
  const startIndex = (currentDealsPage - 1) * dealsPerPage + 1
  const endIndex = Math.min(currentDealsPage * dealsPerPage, filteredDeals.length)

  dealsCount.textContent = `Showing ${startIndex}-${endIndex} of ${filteredDeals.length} deals`
}

// Update pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage)
  const pageNumbers = document.getElementById("pageNumbers")

  let paginationHTML = ""

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentDealsPage) {
      paginationHTML += `<span class="page-num active">${i}</span>`
    } else {
      paginationHTML += `<span class="page-num" onclick="goToPage(${i})">${i}</span>`
    }
  }

  pageNumbers.innerHTML = paginationHTML
}

// Change page
function changePage(direction) {
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage)

  if (direction === "prev" && currentDealsPage > 1) {
    currentDealsPage--
  } else if (direction === "next" && currentDealsPage < totalPages) {
    currentDealsPage++
  }

  loadDeals()
  scrollToTop()
}

// Go to specific page
function goToPage(page) {
  currentDealsPage = page
  loadDeals()
  scrollToTop()
}

// View deal details
function viewDeal(dealId) {
  window.location.href = `product-detail.html?id=${dealId}`
}

// Add to cart
function addToCart(dealId) {
  const deal = allDeals.find((d) => d.id === dealId)
  if (deal) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const existingItem = cart.find((item) => item.id === dealId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: deal.id,
        title: deal.title,
        brand: deal.brand,
        image: deal.image,
        price: deal.currentPrice,
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartBadge()
    showNotification("Product added to cart!", "success")
  }
}

// Start flash timer
function startFlashTimer() {
  const timer = setInterval(() => {
    const hoursEl = document.getElementById("hours")
    const minutesEl = document.getElementById("minutes")
    const secondsEl = document.getElementById("seconds")

    let hours = Number.parseInt(hoursEl.textContent)
    let minutes = Number.parseInt(minutesEl.textContent)
    let seconds = Number.parseInt(secondsEl.textContent)

    if (seconds > 0) {
      seconds--
    } else if (minutes > 0) {
      minutes--
      seconds = 59
    } else if (hours > 0) {
      hours--
      minutes = 59
      seconds = 59
    } else {
      clearInterval(timer)
      // Timer ended - could refresh deals or show new timer
      return
    }

    hoursEl.textContent = hours.toString().padStart(2, "0")
    minutesEl.textContent = minutes.toString().padStart(2, "0")
    secondsEl.textContent = seconds.toString().padStart(2, "0")
  }, 1000)
}

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartBadge = document.getElementById("cartBadge")
  cartBadge.textContent = cart.length
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.classList.add("notification", type)
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}
