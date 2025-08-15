import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables')
  process.exit(1)
}

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: { 
    type: String, 
    required: true, 
    enum: ['necklaces', 'earrings', 'rings', 'bracelets'] 
  },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }],
}, {
  timestamps: true
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const seedData = [
  // Necklaces
  {
    name: "Diamond Eternity Necklace",
    slug: "diamond-eternity-necklace",
    shortDescription: "Stunning diamond-studded necklace with timeless appeal",
    description: "This exquisite diamond eternity necklace features carefully selected diamonds set in 18k gold. Each stone is hand-selected for its brilliance and fire, creating a piece that captures light beautifully. Perfect for special occasions or as an everyday luxury.",
    price: 15000,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80"
    ],
    category: "necklaces",
    inStock: true,
    tags: ["bestseller", "luxury"]
  },
  {
    name: "Rose Gold Chain Necklace",
    slug: "rose-gold-chain-necklace",
    shortDescription: "Elegant rose gold chain perfect for layering",
    description: "A delicate rose gold chain necklace that embodies modern elegance. Crafted from premium rose gold, this versatile piece can be worn alone for subtle sophistication or layered with other necklaces for a contemporary look.",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80"
    ],
    category: "necklaces",
    inStock: true,
    tags: ["new", "trending"]
  },
  {
    name: "Pearl Statement Necklace",
    slug: "pearl-statement-necklace",
    shortDescription: "Bold pearl necklace for the modern woman",
    description: "Make a statement with this stunning pearl necklace featuring large, lustrous pearls arranged in an elegant design. Each pearl is carefully matched for size and quality, creating a piece that's both classic and contemporary.",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
      "https://images.unsplash.com/photo-1588444650700-6c7e62dcc5e2?w=600&q=80"
    ],
    category: "necklaces",
    inStock: true,
    tags: ["statement", "pearls"]
  },
  {
    name: "Vintage Gold Locket",
    slug: "vintage-gold-locket",
    shortDescription: "Antique-inspired gold locket with intricate detailing",
    description: "This beautifully crafted gold locket draws inspiration from vintage designs while incorporating modern techniques. The intricate engraving and premium gold construction make it a perfect keepsake piece that can hold your most precious memories.",
    price: 9500,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      "https://images.unsplash.com/photo-1543652437-853dcc91d19d?w=600&q=80"
    ],
    category: "necklaces",
    inStock: true,
    tags: ["vintage", "sentimental"]
  },

  // Earrings
  {
    name: "Crystal Drop Earrings",
    slug: "crystal-drop-earrings",
    shortDescription: "Sparkling crystal drops that catch the light",
    description: "These stunning crystal drop earrings feature high-quality crystals that sparkle with every movement. The elegant drop design adds length and drama to any outfit, making them perfect for both daytime elegance and evening glamour.",
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
      "https://images.unsplash.com/photo-1623944889288-cd147dbb7c5b?w=600&q=80"
    ],
    category: "earrings",
    inStock: true,
    tags: ["bestseller", "sparkle"]
  },
  {
    name: "Gold Hoop Earrings",
    slug: "gold-hoop-earrings",
    shortDescription: "Classic gold hoops with modern twist",
    description: "Timeless gold hoop earrings reimagined with contemporary proportions and finish. These versatile hoops are perfect for everyday wear yet elegant enough for special occasions. Crafted from solid gold for lasting beauty.",
    price: 7500,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80"
    ],
    category: "earrings",
    inStock: true,
    tags: ["classic", "versatile"]
  },
  {
    name: "Diamond Stud Earrings",
    slug: "diamond-stud-earrings",
    shortDescription: "Brilliant diamond studs for everyday luxury",
    description: "These exquisite diamond stud earrings feature perfectly matched diamonds set in premium gold settings. Each diamond is carefully selected for its exceptional clarity and brilliance, creating studs that add subtle luxury to any look.",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80",
      "https://images.unsplash.com/photo-1624226558435-59537b9b8ee8?w=600&q=80"
    ],
    category: "earrings",
    inStock: true,
    tags: ["luxury", "diamonds", "bestseller"]
  },
  {
    name: "Vintage Pearl Earrings",
    slug: "vintage-pearl-earrings",
    shortDescription: "Elegant pearl earrings with vintage charm",
    description: "These sophisticated pearl earrings combine the timeless elegance of pearls with vintage-inspired design elements. Each pearl is hand-selected for its luster and shape, creating earrings that are both classic and unique.",
    price: 5500,
    images: [
      "https://images.unsplash.com/photo-1588444650733-2d6d625c0adc?w=600&q=80",
      "https://images.unsplash.com/photo-1625633736480-bf5e0c9c6d84?w=600&q=80"
    ],
    category: "earrings",
    inStock: true,
    tags: ["pearls", "vintage", "elegant"]
  },
  {
    name: "Statement Chandelier Earrings",
    slug: "statement-chandelier-earrings",
    shortDescription: "Dramatic chandelier earrings for special occasions",
    description: "Make an unforgettable impression with these dramatic chandelier earrings. Featuring multiple tiers of sparkling stones and intricate metalwork, these earrings are designed to be the centerpiece of your ensemble.",
    price: 11500,
    images: [
      "https://images.unsplash.com/photo-1588443920642-7d6969ac8636?w=600&q=80",
      "https://images.unsplash.com/photo-1588444650700-6c7e62dcc5e2?w=600&q=80"
    ],
    category: "earrings",
    inStock: true,
    tags: ["statement", "dramatic", "special occasion"]
  },

  // Rings
  {
    name: "Solitaire Diamond Ring",
    slug: "solitaire-diamond-ring",
    shortDescription: "Classic solitaire with brilliant cut diamond",
    description: "The ultimate symbol of elegance, this solitaire diamond ring features a stunning brilliant-cut diamond set in a timeless setting. Each ring is crafted to showcase the diamond's natural beauty and maximize its brilliance.",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80"
    ],
    category: "rings",
    inStock: true,
    tags: ["luxury", "diamonds", "engagement", "bestseller"]
  },
  {
    name: "Vintage Rose Gold Band",
    slug: "vintage-rose-gold-band",
    shortDescription: "Antique-inspired rose gold wedding band",
    description: "This beautiful rose gold band features vintage-inspired detailing and milgrain edges. The warm rose gold tone and classic design make it a perfect wedding band or stackable ring that complements any jewelry collection.",
    price: 8000,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80"
    ],
    category: "rings",
    inStock: true,
    tags: ["vintage", "rose gold", "wedding"]
  },
  {
    name: "Emerald Cocktail Ring",
    slug: "emerald-cocktail-ring",
    shortDescription: "Bold emerald ring perfect for evening wear",
    description: "This stunning cocktail ring features a magnificent emerald surrounded by sparkling diamonds. The bold design and vibrant green emerald make this ring a perfect statement piece for special occasions and evening events.",
    price: 22000,
    images: [
      "https://images.unsplash.com/photo-1588444650733-2d6d625c0adc?w=600&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80"
    ],
    category: "rings",
    inStock: true,
    tags: ["emerald", "cocktail", "statement", "luxury"]
  },
  {
    name: "Stackable Gold Rings Set",
    slug: "stackable-gold-rings-set",
    shortDescription: "Set of three delicate stackable gold rings",
    description: "This elegant set includes three complementary gold rings designed to be worn together or separately. Each ring features a different texture or detail, allowing for multiple styling options and personalized combinations.",
    price: 12500,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80"
    ],
    category: "rings",
    inStock: true,
    tags: ["stackable", "set", "versatile", "new"]
  },
  {
    name: "Sapphire Halo Ring",
    slug: "sapphire-halo-ring",
    shortDescription: "Royal blue sapphire surrounded by diamonds",
    description: "This magnificent ring features a stunning royal blue sapphire at its center, surrounded by a halo of brilliant diamonds. The contrast between the deep blue sapphire and sparkling diamonds creates a truly captivating piece.",
    price: 28000,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80"
    ],
    category: "rings",
    inStock: true,
    tags: ["sapphire", "halo", "luxury", "royal"]
  },

  // Bracelets
  {
    name: "Diamond Tennis Bracelet",
    slug: "diamond-tennis-bracelet",
    shortDescription: "Classic tennis bracelet with brilliant diamonds",
    description: "This timeless diamond tennis bracelet features a continuous line of perfectly matched diamonds set in premium gold. Each diamond is carefully selected for exceptional brilliance, creating a bracelet that sparkles from every angle.",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      "https://images.unsplash.com/photo-1588443920642-7d6969ac8636?w=600&q=80"
    ],
    category: "bracelets",
    inStock: true,
    tags: ["luxury", "diamonds", "tennis", "bestseller"]
  },
  {
    name: "Gold Chain Bracelet",
    slug: "gold-chain-bracelet",
    shortDescription: "Elegant gold chain bracelet for everyday wear",
    description: "This sophisticated gold chain bracelet features a classic link design that's both timeless and contemporary. Perfect for everyday wear or special occasions, it can be worn alone or layered with other bracelets.",
    price: 7800,
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
      "https://images.unsplash.com/photo-1588443920642-7d6969ac8636?w=600&q=80"
    ],
    category: "bracelets",
    inStock: true,
    tags: ["classic", "everyday", "gold"]
  },
  {
    name: "Pearl & Gold Bangle",
    slug: "pearl-gold-bangle",
    shortDescription: "Luxurious bangle combining pearls and gold",
    description: "This exquisite bangle beautifully combines lustrous pearls with polished gold in an elegant design. The contrast between the smooth pearls and gleaming gold creates a piece that's both sophisticated and unique.",
    price: 13500,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
      "https://images.unsplash.com/photo-1588444650733-2d6d625c0adc?w=600&q=80"
    ],
    category: "bracelets",
    inStock: true,
    tags: ["pearls", "bangle", "luxury", "unique"]
  },
  {
    name: "Charm Bracelet Deluxe",
    slug: "charm-bracelet-deluxe",
    shortDescription: "Premium charm bracelet with meaningful symbols",
    description: "This deluxe charm bracelet comes with carefully selected charms representing love, luck, and prosperity. Each charm is crafted with attention to detail and can be personalized with additional charms to tell your unique story.",
    price: 9800,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
      "https://images.unsplash.com/photo-1588443920642-7d6969ac8636?w=600&q=80"
    ],
    category: "bracelets",
    inStock: true,
    tags: ["charm", "personalized", "meaningful", "new"]
  },
  {
    name: "Infinity Love Bracelet",
    slug: "infinity-love-bracelet",
    shortDescription: "Romantic infinity symbol bracelet in rose gold",
    description: "This romantic bracelet features the infinity symbol crafted in warm rose gold, representing endless love and connection. The delicate design makes it perfect for gifting or as a meaningful addition to your personal collection.",
    price: 6800,
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
      "https://images.unsplash.com/photo-1588444650733-2d6d625c0adc?w=600&q=80"
    ],
    category: "bracelets",
    inStock: true,
    tags: ["infinity", "romantic", "rose gold", "gift"]
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    await mongoose.connect(MONGODB_URI)
    console.log('📦 Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    // Insert new products
    const result = await Product.insertMany(seedData)
    console.log(`✅ Successfully inserted ${result.length} products`)

    console.log('🎉 Database seeding completed!')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

seedDatabase()