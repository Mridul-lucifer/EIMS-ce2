
// controllers/TeacherController.js
const teacherFunctions = require('../models/teacherFunctions');

/**
 * Teacher Controller to handle all teacher-related routes
 */
class TeacherController {
  /**
   * Create a new teacher record
   * @param {Object} req - Request object with teacher data in body
   * @param {Object} res - Response object
   */
  async createTeacher(req, res) {
    try {
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
      } = req.body;

      // Basic validation
      if (!fullName || !email || !employeeId || !mobileNumber || !subjects) {
        return res.status(400).json({
          success: false,
          msg: 'Please provide all required fields'
        });
      }

      // Check if teacher with same employee ID already exists
      const existingTeacher = await teacherFunctions.getTeacherByEmployeeId(employeeId);
      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          msg: 'Teacher with this employee ID already exists'
        });
      }

      // Check if email is already registered
      const emailExists = await teacherFunctions.getTeacherByEmail(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          msg: 'Email is already registered with another teacher'
        });
      }

      // Create new teacher
      const newTeacher = await teacherFunctions.createTeacher({
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
      });

      res.status(201).json({
        success: true,
        msg: 'Teacher registered successfully',
        data: newTeacher
      });
    } catch (error) {
      console.error('Error creating teacher:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while registering teacher',
        error: error.message
      });
    }
  }

  /**
   * Get all teachers with optional filtering
   * @param {Object} req - Request object with optional query parameters
   * @param {Object} res - Response object
   */
  async getAllTeachers(req, res) {
    try {
      // Extract any filter parameters from query
      const { subject, designation, search } = req.query;
      const filters = {};
      
      if (subject) filters.subject = subject;
      if (designation) filters.designation = designation;

      const teachers = await teacherFunctions.getAllTeachers(filters, search);
      
      res.status(200).json({
        success: true,
        count: teachers.length,
        data: teachers
      });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching teachers',
        error: error.message
      });
    }
  }

  /**
   * Get a single teacher by ID
   * @param {Object} req - Request object with teacher ID in params
   * @param {Object} res - Response object
   */
  async getTeacherById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await teacherFunctions.getTeacherById(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          msg: 'Teacher not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: teacher
      });
    } catch (error) {
      console.error('Error fetching teacher:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching teacher',
        error: error.message
      });
    }
  }

  /**
   * Update an existing teacher record
   * @param {Object} req - Request object with teacher ID in params and updated data in body
   * @param {Object} res - Response object
   */
  async updateTeacher(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Verify teacher exists
      const teacher = await teacherFunctions.getTeacherById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          msg: 'Teacher not found'
        });
      }
      
      // If email is being updated, check if it conflicts with another teacher
      if (updateData.email && updateData.email !== teacher.email) {
        const emailExists = await teacherFunctions.getTeacherByEmail(updateData.email);
        if (emailExists && emailExists.id !== parseInt(id)) {
          return res.status(409).json({
            success: false,
            msg: 'Email is already registered with another teacher'
          });
        }
      }
      
      // If employee ID is being updated, check if it conflicts
      if (updateData.employeeId && updateData.employeeId !== teacher.employeeId) {
        const employeeExists = await teacherFunctions.getTeacherByEmployeeId(updateData.employeeId);
        if (employeeExists && employeeExists.id !== parseInt(id)) {
          return res.status(409).json({
            success: false,
            msg: 'Employee ID is already assigned to another teacher'
          });
        }
      }
      
      // Update teacher
      const updatedTeacher = await teacherFunctions.updateTeacher(id, updateData);
      
      res.status(200).json({
        success: true,
        msg: 'Teacher information updated successfully',
        data: updatedTeacher
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while updating teacher',
        error: error.message
      });
    }
  }

  /**
   * Delete a teacher record
   * @param {Object} req - Request object with teacher ID in params
   * @param {Object} res - Response object
   */
  async deleteTeacher(req, res) {
    try {
      const { id } = req.params;
      
      // Verify teacher exists
      const teacher = await teacherFunctions.getTeacherById(id);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          msg: 'Teacher not found'
        });
      }
      
      // Delete teacher
      await teacherFunctions.deleteTeacher(id);
      
      res.status(200).json({
        success: true,
        msg: 'Teacher record deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while deleting teacher',
        error: error.message
      });
    }
  }
}

// Export as singleton
module.exports = new TeacherController();
