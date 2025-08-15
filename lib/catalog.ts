// lib/catalog.ts
export type Category = 'necklaces' | 'earrings' | 'rings' | 'bracelets'

export type Product = {
  id: string
  name: string
  category: Category | string
  price: number
  image: string
  badge?: 'New' | 'Limited' | 'Bestseller'
}

export const PRODUCTS: Product[] = [
  // ---- NECKLACES ----
  {
    id: 'n1',
    name: 'Celeste Étoile Necklace',
    category: 'necklaces',
    price: 1699,
    image:'/images/neck1.jpg',
    badge: 'Bestseller',
  },
  {
    id: 'n2',
    name: 'Aurora Tennis Necklace',
    category: 'necklaces',
    price: 2990,
    image:'/images/neck2.jpg',
  },
  {
    id: 'n3',
    name: 'Lumière Pearl Collar',
    category: 'necklaces',
    price: 2140,
    image:'/images/neck3.jpg',
    badge: 'Limited',
  },
  {
    id: 'n4',
    name: 'Seraphine Halo Pendant',
    category: 'necklaces',
    price: 1290,
    image:'/images/neck4.jpg',
  },

  // ---- EARRINGS ----
  {
    id: 'e1',
    name: 'Opaline Drop Earrings',
    category: 'earrings',
    price: 840,
    image:'/images/earring1.jpg',
    badge: 'New',
  },
  {
    id: 'e2',
    name: 'Solstice Diamond Hoops',
    category: 'earrings',
    price: 1460,
    image:'/images/earring2.jpg',
  },
  {
    id: 'e3',
    name: 'Éclat Pearl Studs',
    category: 'earrings',
    price: 690,
    image:'/images/earring3.jpg',
  },

  // ---- RINGS ----
  {
    id: 'r1',
    name: 'Ethereal Halo Ring',
    category: 'rings',
    price: 1890,
    image:'/images/ring1.jpg',
    badge: 'Bestseller',
  },
  {
    id: 'r2',
    name: 'Sapphire Enchant Ring',
    category: 'rings',
    price: 2350,
    image:'/images/ring2.jpg',
  },
  {
    id: 'r3',
    name: 'Nocturne Pavé Band',
    category: 'rings',
    price: 980,
    image:'/images/ring3.jpg',
    badge: 'Limited',
  },

  // ---- BRACELETS ----
  {
    id: 'b1',
    name: 'Aurora Line Bracelet',
    category: 'bracelets',
    price: 1640,
    image:'/images/brace1.jpg',
  },
  {
    id: 'b2',
    name: 'Gilded Curb Chain',
    category: 'bracelets',
    price: 1120,
    image:'/images/brace2.jpg',
    badge: 'New',
  },
  {
    id: 'b3',
    name: 'Étoile Tennis Bracelet',
    category: 'bracelets',
    price: 2490,
    image:'/images/brace3.jpg',
  },
]
