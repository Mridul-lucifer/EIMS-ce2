require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

const loginTable = process.env.loginTable;


const createTableIfNotExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${loginTable} (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        password VARCHAR(100) NOT NULL
      );
    `);
    console.log(`✅ Table '${loginTable}' checked/created`);
  } catch (err) {
    console.error("❌ Error creating table:", err.message);
  }
};


async function createStudentsTable() {
  try {
    // Create students table if it doesn't exist
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
    
    console.log('Students table created or already exists');
  } catch (error) {
    console.error('Error creating students table:', error);
    throw error;
  }
}

const adminLogin = async (req,res) =>{
  try{
    const { username, password } = req.body;
    if(username==process.env.adminUsername && password == process.env.adminPassword){
      res.status(200).json({
        msg : "Admin Login Successfull"
      })
    }else{
      return login(req,res);
    }
  }catch(e){
    console.error("❌ Login error:", e.message);
    res.status(500).json({ msg: "Server error during login" }); 
  }
}

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Check if username already exists
    const existingUser = await pool.query(
      `SELECT * FROM ${loginTable} WHERE username = $1`,
      [username]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({ msg: "Username already taken" });
    }

    // 3. Insert new user
    await pool.query(
      `INSERT INTO ${loginTable} (username, password) VALUES ($1, $2)`,
      [username, hashedPassword]
    );

    // 4. Success response
    res.status(201).json({ msg: "User created successfully" });

  } catch (e) {
    console.error("❌ Signup error:", e.message);
    res.status(500).json({ msg: "Error during signup" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = await pool.query(
      `SELECT * FROM ${loginTable} WHERE username = $1`,
      [username]
    );

    if (userQuery.rowCount === 0) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const user = userQuery.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    res.status(200).json({ msg: "Login successful" });
  } catch (e) {
    console.error("❌ Login error:", e.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};

  
// CREATE TEACHERS TABLE function for server.js
/**
 * Creates the teachers table if it doesn't exist
 * @param {Object} pool - PostgreSQL connection pool from db.js
 */
async function createTeachersTable() {
  try {
    // Create teachers table if it doesn't exist
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
    
    console.log('Teachers table created or already exists');
  } catch (error) {
    console.error('Error creating teachers table:', error);
    throw error;
  }
}

// Update your index.js to include the teacher routes
// app.use('/teacher', require('./routes/TeacherRoutes'));

module.exports = {
  createTableIfNotExists,
  adminLogin ,
  signup,
  login,
  createStudentsTable,
  createTeachersTable
};
