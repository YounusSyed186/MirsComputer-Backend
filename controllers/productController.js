import Product from '../models/products.js';

const parseNumber = (val) => {
    if (typeof val === "string") return Number(val.replace(/,/g, ""));
    return Number(val);
};

export const createProduct = async (req, res) => {
    try {
        const {
            name, category, brand, model,
            price, wholesalePrice, originalPrice, discount,
            rating, reviews, stock, minStock, status,
            description, specifications, features,
            warrantyTime, deliveryTime,
            isNewProduct, isFeatured, isRefurbished
        } = req.body;


        if (!name || !category) {
            return res.status(400).json({ success: false, message: "Name and category are required." });
        }

        const imageUrls = req.files?.map(file => file.path) || [];

        const product = new Product({
            name,
            category,
            brand,
            model,
            price: parseNumber(price),
            wholesalePrice: parseNumber(wholesalePrice),
            originalPrice: parseNumber(originalPrice),
            discount: parseNumber(discount),
            rating: parseNumber(rating),
            reviews: parseNumber(reviews),
            stock: parseNumber(stock),
            minStock: parseNumber(minStock),
            status,
            description,
            specifications,
            features,
            warrantyTime,
            deliveryTime,
            isNewProduct: isNewProduct === 'true',
            isFeatured: isFeatured === 'true',
            isRefurbished: isRefurbished === 'true',
            images: imageUrls,
        });

        await product.save();

        res.status(201).json({ success: true, message: 'Product created', product });
    } catch (error) {
        console.error('Product Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const { search, category, status, minStock } = req.query;

        // Build filter object
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } }
            ];
        }
        if (category && category !== 'all') filter.category = category;
        if (status && status !== 'all') filter.status = status;
        if (minStock) filter.stock = { $lte: minStock };

        const products = await Product.find(filter).sort({ createdAt: -1 });

        // Transform products to include full image URLs
        const productsWithImageUrls = products.map(product => {
            // If images are stored as relative paths, convert to full URLs
            const images = product.images.map(image => {
                // Check if image already has full URL (e.g., from cloud storage)
                if (image.startsWith('http')) {
                    return image;
                }
                // For locally stored images
                return `${req.protocol}://${req.get('host')}/uploads/${image}`;
            });

            return {
                ...product.toObject(),
                images
            };
        });
        // console.log('Products with image URLs:', productsWithImageUrls);

        res.status(200).json({
            success: true,
            count: productsWithImageUrls.length,
            data: productsWithImageUrls
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting product with ID: ${id}`);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Optional: Delete images from local storage
    product.images.forEach(image => {
      if (!image.startsWith('http')) {
        const filePath = path.join(process.cwd(), 'uploads', image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await product.deleteOne();
    console.log(`Product with ID ${id} deleted successfully`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message,
    });
  }
};