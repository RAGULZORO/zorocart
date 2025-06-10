// Import Firebase modules
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_zzkz58dLXgtdlg9no1CScbs0lbc7YdI",
  authDomain: "e-commerce-c06a2.firebaseapp.com",
  projectId: "e-commerce-c06a2",
  storageBucket: "e-commerce-c06a2.firebasestorage.app",
  messagingSenderId: "578640620648",
  appId: "1:578640620648:web:871d1dbd7c6d1f5688dfdd",
  measurementId: "G-FLCJQTNEHW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize services
const db = firebase.firestore()
const auth = firebase.auth()

// Sample products data
const sampleProducts = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    brand: "AudioTech",
    category: "electronics",
    price: 2999,
    originalPrice: 4999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpuxlSEHQiOnhGBNw5VESupM5I0-LFpleGTw&s",
    rating: 4.5,
    ratingCount: 2340,
    description: "Experience crystal-clear audio with active noise cancellation and 30-hour battery life.",
    features: ["Active Noise Cancellation", "30-hour battery", "Bluetooth 5.0", "Touch controls"],
    inStock: true,
    fastDelivery: true,
    badge: "Bestseller",
  },
  {
    id: "2",
    title: "Smart Fitness Watch",
    brand: "TechFit",
    category: "electronics",
    price: 1999,
    originalPrice: 3999,
    image: "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/23336503/acastro_220321_5092_0001.jpg?quality=90&strip=all&crop=0,10.732984293194,100,78.534031413613",
    rating: 4.3,
    ratingCount: 1567,
    description: "Track your fitness goals with advanced health monitoring and GPS.",
    features: ["Heart Rate Monitor", "GPS Tracking", "7-day battery", "Water resistant"],
    inStock: true,
    fastDelivery: true,
    badge: "New",
  },
  {
    id: "3",
    title: "Designer Leather Jacket",
    brand: "StyleCraft",
    category: "fashion",
    price: 4999,
    originalPrice: 7999,
    image: "https://www.voganow.com/cdn/shop/files/BBGJ-1108-014_2_copy.jpg?v=1740144445&width=360",
    rating: 4.7,
    ratingCount: 892,
    description: "Premium leather jacket with modern styling and superior comfort.",
    features: ["Genuine Leather", "Modern Fit", "Multiple Pockets", "Weather Resistant"],
    inStock: true,
    fastDelivery: false,
    badge: "Premium",
  },
  {
    id: "4",
    title: "Coffee Table Set",
    brand: "HomeDesign",
    category: "home",
    price: 8999,
    originalPrice: 12999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmNbCCLia5D3l-G4YJjMUDhRIIq-WQEC0jFA&s",
    rating: 4.4,
    ratingCount: 456,
    description: "Elegant coffee table set perfect for modern living rooms.",
    features: ["Solid Wood", "Modern Design", "Easy Assembly", "Scratch Resistant"],
    inStock: true,
    fastDelivery: false,
    badge: "Limited",
  },
  {
    id: "5",
    title: "Professional Camera Lens",
    brand: "PhotoPro",
    category: "electronics",
    price: 15999,
    originalPrice: 19999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuvfm-ZKpE_IFwQt3OzI1WIkS_6C-68Ctdg&s",
    rating: 4.8,
    ratingCount: 234,
    description: "High-quality camera lens for professional photography.",
    features: ["50mm focal length", "f/1.8 aperture", "Image stabilization", "Weather sealed"],
    inStock: true,
    fastDelivery: true,
    badge: "Pro",
  },
  {
    id: "6",
    title: "Yoga Mat Premium",
    brand: "FitLife",
    category: "sports",
    price: 1499,
    originalPrice: 2499,
    image: "https://5.imimg.com/data5/SELLER/Default/2023/6/319324509/EX/IZ/CI/2951851/rubber-yoga-mat.jpg",
    rating: 4.6,
    ratingCount: 1123,
    description: "Non-slip yoga mat for comfortable and safe practice.",
    features: ["Non-slip surface", "Eco-friendly", "6mm thickness", "Carrying strap"],
    inStock: true,
    fastDelivery: true,
    badge: "Eco",
  },
]

// Initialize sample data
async function initializeSampleData() {
  try {
    const productsRef = db.collection("products")
    const snapshot = await productsRef.get()

    if (snapshot.empty) {
      console.log("Initializing sample products...")
      for (const product of sampleProducts) {
        await productsRef.doc(product.id).set(product)
      }
      console.log("Sample products added successfully!")
    }
  } catch (error) {
    console.error("Error initializing sample data:", error)
  }
}

// Export for use in other files
window.sampleProducts = sampleProducts
window.db = db
window.auth = auth

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeSampleData)
