const studentFunctions = require('../models/studentFunctions');

/**
 * Student Controller to handle all student-related routes
 */
class StudentController {
  /**
   * Create a new student record
   * @param {Object} req - Request object with student data in body
   * @param {Object} res - Response object
   */
  async createStudent(req, res) {
    try {
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
      } = req.body;

      // Basic validation
      if (!fullName || !email || !admissionNumber || !standard || !mobileNumber) {
        return res.status(400).json({
          success: false,
          msg: 'Please provide all required fields'
        });
      }

      // Check if student with same admission number already exists
      const existingStudent = await studentFunctions.getStudentByAdmissionNumber(admissionNumber);
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          msg: 'Student with this admission number already exists'
        });
      }

      // Check if email is already registered
      const emailExists = await studentFunctions.getStudentByEmail(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          msg: 'Email is already registered with another student'
        });
      }

      // Create new student
      const newStudent = await studentFunctions.createStudent({
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
      });

      res.status(201).json({
        success: true,
        msg: 'Student registered successfully',
        data: newStudent
      });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while registering student',
        error: error.message
      });
    }
  }

  /**
   * Get all students with optional filtering
   * @param {Object} req - Request object with optional query parameters
   * @param {Object} res - Response object
   */
  async getAllStudents(req, res) {
    try {
      // Extract any filter parameters from query
      const { standard, section, search } = req.query;
      const filters = {};
      
      if (standard) filters.standard = standard;
      if (section) filters.section = section;

      const students = await studentFunctions.getAllStudents(filters, search);
      
      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching students',
        error: error.message
      });
    }
  }

  /**
   * Get a single student by ID
   * @param {Object} req - Request object with student ID in params
   * @param {Object} res - Response object
   */
  async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await studentFunctions.getStudentById(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          msg: 'Student not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching student',
        error: error.message
      });
    }
  }

  /**
   * Update an existing student record
   * @param {Object} req - Request object with student ID in params and updated data in body
   * @param {Object} res - Response object
   */
  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Verify student exists
      const student = await studentFunctions.getStudentById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          msg: 'Student not found'
        });
      }
      
      // If email is being updated, check if it conflicts with another student
      if (updateData.email && updateData.email !== student.email) {
        const emailExists = await studentFunctions.getStudentByEmail(updateData.email);
        if (emailExists && emailExists.id !== parseInt(id)) {
          return res.status(409).json({
            success: false,
            msg: 'Email is already registered with another student'
          });
        }
      }
      
      // If admission number is being updated, check if it conflicts
      if (updateData.admissionNumber && updateData.admissionNumber !== student.admissionNumber) {
        const admissionExists = await studentFunctions.getStudentByAdmissionNumber(updateData.admissionNumber);
        if (admissionExists && admissionExists.id !== parseInt(id)) {
          return res.status(409).json({
            success: false,
            msg: 'Admission number is already assigned to another student'
          });
        }
      }
      
      // Update student
      const updatedStudent = await studentFunctions.updateStudent(id, updateData);
      
      res.status(200).json({
        success: true,
        msg: 'Student information updated successfully',
        data: updatedStudent
      });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while updating student',
        error: error.message
      });
    }
  }

  /**
   * Delete a student record
   * @param {Object} req - Request object with student ID in params
   * @param {Object} res - Response object
   */
  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      
      // Verify student exists
      const student = await studentFunctions.getStudentById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          msg: 'Student not found'
        });
      }
      
      // Delete student
      await studentFunctions.deleteStudent(id);
      
      res.status(200).json({
        success: true,
        msg: 'Student record deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while deleting student',
        error: error.message
      });
    }
  }
}

// Export as singleton
module.exports = new StudentController();

