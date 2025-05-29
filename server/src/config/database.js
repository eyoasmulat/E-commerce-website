import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'schema',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const connectDB = async () => {
  try {
    // Create database if it doesn't exist
    const tempPool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    await tempPool.query('CREATE DATABASE IF NOT EXISTS ecommerce_db');
    await tempPool.end();

    // Test the connection
    const connection = await pool.getConnection();
    console.log('Database connected successfully.');

    // Create tables
    await initializeTables();
    
    connection.release();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

async function initializeTables() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Drop existing tables in correct order
    const dropQueries = [
      'DROP TABLE IF EXISTS cart_items',
      'DROP TABLE IF EXISTS order_items',
      'DROP TABLE IF EXISTS orders',
      'DROP TABLE IF EXISTS products',
      'DROP TABLE IF EXISTS users'
    ];

    for (const query of dropQueries) {
      await connection.query(query);
    }

    // Create tables
    const createQueries = [
      `CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        stock INT NOT NULL DEFAULT 0,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      
      `CREATE TABLE order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`,

      `CREATE TABLE cart_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`
    ];

    for (const query of createQueries) {
      await connection.query(query);
    }

    await connection.commit();
    console.log('Database tables initialized successfully.');
  } catch (error) {
    await connection.rollback();
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Initialize tables when this file is run directly
if (import.meta.url === new URL(import.meta.url).href) {
  try {
    await initializeTables();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

export default pool; 