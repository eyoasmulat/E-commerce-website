import pool from '../config/database.js';

const products = [
  // Electronics Category
  {
    name: 'iPhone 14 Pro',
    description: 'Latest iPhone with dynamic island and amazing camera system',
    price: 999.99,
    image_url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
    category: 'Electronics',
    stock: 50
  },
  {
    name: 'MacBook Pro M2',
    description: 'Powerful laptop with M2 chip for professionals',
    price: 1499.99,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    category: 'Electronics',
    stock: 30
  },
  {
    name: 'Sony WH-1000XM4',
    description: 'Premium noise-cancelling headphones',
    price: 349.99,
    image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    category: 'Electronics',
    stock: 75
  },

  // Fashion Category
  {
    name: 'Classic Leather Jacket',
    description: 'Timeless black leather jacket for all seasons',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'Fashion',
    stock: 40
  },
  {
    name: 'Designer Sunglasses',
    description: 'UV protected stylish sunglasses',
    price: 159.99,
    image_url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80',
    category: 'Fashion',
    stock: 100
  },
  {
    name: 'Premium Watch',
    description: 'Luxury stainless steel watch',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    category: 'Fashion',
    stock: 25
  },

  // Sports Category
  {
    name: 'Nike Air Zoom',
    description: 'Professional running shoes for athletes',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: 'Sports',
    stock: 80
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick eco-friendly yoga mat',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80',
    category: 'Sports',
    stock: 150
  },
  {
    name: 'Fitness Tracker',
    description: 'Advanced fitness and health monitoring device',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&q=80',
    category: 'Sports',
    stock: 60
  },

  // Home & Living Category
  {
    name: 'Smart Coffee Maker',
    description: 'WiFi-enabled programmable coffee maker',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1517914309068-f7b9bee7a9ff?w=800&q=80',
    category: 'Home & Living',
    stock: 45
  },
  {
    name: 'Modern Table Lamp',
    description: 'Contemporary LED table lamp with adjustable brightness',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    category: 'Home & Living',
    stock: 70
  },
  {
    name: 'Air Purifier',
    description: 'HEPA air purifier for large rooms',
    price: 249.99,
    image_url: 'https://images.unsplash.com/photo-1626436629565-8a147b9685e6?w=800&q=80',
    category: 'Home & Living',
    stock: 35
  },

  // Books Category
  {
    name: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
    category: 'Books',
    stock: 200
  },
  {
    name: 'Business Strategy Guide',
    description: 'Best-selling book on business strategy',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80',
    category: 'Books',
    stock: 150
  },
  {
    name: 'Healthy Living Cookbook',
    description: 'Collection of healthy recipes and lifestyle tips',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    category: 'Books',
    stock: 100
  }
];

const seedProducts = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete existing cart items and orders first
    await connection.query('DELETE FROM order_items');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM cart_items');
    
    // Now we can safely delete and re-insert products
    await connection.query('DELETE FROM products');

    // Insert new products
    for (const product of products) {
      await connection.query(
        'INSERT INTO products (name, description, price, image_url, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.image_url, product.category, product.stock]
      );
    }

    await connection.commit();
    console.log('Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    await connection.rollback();
    console.error('Error seeding products:', error);
    process.exit(1);
  } finally {
    connection.release();
  }
};

seedProducts(); 