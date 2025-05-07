// models/teacherFunctions.js
const pool = require('../db');

/**
 * Database functions for teacher operations
 */
class TeacherFunctions {
  /**
   * Create a new teacher in the database
   * @param {Object} teacherData - Teacher information
   * @returns {Object} Newly created teacher record
   */
  async createTeacher(teacherData) {
    const {
      fullName,
      email,
      employeeId,
      qualification,
      subjects,
      designation,
      dateOfJoining,
      dateOfBirth,
      mobileNumber,
      address,
      aadharNumber,
      gender,
      experience
    } = teacherData;

    const query = `
      INSERT INTO teachers (
        full_name, 
        email, 
        employee_id, 
        qualification, 
        subjects, 
        designation, 
        date_of_joining,
        date_of_birth, 
        mobile_number, 
        address, 
        aadhar_number,
        gender,
        experience,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *
    `;

    const values = [
      fullName,
      email,
      employeeId,
      qualification || null,
      Array.isArray(subjects) ? subjects.join(',') : subjects,
      designation || null,
      dateOfJoining || null,
      dateOfBirth || null,
      mobileNumber,
      address || null,
      aadharNumber || null,
      gender || null,
      experience || null
    ];

    const result = await pool.query(query, values);
    return this.formatTeacherRecord(result.rows[0]);
  }

  /**
   * Get all teachers with optional filtering
   * @param {Object} filters - Optional filters like subject, designation
   * @param {String} search - Optional search term for name
   * @returns {Array} List of teacher records
   */
  async getAllTeachers(filters = {}, search = '') {
    let query = `SELECT * FROM teachers WHERE 1=1`;
    const values = [];
    let paramCount = 1;

    // Add filters if provided
    if (filters.subject) {
      query += ` AND subjects LIKE $${paramCount}`;
      values.push(`%${filters.subject}%`);
      paramCount++;
    }

    if (filters.designation) {
      query += ` AND designation = $${paramCount}`;
      values.push(filters.designation);
      paramCount++;
    }

    // Add search functionality
    if (search) {
      query += ` AND (
        full_name ILIKE $${paramCount} OR 
        employee_id ILIKE $${paramCount} OR 
        email ILIKE $${paramCount} OR
        qualification ILIKE $${paramCount}
      )`;
      values.push(`%${search}%`);
      paramCount++;
    }

    // Order by newest first
    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map(row => this.formatTeacherRecord(row));
  }

  /**
   * Get a single teacher by ID
   * @param {Number} id - Teacher ID
   * @returns {Object} Teacher record
   */
  async getTeacherById(id) {
    const query = `SELECT * FROM teachers WHERE id = $1`;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatTeacherRecord(result.rows[0]);
  }

  /**
   * Get a teacher by employee ID
   * @param {String} employeeId - Teacher employee ID
   * @returns {Object} Teacher record
   */
  async getTeacherByEmployeeId(employeeId) {
    const query = `SELECT * FROM teachers WHERE employee_id = $1`;
    const result = await pool.query(query, [employeeId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatTeacherRecord(result.rows[0]);
  }

  /**
   * Get a teacher by email
   * @param {String} email - Teacher email
   * @returns {Object} Teacher record
   */
  async getTeacherByEmail(email) {
    const query = `SELECT * FROM teachers WHERE email = $1`;
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatTeacherRecord(result.rows[0]);
  }

  /**
   * Update a teacher record
   * @param {Number} id - Teacher ID
   * @param {Object} updateData - Updated teacher information
   * @returns {Object} Updated teacher record
   */
  async updateTeacher(id, updateData) {
    // Create dynamic query based on provided fields
    const allowedFields = [
      'full_name', 
      'email', 
      'employee_id', 
      'qualification', 
      'subjects', 
      'designation', 
      'date_of_joining',
      'date_of_birth', 
      'mobile_number', 
      'address', 
      'aadhar_number',
      'gender',
      'experience'
    ];
    
    const setClause = [];
    const values = [];
    let paramCount = 1;
    
    // Map frontend camelCase to database snake_case
    const fieldMap = {
      fullName: 'full_name',
      email: 'email',
      employeeId: 'employee_id',
      qualification: 'qualification',
      subjects: 'subjects',
      designation: 'designation',
      dateOfJoining: 'date_of_joining',
      dateOfBirth: 'date_of_birth',
      mobileNumber: 'mobile_number',
      address: 'address',
      aadharNumber: 'aadhar_number',
      gender: 'gender',
      experience: 'experience'
    };
    
    // Build the SET clause and values array
    Object.keys(updateData).forEach(key => {
      const dbField = fieldMap[key];
      if (dbField && allowedFields.includes(dbField)) {
        // Handle special case for subjects array
        if (key === 'subjects' && Array.isArray(updateData[key])) {
          setClause.push(`${dbField} = $${paramCount}`);
          values.push(updateData[key].join(','));
        } else {
          setClause.push(`${dbField} = $${paramCount}`);
          values.push(updateData[key]);
        }
        paramCount++;
      }
    });
    
    // Add updated_at timestamp
    setClause.push(`updated_at = NOW()`);
    
    // Add ID to values array
    values.push(id);
    
    // Build final query
    const query = `
      UPDATE teachers 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return this.formatTeacherRecord(result.rows[0]);
  }

  /**
   * Delete a teacher record
   * @param {Number} id - Teacher ID
   * @returns {Boolean} Success status
   */
  async deleteTeacher(id) {
    const query = `DELETE FROM teachers WHERE id = $1`;
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Format a database record to camelCase for the frontend
   * @param {Object} dbRecord - Database record with snake_case fields
   * @returns {Object} Formatted record with camelCase fields
   */
  formatTeacherRecord(dbRecord) {
    return {
      id: dbRecord.id,
      fullName: dbRecord.full_name,
      email: dbRecord.email,
      employeeId: dbRecord.employee_id,
      qualification: dbRecord.qualification,
      subjects: dbRecord.subjects ? dbRecord.subjects.split(',') : [],
      designation: dbRecord.designation,
      dateOfJoining: dbRecord.date_of_joining ? new Date(dbRecord.date_of_joining).toISOString().split('T')[0] : null,
      dateOfBirth: dbRecord.date_of_birth ? new Date(dbRecord.date_of_birth).toISOString().split('T')[0] : null,
      mobileNumber: dbRecord.mobile_number,
      address: dbRecord.address,
      aadharNumber: dbRecord.aadhar_number,
      gender: dbRecord.gender,
      experience: dbRecord.experience,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    };
  }
}

module.exports = new TeacherFunctions();

// CREATE TEACHERS TABLE function for server.js
/**
 * Creates the teachers table if it doesn't exist
 * @param {Object} pool - PostgreSQL connection pool from db.js
 */
async function createTeachersTable(pool) {
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

