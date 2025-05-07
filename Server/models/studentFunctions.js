const pool = require('../db');

/**
 * Database functions for student operations
 */
class StudentFunctions {
  /**
   * Create a new student in the database
   * @param {Object} studentData - Student information
   * @returns {Object} Newly created student record
   */
  async createStudent(studentData) {
    const {
      fullName,
      email,
      admissionNumber,
      standard,
      section,
      dateOfBirth,
      mobileNumber,
      address,
      parentName,
      bloodGroup,
      aadharNumber
    } = studentData;

    const query = `
      INSERT INTO students (
        full_name, 
        email, 
        admission_number, 
        standard, 
        section, 
        date_of_birth, 
        mobile_number, 
        address, 
        parent_name, 
        blood_group, 
        aadhar_number,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `;

    const values = [
      fullName,
      email,
      admissionNumber,
      standard,
      section || null,
      dateOfBirth || null,
      mobileNumber,
      address || null,
      parentName || null,
      bloodGroup || null,
      aadharNumber || null
    ];

    const result = await pool.query(query, values);
    return this.formatStudentRecord(result.rows[0]);
  }

  /**
   * Get all students with optional filtering
   * @param {Object} filters - Optional filters like standard, section
   * @param {String} search - Optional search term for name
   * @returns {Array} List of student records
   */
  async getAllStudents(filters = {}, search = '') {
    let query = `SELECT * FROM students WHERE 1=1`;
    const values = [];
    let paramCount = 1;

    // Add filters if provided
    if (filters.standard) {
      query += ` AND standard = $${paramCount}`;
      values.push(filters.standard);
      paramCount++;
    }

    if (filters.section) {
      query += ` AND section = $${paramCount}`;
      values.push(filters.section);
      paramCount++;
    }

    // Add search functionality
    if (search) {
      query += ` AND (
        full_name ILIKE $${paramCount} OR 
        admission_number ILIKE $${paramCount} OR 
        email ILIKE $${paramCount}
      )`;
      values.push(`%${search}%`);
      paramCount++;
    }

    // Order by newest first
    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map(row => this.formatStudentRecord(row));
  }

  /**
   * Get a single student by ID
   * @param {Number} id - Student ID
   * @returns {Object} Student record
   */
  async getStudentById(id) {
    const query = `SELECT * FROM students WHERE id = $1`;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatStudentRecord(result.rows[0]);
  }

  /**
   * Get a student by admission number
   * @param {String} admissionNumber - Student admission number
   * @returns {Object} Student record
   */
  async getStudentByAdmissionNumber(admissionNumber) {
    const query1 = `SELECT * FROM students WHERE admission_number = $1`;
    const result = await pool.query(query1, [admissionNumber]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatStudentRecord(result.rows[0]);
  }

  /**
   * Get a student by email
   * @param {String} email - Student email
   * @returns {Object} Student record
   */
  async getStudentByEmail(email) {
    const query = `SELECT * FROM students WHERE email = $1`;
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatStudentRecord(result.rows[0]);
  }

  /**
   * Update a student record
   * @param {Number} id - Student ID
   * @param {Object} updateData - Updated student information
   * @returns {Object} Updated student record
   */
  async updateStudent(id, updateData) {
    // Create dynamic query based on provided fields
    const allowedFields = [
      'full_name', 
      'email', 
      'admission_number', 
      'standard', 
      'section', 
      'date_of_birth', 
      'mobile_number', 
      'address', 
      'parent_name', 
      'blood_group', 
      'aadhar_number'
    ];
    
    const setClause = [];
    const values = [];
    let paramCount = 1;
    
    // Map frontend camelCase to database snake_case
    const fieldMap = {
      fullName: 'full_name',
      email: 'email',
      admissionNumber: 'admission_number',
      standard: 'standard',
      section: 'section',
      dateOfBirth: 'date_of_birth',
      mobileNumber: 'mobile_number',
      address: 'address',
      parentName: 'parent_name',
      bloodGroup: 'blood_group',
      aadharNumber: 'aadhar_number'
    };
    
    // Build the SET clause and values array
    Object.keys(updateData).forEach(key => {
      const dbField = fieldMap[key];
      if (dbField && allowedFields.includes(dbField)) {
        setClause.push(`${dbField} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });
    
    // Add updated_at timestamp
    setClause.push(`updated_at = NOW()`);
    
    // Add ID to values array
    values.push(id);
    
    // Build final query
    const query = `
      UPDATE students 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return this.formatStudentRecord(result.rows[0]);
  }

  /**
   * Delete a student record
   * @param {Number} id - Student ID
   * @returns {Boolean} Success status
   */
  async deleteStudent(id) {
    const query = `DELETE FROM students WHERE id = $1`;
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Format a database record to camelCase for the frontend
   * @param {Object} dbRecord - Database record with snake_case fields
   * @returns {Object} Formatted record with camelCase fields
   */
  formatStudentRecord(dbRecord) {
    return {
      id: dbRecord.id,
      fullName: dbRecord.full_name,
      email: dbRecord.email,
      admissionNumber: dbRecord.admission_number,
      standard: dbRecord.standard,
      section: dbRecord.section,
      dateOfBirth: dbRecord.date_of_birth ? new Date(dbRecord.date_of_birth).toISOString().split('T')[0] : null,
      mobileNumber: dbRecord.mobile_number,
      address: dbRecord.address,
      parentName: dbRecord.parent_name,
      bloodGroup: dbRecord.blood_group,
      aadharNumber: dbRecord.aadhar_number,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    };
  }
}

module.exports = new StudentFunctions();

// PostgreSQL schema
/*
CREATE TABLE students (
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
);

-- Index for faster lookups
CREATE INDEX idx_students_admission ON students(admission_number);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_standard ON students(standard);
*/ 