import mongoose from 'mongoose'

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

ProductSchema.index({ name: 'text', shortDescription: 'text', description: 'text' })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)