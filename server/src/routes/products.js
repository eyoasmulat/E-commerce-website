import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products';
    let params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY name ASC';
    
    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT DISTINCT category FROM products ORDER BY category ASC'
    );
    const categories = result.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE category = ? ORDER BY name ASC',
      [req.params.category]
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, stock, category } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, imageUrl, stock || 0, category]
    );
    
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(product[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, imageUrl, stock, category } = req.body;
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ?, category = ? WHERE id = ?',
      [name, description, price, imageUrl, stock, category, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(product[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 