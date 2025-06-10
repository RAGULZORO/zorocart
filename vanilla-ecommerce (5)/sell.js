// Sell page functionality
const currentStep = 1
const totalSteps = 4

// Declare variables before using them
function updateCartBadge() {
  // Placeholder for updateCartBadge implementation
  console.log("Updating cart badge")
}

function showNotification(message, type) {
  // Placeholder for showNotification implementation
  console.log(`Notification: ${message} (Type: ${type})`)
}

// Initialize sell page
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge()
  initializeForm()
})

// Initialize form
function initializeForm() {
  const form = document.getElementById("sellerRegistrationForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    submitRegistration()
  })

  // Add real-time validation
  addFormValidation()
}

// Add form validation
function addFormValidation() {
  const requiredFields = document.querySelectorAll("input[required], select[required], textarea[required]")

  requiredFields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateField(this)
    })

    field.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        validateField(this)
      }
    })
  })

  // Special validation for specific fields
  document.getElementById("contactEmail").addEventListener("blur", validateEmail)
  document.getElementById("contactPhone").addEventListener("blur", validatePhone)
  document.getElementById("gstNumber").addEventListener("blur", validateGST)
  document.getElementById("panNumber").addEventListener("blur", validatePAN)
  document.getElementById("pincode").addEventListener("blur", validatePincode)
  document.getElementById("ifscCode").addEventListener("blur", validateIFSC)
}

// Validate individual field
function validateField(field) {
  const value = field.value.trim()

  if (field.hasAttribute("required") && value === "") {
    showFieldError(field, "This field is required")
    return false
  }

  clearFieldError(field)
  return true
}

// Validate email
function validateEmail() {
  const email = this.value.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email && !emailRegex.test(email)) {
    showFieldError(this, "Please enter a valid email address")
    return false
  }

  clearFieldError(this)
  return true
}

// Validate phone
function validatePhone() {
  const phone = this.value.trim()
  const phoneRegex = /^[6-9]\d{9}$/

  if (phone && !phoneRegex.test(phone)) {
    showFieldError(this, "Please enter a valid 10-digit mobile number")
    return false
  }

  clearFieldError(this)
  return true
}

// Validate GST
function validateGST() {
  const gst = this.value.trim()
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

  if (gst && !gstRegex.test(gst)) {
    showFieldError(this, "Please enter a valid GST number")
    return false
  }

  clearFieldError(this)
  return true
}

// Validate PAN
function validatePAN() {
  const pan = this.value.trim()
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

  if (pan && !panRegex.test(pan)) {
    showFieldError(this, "Please enter a valid PAN number")
    return false
  }

  clearFieldError(this)
  return true
}

// Validate pincode
function validatePincode() {
  const pincode = this.value.trim()
  const pincodeRegex = /^[1-9][0-9]{5}$/

  if (pincode && !pincodeRegex.test(pincode)) {
    showFieldError(this, "Please enter a valid 6-digit PIN code")
    return false
  }

  clearFieldError(this)
  return true
}

// Validate IFSC
function validateIFSC() {
  const ifsc = this.value.trim()
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/

  if (ifsc && !ifscRegex.test(ifsc)) {
    showFieldError(this, "Please enter a valid IFSC code")
    return false
  }

  clearFieldError(this)
  return true
}

// Show field error
function showFieldError(field, message) {
  field.classList.add("error")

  // Remove existing error message
  const existingError = field.parentNode.querySelector(".error-message")
  if (existingError) {
    existingError.remove()
  }

  // Add new error message
  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message"
  errorDiv.textContent = message
  field.parentNode.appendChild(errorDiv)
}

// Clear field error
function clearFieldError(field) {
  field.classList.remove("error")
  const errorMessage = field.parentNode.querySelector(".error-message")
  if (errorMessage) {
    errorMessage.remove()
  }
}

// Submit registration
function submitRegistration() {
  const form = document.getElementById("sellerRegistrationForm")
  const formData = new FormData(form)

  // Validate all fields
  let isValid = true
  const requiredFields = form.querySelectorAll("input[required], select[required], textarea[required]")

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  // Check if at least one category is selected
  const categories = form.querySelectorAll('input[name="categories"]:checked')
  if (categories.length === 0) {
    showNotification("Please select at least one product category", "error")
    isValid = false
  }

  // Check terms agreement
  const agreeTerms = form.querySelector("#agreeTerms")
  if (!agreeTerms.checked) {
    showNotification("Please agree to the Terms and Conditions", "error")
    isValid = false
  }

  if (!isValid) {
    showNotification("Please fix the errors in the form", "error")
    return
  }

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show success message
    showNotification("Registration submitted successfully! We will contact you within 2-3 business days.", "success")

    // Reset form
    form.reset()

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, 2000)
}

// Reset form
function resetForm() {
  const form = document.getElementById("sellerRegistrationForm")
  form.reset()

  // Clear all errors
  form.querySelectorAll(".error").forEach((field) => {
    clearFieldError(field)
  })

  showNotification("Form has been reset", "success")
}

// Start selling action
function startSelling() {
  document.querySelector(".seller-registration").scrollIntoView({
    behavior: "smooth",
  })
}

// Learn more action
function learnMore() {
  showNotification("Demo video will be available soon!", "success")
}

// Toggle FAQ
function toggleFAQ(element) {
  const faqItem = element.parentNode
  const answer = faqItem.querySelector(".faq-answer")
  const icon = element.querySelector("i")

  // Close other open FAQs
  document.querySelectorAll(".faq-item").forEach((item) => {
    if (item !== faqItem) {
      item.querySelector(".faq-question").classList.remove("active")
      item.querySelector(".faq-answer").style.display = "none"
      item.querySelector(".faq-question i").style.transform = "rotate(0deg)"
    }
  })

  // Toggle current FAQ
  if (answer.style.display === "block") {
    answer.style.display = "none"
    element.classList.remove("active")
    icon.style.transform = "rotate(0deg)"
  } else {
    answer.style.display = "block"
    element.classList.add("active")
    icon.style.transform = "rotate(180deg)"
  }
}
