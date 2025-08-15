import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)

    // Build query
    let query: any = {}
    
    if (q) {
      query.$text = { $search: q }
    }
    
    if (category) {
      query.category = category
    }

    // Build sort
    let sortOption: any = {}
    switch (sort) {
      case 'price_asc':
        sortOption.price = 1
        break
      case 'price_desc':
        sortOption.price = -1
        break
      case 'newest':
      default:
        sortOption.createdAt = -1
        break
    }

    // Get products with pagination
    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}