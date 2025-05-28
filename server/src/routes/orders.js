import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [userId, totalAmount]
      );
      const orderId = orderResult.insertId;

      // Create order items
      for (const item of items) {
        // Check if product exists
        const [products] = await connection.query(
          'SELECT * FROM products WHERE id = ?',
          [item.productId]
        );
        if (products.length === 0) {
          await connection.rollback();
          connection.release();
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }

        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, products[0].price]
        );
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      // Get full order details
      const [order] = await pool.query(
        `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name as product_name 
         FROM orders o 
         JOIN order_items oi ON o.id = oi.order_id 
         JOIN products p ON oi.product_id = p.id 
         WHERE o.id = ?`,
        [orderId]
      );

      res.status(201).json(order);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name as product_name 
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       JOIN products p ON oi.product_id = p.id 
       WHERE o.user_id = ?`,
      [req.params.userId]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name as product_name 
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       JOIN products p ON oi.product_id = p.id 
       WHERE o.id = ?`,
      [req.params.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(orders[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json(order[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 