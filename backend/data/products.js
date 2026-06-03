/**
 * Mock Product Dataset
 * Contains 15 realistic products for the E-Commerce catalog.
 * Follows the required schema: id, name, category, brand, price, rating, stock, image, description.
 */

const products = [
  {
    id: "prod-1",
    name: "Aura Smart ANC Headphones",
    category: "Electronics",
    brand: "AuraTech",
    price: 14999,
    rating: 4.8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    description: "Premium wireless over-ear headphones with hybrid active noise cancellation, high-fidelity audio, and up to 40 hours of battery life."
  },
  {
    id: "prod-2",
    name: "Minimalist Leather Backpack",
    category: "Fashion",
    brand: "Lumina Studio",
    price: 4500,
    rating: 4.6,
    stock: 15,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    description: "Sleek and slim full-grain leather backpack featuring dedicated laptop compartments and weather-resistant brass zippers."
  },
  {
    id: "prod-3",
    name: "Wabi-Sabi Ceramic Vase Set",
    category: "Home Decor",
    brand: "Kyoto Art",
    price: 3200,
    rating: 4.9,
    stock: 8,
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600&auto=format&fit=crop",
    description: "Handcrafted terracotta ceramic vases with rough matte texture. Ideal for minimalist interiors and dry floral arrangements."
  },
  {
    id: "prod-4",
    name: "Apex Ergonomic Mesh Chair",
    category: "Furniture",
    brand: "ApexOffice",
    price: 24990,
    rating: 4.9,
    stock: 12,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop",
    description: "Advanced ergonomic office chair with responsive mesh back, weight-activated tilt control, and articulating 3D armrests."
  },
  {
    id: "prod-5",
    name: "Atomic Habits (Hardcover)",
    category: "Books",
    brand: "Penguin Random House",
    price: 599,
    rating: 4.9,
    stock: 100,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    description: "The definitive guide by James Clear on building good habits, breaking bad ones, and making tiny daily changes that yield massive results."
  },
  {
    id: "prod-6",
    name: "PureFlow HEPA Air Purifier",
    category: "Electronics",
    brand: "AuraTech",
    price: 12999,
    rating: 4.7,
    stock: 18,
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=600&auto=format&fit=crop",
    description: "Whisper-quiet air purifier with HEPA-13 multi-stage filtration and real-time PM2.5 air quality indicator rings."
  },
  {
    id: "prod-7",
    name: "Chroma Smart Bulb RGB (E26)",
    category: "Electronics",
    brand: "Lumina Studio",
    price: 1999,
    rating: 4.5,
    stock: 50,
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=600&auto=format&fit=crop",
    description: "16-million color smart LED light bulb. Integrates seamlessly with Amazon Alexa, Apple HomeKit, and Google Assistant."
  },
  {
    id: "prod-8",
    name: "Slim Fit Linen Shirt",
    category: "Fashion",
    brand: "Lumina Studio",
    price: 2490,
    rating: 4.4,
    stock: 30,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
    description: "Premium breathable pure linen long-sleeve button-down shirt. Perfect for smart casual occasions and humid weather."
  },
  {
    id: "prod-9",
    name: "Preserved Moss Wall Panel",
    category: "Home Decor",
    brand: "Kyoto Art",
    price: 7990,
    rating: 4.8,
    stock: 6,
    image: "https://images.unsplash.com/photo-1535696582863-f8232938f375?q=80&w=600&auto=format&fit=crop",
    description: "Maintenance-free biological moss frame bringing an organic touch of nature into modern home layouts."
  },
  {
    id: "prod-10",
    name: "Ascent Solid Oak Standing Desk",
    category: "Furniture",
    brand: "ApexOffice",
    price: 39990,
    rating: 4.8,
    stock: 5,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop",
    description: "Premium electric adjustable standing desk featuring dual motors, robust steel legs, and pre-programmed height memories."
  },
  {
    id: "prod-11",
    name: "Zero to One (Paperback)",
    category: "Books",
    brand: "Crown Business",
    price: 499,
    rating: 4.7,
    stock: 80,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
    description: "Legendary entrepreneur and investor Peter Thiel writes about how to build companies that create entirely new things."
  },
  {
    id: "prod-12",
    name: "Synapse Smart Hub Speaker",
    category: "Electronics",
    brand: "AuraTech",
    price: 8990,
    rating: 4.6,
    stock: 22,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=600&auto=format&fit=crop",
    description: "Dynamic 360-degree wireless speaker with capacitive glass-top touch inputs and integrated smart assistant routines."
  },
  {
    id: "prod-13",
    name: "Kanso Solid Walnut Dining Table",
    category: "Furniture",
    brand: "Kyoto Art",
    price: 54990,
    rating: 5.0,
    stock: 3,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=600&auto=format&fit=crop",
    description: "Stunning low-profile solid American walnut dining table showcasing natural wood grains with structural elegance."
  },
  {
    id: "prod-14",
    name: "Classic Chronograph Watch",
    category: "Fashion",
    brand: "Lumina Studio",
    price: 18900,
    rating: 4.8,
    stock: 10,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop",
    description: "Exquisite stainless steel wristwatch with a rich black dial, date window, and a comfortable genuine leather strap."
  },
  {
    id: "prod-15",
    name: "Thinking, Fast and Slow",
    category: "Books",
    brand: "Farrar, Straus and Giroux",
    price: 799,
    rating: 4.9,
    stock: 45,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
    description: "Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think."
  }
];

module.exports = products;
