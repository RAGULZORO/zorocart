// Help page functionality
const faqData = [
  {
    category: "orders",
    question: "How can I track my order?",
    answer:
      "You can track your order by going to 'My Orders' section in your account or using the tracking link sent to your email.",
  },
  {
    category: "orders",
    question: "Can I cancel my order?",
    answer: "Yes, you can cancel your order before it's shipped. Go to 'My Orders' and click on 'Cancel Order'.",
  },
  {
    category: "orders",
    question: "What is the return policy?",
    answer:
      "We offer a 7-day return policy for most items. The product should be in original condition with tags intact.",
  },
  {
    category: "payments",
    question: "What payment methods do you accept?",
    answer: "We accept Credit/Debit cards, UPI, Net Banking, Digital Wallets, and Cash on Delivery.",
  },
  {
    category: "payments",
    question: "When will I get my refund?",
    answer: "Refunds are processed within 7-10 business days after we receive the returned item.",
  },
  {
    category: "account",
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
  },
  {
    category: "account",
    question: "How do I update my profile information?",
    answer: "Go to 'My Account' > 'Profile' and click on 'Edit Profile' to update your information.",
  },
  {
    category: "products",
    question: "How do I know if a product is genuine?",
    answer:
      "All products on FlipMart are sourced directly from brands or authorized dealers. Look for the 'Genuine Product' badge.",
  },
  {
    category: "technical",
    question: "The website is not loading properly",
    answer:
      "Try clearing your browser cache, disable ad blockers, or try using a different browser. Contact support if the issue persists.",
  },
  {
    category: "policies",
    question: "What is your privacy policy?",
    answer:
      "Our privacy policy outlines how we collect, use, and protect your personal information. You can read it in the footer links.",
  },
]

const helpArticles = [
  {
    id: 1,
    title: "How to Place Your First Order",
    category: "Getting Started",
    readTime: "3 min read",
    content: "Step-by-step guide to placing your first order on FlipMart...",
  },
  {
    id: 2,
    title: "Understanding Delivery Options",
    category: "Delivery",
    readTime: "2 min read",
    content: "Learn about different delivery options available...",
  },
  {
    id: 3,
    title: "Payment Security and Safety",
    category: "Payments",
    readTime: "4 min read",
    content: "How we keep your payment information secure...",
  },
  {
    id: 4,
    title: "Return and Exchange Process",
    category: "Returns",
    readTime: "5 min read",
    content: "Complete guide to returning or exchanging products...",
  },
]

document.addEventListener("DOMContentLoaded", () => {
  initializeHelpPage()
})

function initializeHelpPage() {
  loadFAQs()
  loadHelpArticles()
  setupEventListeners()
}

function loadFAQs(category = "all") {
  const faqContainer = document.getElementById("faq-container")
  if (!faqContainer) return

  const filteredFAQs = category === "all" ? faqData : faqData.filter((faq) => faq.category === category)

  faqContainer.innerHTML = filteredFAQs
    .map(
      (faq, index) => `
    <div class="faq-item">
      <div class="faq-question" onclick="toggleFAQ(${index})">
        <span>${faq.question}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="faq-answer" id="faq-answer-${index}">
        <p>${faq.answer}</p>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadHelpArticles() {
  const articlesGrid = document.getElementById("articles-grid")
  if (!articlesGrid) return

  articlesGrid.innerHTML = helpArticles
    .map(
      (article) => `
    <div class="article-card" onclick="openArticle(${article.id})">
      <div class="article-category">${article.category}</div>
      <h3>${article.title}</h3>
      <div class="article-meta">
        <span class="read-time">
          <i class="fas fa-clock"></i>
          ${article.readTime}
        </span>
      </div>
    </div>
  `,
    )
    .join("")
}

function setupEventListeners() {
  // Help search
  const helpSearchInput = document.getElementById("help-search-input")
  if (helpSearchInput) {
    helpSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchHelp()
      }
    })
  }
}

function toggleFAQ(index) {
  const answer = document.getElementById(`faq-answer-${index}`)
  const question = answer.previousElementSibling
  const icon = question.querySelector("i")

  if (answer.style.display === "block") {
    answer.style.display = "none"
    icon.style.transform = "rotate(0deg)"
    question.classList.remove("active")
  } else {
    // Close all other FAQs
    document.querySelectorAll(".faq-answer").forEach((ans) => {
      ans.style.display = "none"
    })
    document.querySelectorAll(".faq-question").forEach((q) => {
      q.classList.remove("active")
      q.querySelector("i").style.transform = "rotate(0deg)"
    })

    // Open clicked FAQ
    answer.style.display = "block"
    icon.style.transform = "rotate(180deg)"
    question.classList.add("active")
  }
}

function showCategory(category) {
  loadFAQs(category)

  // Scroll to FAQ section
  const faqSection = document.querySelector(".faq-section")
  if (faqSection) {
    faqSection.scrollIntoView({ behavior: "smooth" })
  }

  // Update page title
  const categoryTitles = {
    orders: "Orders & Delivery",
    payments: "Payments & Refunds",
    account: "Account & Profile",
    products: "Products & Services",
    technical: "Technical Support",
    policies: "Policies & Terms",
  }

  const faqTitle = document.querySelector(".faq-section h2")
  if (faqTitle && categoryTitles[category]) {
    faqTitle.textContent = `${categoryTitles[category]} - FAQ`
  }
}

function searchHelp() {
  const searchInput = document.getElementById("help-search-input")
  const query = searchInput?.value.trim().toLowerCase()

  if (!query) return

  // Filter FAQs based on search
  const filteredFAQs = faqData.filter(
    (faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query),
  )

  const faqContainer = document.getElementById("faq-container")
  if (faqContainer) {
    if (filteredFAQs.length > 0) {
      faqContainer.innerHTML = filteredFAQs
        .map(
          (faq, index) => `
        <div class="faq-item">
          <div class="faq-question" onclick="toggleFAQ(${index})">
            <span>${faq.question}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer" id="faq-answer-${index}">
            <p>${faq.answer}</p>
          </div>
        </div>
      `,
        )
        .join("")
    } else {
      faqContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No results found</h3>
          <p>Try searching with different keywords</p>
        </div>
      `
    }
  }

  // Scroll to results
  const faqSection = document.querySelector(".faq-section")
  if (faqSection) {
    faqSection.scrollIntoView({ behavior: "smooth" })
  }
}

function startLiveChat() {
  alert("Live chat will be available soon!")
}

function openEmailSupport() {
  alert("Email support will be available soon!")
}

function callSupport() {
  window.open("tel:1800-123-4567")
}

function submitContactForm(event) {
  event.preventDefault()

  const subject = document.getElementById("contact-subject").value
  const orderId = document.getElementById("contact-order-id").value
  const message = document.getElementById("contact-message").value
  const email = document.getElementById("contact-email").value

  // Simulate form submission
  alert("Your message has been sent! We'll get back to you soon.")

  // Reset form
  event.target.reset()
}

function openArticle(articleId) {
  const article = helpArticles.find((a) => a.id === articleId)
  if (article) {
    alert(`Opening article: ${article.title}`)
    // In a real app, this would navigate to the article page
  }
}

// Export functions
window.toggleFAQ = toggleFAQ
window.showCategory = showCategory
window.searchHelp = searchHelp
window.startLiveChat = startLiveChat
window.openEmailSupport = openEmailSupport
window.callSupport = callSupport
window.submitContactForm = submitContactForm
window.openArticle = openArticle
