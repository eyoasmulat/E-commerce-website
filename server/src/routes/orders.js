import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create order (checkout)
router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order items' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    await connection.beginTransaction();

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, ?, NOW())',
      [userId, totalAmount, 'pending']
    );
    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      // Check if product exists
      const [products] = await connection.query(
        'SELECT * FROM products WHERE id = ?',
        [item.id]
      );

      if (products.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          message: `Product ${item.name || item.id} is not available`
        });
      }

      const product = products[0];

      // Add order item
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );

      // If stock tracking is implemented, update it
      if (product.stock !== undefined) {
        if (product.stock < item.quantity) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({ 
            message: `Product ${item.name || item.id} is out of stock. Available: ${product.stock}`
          });
        }

        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.id]
        );
      }
    }

    await connection.commit();
    
    // Get the complete order details
    const [order] = await connection.query(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [orderId]
    );

    const [orderItems] = await connection.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.status(201).json({
      ...order[0],
      items: orderItems
    });

  } catch (error) {
    console.error('Order creation error:', error);
    await connection.rollback();
    res.status(500).json({ 
      message: 'Failed to create order. Please try again later.' 
    });
  } finally {
    connection.release();
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.image_url 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
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