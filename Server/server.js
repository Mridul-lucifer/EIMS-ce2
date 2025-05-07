
// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const { adminLogin} = require('./commands');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database tables function
async function initializeTables() {
  try {
    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        admission_number VARCHAR(50) NOT NULL UNIQUE,
        standard VARCHAR(10) NOT NULL,
        section VARCHAR(10),
        date_of_birth DATE,
        mobile_number VARCHAR(15) NOT NULL,
        address TEXT,
        parent_name VARCHAR(255),
        blood_group VARCHAR(5),
        aadhar_number VARCHAR(12),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);
    
    // Create teachers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        employee_id VARCHAR(50) NOT NULL UNIQUE,
        qualification VARCHAR(100),
        subjects TEXT NOT NULL,
        designation VARCHAR(100),
        date_of_joining DATE,
        date_of_birth DATE,
        mobile_number VARCHAR(15) NOT NULL,
        address TEXT,
        aadhar_number VARCHAR(12),
        gender VARCHAR(10),
        experience VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);
    
    // Create classes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        standard VARCHAR(10) NOT NULL,
        section VARCHAR(10) NOT NULL,
        academic_year VARCHAR(20) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP,
        UNIQUE(standard, section, academic_year)
      )
    `);
    
    // Create class_subjects junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS class_subjects (
        id SERIAL PRIMARY KEY,
        class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        subject_id VARCHAR(50) NOT NULL, 
        teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
        UNIQUE(class_id, subject_id)
      )
    `);
    
    // Create class_students junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS class_students (
        id SERIAL PRIMARY KEY,
        class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE(class_id, student_id)
      )
    `);
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Routes

app.use('/student', require('./routes/StudentRoutes'));
app.use('/teacher', require('./routes/TeacherRoutes'));
app.use('/class', require('./routes/ClassRoutes'));

// Root route
app.post('/login' , adminLogin);
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the School Management System API',
    status: 'Server is running',
    version: '1.0.0'
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
 
// Initialize tables and then start the server
initializeTables()
  .then(() => {
    app.listen(PORT,() => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });