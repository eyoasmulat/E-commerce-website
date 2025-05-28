import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { userId, items, totalAmount } = req.body;

    await connection.beginTransaction();

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [userId, totalAmount]
    );
    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      // Check if product exists and has enough stock
      const [products] = await connection.query(
        'SELECT * FROM products WHERE id = ? AND stock >= ?',
        [item.productId, item.quantity]
      );

      if (products.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          message: `Product ${item.productId} not found or insufficient stock`
        });
      }

      // Add order item
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, products[0].price]
      );

      // Update product stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    await connection.commit();

    // Get complete order details
    const [orderDetails] = await pool.query(
      `SELECT o.*, u.name as user_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'productId', p.id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id`,
      [orderId]
    );

    res.status(201).json(orderDetails[0]);
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'productId', p.id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
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
      `SELECT o.*, u.name as user_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'productId', p.id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id`,
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

    const [orders] = await pool.query(
      `SELECT o.*, u.name as user_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'productId', p.id,
            'name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id`,
      [req.params.id]
    );

    res.json(orders[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 