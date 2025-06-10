// Brands page functionality
let allBrands = []
let filteredBrands = []
let currentCategory = "all"
let currentAlphabet = "all"
let brandsLoaded = 50
const brandsPerLoad = 50

// Sample brands data
const sampleBrands = [
  {
    id: 1,
    name: "Apple",
    logo: "https://media.istockphoto.com/id/1371695315/photo/iphone-13-pro-sierra-blue.jpg?s=612x612&w=0&k=20&c=-0Mr9DdIRHFoLUozdltlHdkum0ChCNTGfLhxc-3oHmI=",
    category: "electronics",
    products: 1250,
    rating: 4.8,
    featured: true,
    description: "Innovation at its finest",
  },
  {
    id: 2,
    name: "Samsung",
    logo: "https://www.samsungmobilepress.com/file/E2D865121417BED4CCCE3AB6288204C6D10F27F744C5DA9475826F3CB5DC71EF261AC479715828213145AFB12DE9D44B464767C4A30B4E584FA0694EC4CE33A95AF3914FF18C9539AD4BDB058282C9FA128C39363B2D1503347D5496C2410128A8340AD04090BD6582AE881B89F5B2257FA7343BBEC5725513CA21B107939A25B9AF41361FF726E729CE0E44560746EC?1748458776445",
    category: "electronics",
    products: 2100,
    rating: 4.6,
    featured: true,
    description: "Technology for everyone",
  },
  {
    id: 3,
    name: "Nike",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQr_C2OaAG4n5JhBzt6c81T28CgR3GBWmNbw&s",
    category: "fashion",
    products: 850,
    rating: 4.7,
    featured: true,
    description: "Just Do It",
  },
  {
    id: 4,
    name: "Adidas",
    logo: "https://cdn.britannica.com/94/193794-050-0FB7060D/Adidas-logo.jpg",
    category: "fashion",
    products: 720,
    rating: 4.5,
    featured: false,
    description: "Impossible is Nothing",
  },
  {
    id: 5,
    name: "Sony",
    logo: "https://www.orissapost.com/wp-content/uploads/2018/11/sony.jpg",
    category: "electronics",
    products: 950,
    rating: 4.4,
    featured: true,
    description: "Be Moved",
  },
  {
    id: 6,
    name: "LG",
    logo: "https://bsmedia.business-standard.com/_media/bs/img/article/2024-12/16/full/1734340632-3929.jpg?im=FitAndFill=(826,465)",
    category: "home",
    products: 680,
    rating: 4.3,
    featured: false,
    description: "Life's Good",
  },
  {
    id: 7,
    name: "Puma",
    logo: "https://1000logos.net/wp-content/uploads/2017/05/PUMA-logo.jpg",
    category: "fashion",
    products: 540,
    rating: 4.2,
    featured: false,
    description: "Forever Faster",
  },
  {
    id: 8,
    name: "Bosch",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQenTjoKMQ68kRG7hvcUdysAapS02ZOxq6sTw&s",
    category: "home",
    products: 420,
    rating: 4.6,
    featured: false,
    description: "Invented for life",
  },
  {
    id: 9,
    name: "Canon",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT34bVAkgk-TSDge8Y3lziDYJjGFBHKrL7XFQ&s",
    category: "electronics",
    products: 380,
    rating: 4.5,
    featured: false,
    description: "Delighting you always",
  },
  {
    id: 10,
    name: "Lakme",
    logo: "https://m.media-amazon.com/images/I/51+grL76Z4L._AC_UF1000,1000_QL80_.jpg",
    category: "beauty",
    products: 320,
    rating: 4.1,
    featured: false,
    description: "Express the real you",
  },
]

// Function to update cart badge
function updateCartBadge() {
  // Placeholder for cart badge update logic
  console.log("Cart badge updated")
}

// Initialize brands page
document.addEventListener("DOMContentLoaded", () => {
  allBrands = [...sampleBrands]
  filteredBrands = [...allBrands]
  loadFeaturedBrands()
  loadBrands()
  updateCartBadge()
})

