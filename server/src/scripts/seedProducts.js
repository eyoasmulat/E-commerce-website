import { connectDB } from '../../config/database.js';
import { sampleProducts } from '../data/sampleProducts.js';
import pool from '../../config/database.js';

async function seedProducts() {
  try {
    await connectDB();

    // Clear existing products
    await pool.query('DELETE FROM products');

    // Insert sample products
    for (const product of sampleProducts) {
      await pool.query(
        'INSERT INTO products (name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.image_url, product.stock, product.category]
      );
    }

    console.log('Sample products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts(); 