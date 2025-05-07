// models/classFunctions.js
const pool = require('../db');

/**
 * Database functions for class operations
 */
class ClassFunctions {
  /**
   * Create a new class in the database with subjects and students
   * @param {Object} classData - Class information
   * @returns {Object} Newly created class record
   */
  async createClass(classData) {
    const client = await pool.connect();
    
    try {
      // Begin transaction
      await client.query('BEGIN');
      
      // 1. Insert the main class record
      const classInsertQuery = `
        INSERT INTO classes (
          name,
          standard,
          section,
          academic_year,
          created_at
        ) VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      
      const classValues = [
        classData.name,
        classData.standard,
        classData.section,
        classData.academicYear
      ];
      
      const classResult = await client.query(classInsertQuery, classValues);
      const newClass = classResult.rows[0];
      
      // 2. Insert class_subjects entries (subjects and assigned teachers)
      for (const subject of classData.subjects) {
        const subjectInsertQuery = `
          INSERT INTO class_subjects (
            class_id,
            subject_id,
            teacher_id
          ) VALUES ($1, $2, $3)
        `;
        
        await client.query(subjectInsertQuery, [
          newClass.id,
          subject.id,
          subject.teacherId
        ]);
      }
      
      // 3. Insert class_students entries
      for (const studentId of classData.students) {
        const studentInsertQuery = `
          INSERT INTO class_students (
            class_id,
            student_id
          ) VALUES ($1, $2)
        `;
        
        await client.query(studentInsertQuery, [
          newClass.id,
          studentId
        ]);
      }
      
      // Commit transaction
      await client.query('COMMIT');
      
      // Return the newly created class with subjects and students
      return this.getClassById(newClass.id);
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release client back to pool
      client.release();
    }
  }

  /**
   * Get all classes with optional filtering
   * @param {Object} filters - Optional filters like standard, section, academicYear
   * @returns {Array} List of class records
   */
  async getAllClasses(filters = {}) {
    let query = `
      SELECT c.*,
        COUNT(DISTINCT cs.student_id) AS student_count,
        COUNT(DISTINCT csub.subject_id) AS subject_count
      FROM classes c
      LEFT JOIN class_students cs ON c.id = cs.class_id
      LEFT JOIN class_subjects csub ON c.id = csub.class_id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;
    
    // Add filters if provided
    if (filters.standard) {
      query += ` AND c.standard = $${paramCount}`;
      values.push(filters.standard);
      paramCount++;
    }
    
    if (filters.section) {
      query += ` AND c.section = $${paramCount}`;
      values.push(filters.section);
      paramCount++;
    }
    
    if (filters.academicYear) {
      query += ` AND c.academic_year = $${paramCount}`;
      values.push(filters.academicYear);
      paramCount++;
    }
    
    // Group by to avoid duplicate rows due to the joins
    query += ` GROUP BY c.id ORDER BY c.standard, c.section`;
    
    const result = await pool.query(query, values);
    return result.rows.map(row => this.formatClassRecord(row));
  }

  /**
   * Get a single class by ID with subjects and students
   * @param {Number} id - Class ID
   * @returns {Object} Class record with subjects and students
   */
  async getClassById(id) {
    // Get the base class info
    const query = `
      SELECT c.*,
        COUNT(DISTINCT cs.student_id) AS student_count,
        COUNT(DISTINCT csub.subject_id) AS subject_count
      FROM classes c
      LEFT JOIN class_students cs ON c.id = cs.class_id
      LEFT JOIN class_subjects csub ON c.id = csub.class_id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const classData = this.formatClassRecord(result.rows[0]);
    
    // Get subjects with teacher info
    classData.subjects = await this.getClassSubjectsWithTeachers(id);
    
    // Get student IDs
    const studentIdsQuery = `
      SELECT student_id FROM class_students WHERE class_id = $1
    `;
    
    const studentIdsResult = await pool.query(studentIdsQuery, [id]);
    classData.studentIds = studentIdsResult.rows.map(row => row.student_id);
    
    return classData;
  }

  /**
   * Get a class by standard, section, and academic year
   * @param {String} standard - Class standard
   * @param {String} section - Class section
   * @param {String} academicYear - Academic year
   * @returns {Object} Class record
   */
  async getClassByDetails(standard, section, academicYear) {
    const query = `
      SELECT * FROM classes
      WHERE standard = $1 AND section = $2 AND academic_year = $3
    `;
    
    const result = await pool.query(query, [standard, section, academicYear]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.formatClassRecord(result.rows[0]);
  }

  /**
   * Get subjects for a class with teacher information
   * @param {Number} classId - Class ID
   * @returns {Array} Subjects with teacher information
   */
  async getClassSubjectsWithTeachers(classId) {
    const query = `
      SELECT cs.subject_id, cs.teacher_id, 
             t.full_name AS teacher_name, t.employee_id,
             t.email AS teacher_email
      FROM class_subjects cs
      JOIN teachers t ON cs.teacher_id = t.id
      WHERE cs.class_id = $1
    `;
    
    const result = await pool.query(query, [classId]);
    
    // Map to a more frontend-friendly format
    return result.rows.map(row => ({
      subjectId: row.subject_id,
      teacherId: row.teacher_id,
      teacherName: row.teacher_name,
      employeeId: row.employee_id,
      teacherEmail: row.teacher_email
    }));
  }

  /**
   * Get students enrolled in a class with detailed information
   * @param {Number} classId - Class ID
   * @returns {Array} Students with detailed information
   */
  async getClassStudents(classId) {
    const query = `
      SELECT s.*
      FROM students s
      JOIN class_students cs ON s.id = cs.student_id
      WHERE cs.class_id = $1
      ORDER BY s.full_name
    `;
    
    const result = await pool.query(query, [classId]);
    
    // Map to a frontend-friendly format using the student format function
    const studentFunctions = require('./studentFunctions');
    return result.rows.map(row => studentFunctions.formatStudentRecord(row));
  }

  /**
   * Update a class record
   * @param {Number} id - Class ID
   * @param {Object} updateData - Updated class information
   * @returns {Object} Updated class record
   */
  async updateClass(id, updateData) {
    const client = await pool.connect();
    
    try {
      // Begin transaction
      await client.query('BEGIN');
      
      // 1. Update the main class record if needed
      if (
        updateData.name || 
        updateData.standard || 
        updateData.section || 
        updateData.academicYear
      ) {
        const allowedFields = [
          'name', 
          'standard', 
          'section', 
          'academic_year'
        ];
        
        const setClause = [];
        const values = [];
        let paramCount = 1;
        
        // Map frontend camelCase to database snake_case
        const fieldMap = {
          name: 'name',
          standard: 'standard',
          section: 'section',
          academicYear: 'academic_year'
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
        
        // Only update if there are fields to update
        if (setClause.length > 0) {
          const query = `
            UPDATE classes 
            SET ${setClause.join(', ')} 
            WHERE id = $${paramCount}
          `;
          
          await client.query(query, values);
        }
      }
      
      // 2. Update subjects if provided
      if (updateData.subjects && Array.isArray(updateData.subjects)) {
        // First, remove all existing subject assignments
        await client.query('DELETE FROM class_subjects WHERE class_id = $1', [id]);
        
        // Then add the new ones
        for (const subject of updateData.subjects) {
          const subjectInsertQuery = `
            INSERT INTO class_subjects (
              class_id,
              subject_id,
              teacher_id
            ) VALUES ($1, $2, $3)
          `;
          
          await client.query(subjectInsertQuery, [
            id,
            subject.id,
            subject.teacherId
          ]);
        }
      }
      
      // 3. Update students if provided
      if (updateData.students && Array.isArray(updateData.students)) {
        // First, remove all existing student enrollments
        await client.query('DELETE FROM class_students WHERE class_id = $1', [id]);
        
        // Then add the new ones
        for (const studentId of updateData.students) {
          const studentInsertQuery = `
            INSERT INTO class_students (
              class_id,
              student_id
            ) VALUES ($1, $2)
          `;
          
          await client.query(studentInsertQuery, [id, studentId]);
        }
      }
      
      // Commit transaction
      await client.query('COMMIT');
      
      // Return the updated class
      return this.getClassById(id);
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release client back to pool
      client.release();
    }
  }

  /**
   * Delete a class and related records
   * @param {Number} id - Class ID
   * @returns {Boolean} Success status
   */
  async deleteClass(id) {
    const client = await pool.connect();
    
    try {
      // Begin transaction
      await client.query('BEGIN');
      
      // Delete related records first (foreign key relationships)
      await client.query('DELETE FROM class_subjects WHERE class_id = $1', [id]);
      await client.query('DELETE FROM class_students WHERE class_id = $1', [id]);
      
      // Then delete the main class record
      await client.query('DELETE FROM classes WHERE id = $1', [id]);
      
      // Commit transaction
      await client.query('COMMIT');
      
      return true;
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release client back to pool
      client.release();
    }
  }

  /**
   * Format a database record to camelCase for the frontend
   * @param {Object} dbRecord - Database record with snake_case fields
   * @returns {Object} Formatted record with camelCase fields
   */
  formatClassRecord(dbRecord) {
    return {
      id: dbRecord.id,
      name: dbRecord.name,
      standard: dbRecord.standard,
      section: dbRecord.section,
      academicYear: dbRecord.academic_year,
      studentCount: parseInt(dbRecord.student_count) || 0,
      subjectCount: parseInt(dbRecord.subject_count) || 0,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    };
  }
}

module.exports = new ClassFunctions();