// Load featured brands
function loadFeaturedBrands() {
  const featuredBrands = allBrands.filter((brand) => brand.featured)
  const slider = document.getElementById("featuredBrandsSlider")

  slider.innerHTML = featuredBrands
    .map(
      (brand) => `
        <div class="featured-brand-card" onclick="viewBrand('${brand.name.toLowerCase()}')">
            <div class="brand-logo">
                <img src="${brand.logo}" alt="${brand.name}">
            </div>
            <h3>${brand.name}</h3>
            <p>${brand.description}</p>
            <div class="brand-stats">
                <span class="product-count">${brand.products}+ Products</span>
                <span class="brand-rating">
                    <i class="fas fa-star"></i>
                    ${brand.rating}
                </span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Show brand category
function showBrandCategory(category) {
  currentCategory = category

  // Update active tab
  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.classList.remove("active")
  })
  event.target.classList.add("active")

  // Filter brands
  filterBrands()

  // Update title
  const title = document.getElementById("brandsTitle")
  title.textContent =
    category === "all" ? "All Brands" : category.charAt(0).toUpperCase() + category.slice(1) + " Brands"
}

// Filter by alphabet
function filterByAlphabet(letter) {
  currentAlphabet = letter

  // Update active alphabet button
  document.querySelectorAll(".alphabet-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  event.target.classList.add("active")

  filterBrands()
}

// Filter brands
function filterBrands() {
  filteredBrands = allBrands.filter((brand) => {
    // Filter by category
    if (currentCategory !== "all" && brand.category !== currentCategory) {
      return false
    }

    // Filter by alphabet
    if (currentAlphabet !== "all" && !brand.name.startsWith(currentAlphabet)) {
      return false
    }

    return true
  })

  brandsLoaded = Math.min(brandsPerLoad, filteredBrands.length)
  loadBrands()
}

// Search brands
function searchBrands() {
  const searchTerm = document.getElementById("brandSearchInput").value.toLowerCase()

  if (searchTerm === "") {
    filteredBrands = allBrands.filter((brand) => {
      if (currentCategory !== "all" && brand.category !== currentCategory) {
        return false
      }
      if (currentAlphabet !== "all" && !brand.name.startsWith(currentAlphabet)) {
        return false
      }
      return true
    })
  } else {
    filteredBrands = allBrands.filter(
      (brand) => brand.name.toLowerCase().includes(searchTerm) || brand.description.toLowerCase().includes(searchTerm),
    )
  }

  brandsLoaded = Math.min(brandsPerLoad, filteredBrands.length)
  loadBrands()
}

// Load brands
function loadBrands() {
  const brandsGrid = document.getElementById("brandsGrid")
  const brandsToShow = filteredBrands.slice(0, brandsLoaded)

  brandsGrid.innerHTML = brandsToShow
    .map(
      (brand) => `
        <div class="brand-card" onclick="viewBrand('${brand.name.toLowerCase()}')">
            <div class="brand-logo">
                <img src="${brand.logo}" alt="${brand.name}">
            </div>
            <div class="brand-info">
                <h3 class="brand-name">${brand.name}</h3>
                <p class="brand-description">${brand.description}</p>
                <div class="brand-stats">
                    <div class="stat">
                        <i class="fas fa-box"></i>
                        <span>${brand.products}+ Products</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${brand.rating}</span>
                    </div>
                </div>
                <button class="brand-btn">
                    <i class="fas fa-arrow-right"></i>
                    Shop Now
                </button>
            </div>
        </div>
    `,
    )
    .join("")

  updateBrandsCount()
  updateLoadMoreButton()
}

// Sort brands
function sortBrands(sortBy) {
  switch (sortBy) {
    case "name":
      filteredBrands.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "name-desc":
      filteredBrands.sort((a, b) => b.name.localeCompare(a.name))
      break
    case "popularity":
      filteredBrands.sort((a, b) => b.rating - a.rating)
      break
    case "products":
      filteredBrands.sort((a, b) => b.products - a.products)
      break
  }

  brandsLoaded = Math.min(brandsPerLoad, filteredBrands.length)
  loadBrands()
}

// Load more brands
function loadMoreBrands() {
  brandsLoaded = Math.min(brandsLoaded + brandsPerLoad, filteredBrands.length)
  loadBrands()
}

// Update brands count
function updateBrandsCount() {
  const brandsCount = document.getElementById("brandsCount")
  brandsCount.textContent = `Showing 1-${brandsLoaded} of ${filteredBrands.length} brands`
}

// Update load more button
function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn")

  if (brandsLoaded >= filteredBrands.length) {
    loadMoreBtn.style.display = "none"
  } else {
    loadMoreBtn.style.display = "block"
    loadMoreBtn.innerHTML = `
            <i class="fas fa-plus"></i>
            Load More Brands (${filteredBrands.length - brandsLoaded} remaining)
        `
  }
}

// View brand
function viewBrand(brandName) {
  window.location.href = `products.html?brand=${brandName}`
}
