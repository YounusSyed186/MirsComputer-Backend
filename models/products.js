import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },

    price: { type: Number, required: true },
    wholesalePrice: { type: Number },
    originalPrice: { type: Number },
    discount: { type: Number },
    rating: { type: Number },
    reviews: { type: Number },
    stock: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // e.g., 1 for active, 0 for inactive

    images: { type: [String] }, // Array of image URLs
    description: { type: String },
    specifications: { type: String },
    features: { type: String },

    isNewProduct: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isRefurbished: { type: Boolean, default: false },
    warrantyTime: { type: String },
    deliveryTime: { type: String },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
