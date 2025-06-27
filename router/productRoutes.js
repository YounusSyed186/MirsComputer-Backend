// routes/productRoutes.js
import express from 'express';
import { createProduct, deleteProduct, getAllProducts } from '../controllers/productController.js';
import { uploadProductImages } from '../middleware/multer.js';

const router1 = express.Router();

router1.post('/upload', uploadProductImages, createProduct);
router1.get("/getlist", getAllProducts)
router1.delete("/deleteProduct/:id", deleteProduct);

export default router1;
