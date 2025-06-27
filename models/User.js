import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    isBusiness: { type: Boolean, default: false },
    companyName: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    password: { type: String, required: true },
    BusinessType: { type: String },
    agreeToTerms: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
