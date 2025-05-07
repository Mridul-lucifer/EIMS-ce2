// controllers/ClassController.js
const classFunctions = require('../models/classFunctions');
const teacherFunctions = require('../models/teacherFunctions');
const studentFunctions = require('../models/studentFunctions');

/**
 * Class Controller to handle all class-related routes
 */
class ClassController {
  /**
   * Create a new class with subjects, teachers and students
   * @param {Object} req - Request object with class data in body
   * @param {Object} res - Response object
   */
  async createClass(req, res) {
    try {
      const {
        name,
        standard,
        section,
        academicYear,
        subjects,
        students
      } = req.body;

      // Basic validation
      if (!name || !standard || !section) {
        return res.status(400).json({
          success: false,
          msg: 'Please provide all required fields: name, standard, and section'
        });
      }

      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({
          success: false,
          msg: 'Please provide at least one subject with an assigned teacher'
        });
      }

      if (!students || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({
          success: false,
          msg: 'Please enroll at least one student in the class'
        });
      }

      // Check if class with same details already exists
      const existingClass = await classFunctions.getClassByDetails(standard, section, academicYear);
      if (existingClass) {
        return res.status(409).json({
          success: false,
          msg: `Class ${standard}-${section} already exists for academic year ${academicYear}`
        });
      }

      // Validate that all teachers exist
      for (const subject of subjects) {
        if (!subject.teacherId) {
          return res.status(400).json({
            success: false,
            msg: `Teacher not assigned for subject ${subject.id}`
          });
        }

        const teacher = await teacherFunctions.getTeacherById(subject.teacherId);
        if (!teacher) {
          return res.status(404).json({
            success: false,
            msg: `Teacher with ID ${subject.teacherId} not found`
          });
        }
      }

      // Validate that all students exist
      for (const studentId of students) {
        const student = await studentFunctions.getStudentById(studentId);
        if (!student) {
          return res.status(404).json({
            success: false,
            msg: `Student with ID ${studentId} not found`
          });
        }
      }

      // Create new class
      const newClass = await classFunctions.createClass({
        name,
        standard,
        section,
        academicYear,
        subjects,
        students
      });

      res.status(201).json({
        success: true,
        msg: 'Class created successfully',
        data: newClass
      });
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while creating class',
        error: error.message
      });
    }
  }

  /**
   * Get all classes with optional filtering
   * @param {Object} req - Request object with optional query parameters
   * @param {Object} res - Response object
   */
  async getAllClasses(req, res) {
    try {
      // Extract any filter parameters from query
      const { standard, section, academicYear } = req.query;
      const filters = {};
      
      if (standard) filters.standard = standard;
      if (section) filters.section = section;
      if (academicYear) filters.academicYear = academicYear;

      const classes = await classFunctions.getAllClasses(filters);
      
      res.status(200).json({
        success: true,
        count: classes.length,
        data: classes
      });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching classes',
        error: error.message
      });
    }
  }

  /**
   * Get a single class by ID
   * @param {Object} req - Request object with class ID in params
   * @param {Object} res - Response object
   */
  async getClassById(req, res) {
    try {
      const { id } = req.params;
      const classData = await classFunctions.getClassById(id);
      
      if (!classData) {
        return res.status(404).json({
          success: false,
          msg: 'Class not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: classData
      });
    } catch (error) {
      console.error('Error fetching class:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching class',
        error: error.message
      });
    }
  }

  /**
   * Update an existing class
   * @param {Object} req - Request object with class ID in params and updated data in body
   * @param {Object} res - Response object
   */
  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Verify class exists
      const classData = await classFunctions.getClassById(id);
      if (!classData) {
        return res.status(404).json({
          success: false,
          msg: 'Class not found'
        });
      }
      
      // If standard, section, or academicYear is being updated, check if it conflicts
      if (
        (updateData.standard && updateData.standard !== classData.standard) ||
        (updateData.section && updateData.section !== classData.section) ||
        (updateData.academicYear && updateData.academicYear !== classData.academicYear)
      ) {
        const newStandard = updateData.standard || classData.standard;
        const newSection = updateData.section || classData.section;
        const newAcademicYear = updateData.academicYear || classData.academicYear;
        
        const existingClass = await classFunctions.getClassByDetails(newStandard, newSection, newAcademicYear);
        if (existingClass && existingClass.id !== parseInt(id)) {
          return res.status(409).json({
            success: false,
            msg: `Class ${newStandard}-${newSection} already exists for academic year ${newAcademicYear}`
          });
        }
      }
      
      // Update class
      const updatedClass = await classFunctions.updateClass(id, updateData);
      
      res.status(200).json({
        success: true,
        msg: 'Class updated successfully',
        data: updatedClass
      });
    } catch (error) {
      console.error('Error updating class:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while updating class',
        error: error.message
      });
    }
  }

  /**
   * Delete a class
   * @param {Object} req - Request object with class ID in params
   * @param {Object} res - Response object
   */
  async deleteClass(req, res) {
    try {
      const { id } = req.params;
      
      // Verify class exists
      const classData = await classFunctions.getClassById(id);
      if (!classData) {
        return res.status(404).json({
          success: false,
          msg: 'Class not found'
        });
      }
      
      // Delete class
      await classFunctions.deleteClass(id);
      
      res.status(200).json({
        success: true,
        msg: 'Class deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while deleting class',
        error: error.message
      });
    }
  }

  /**
   * Get all subjects for a class with assigned teachers
   * @param {Object} req - Request object with class ID in params
   * @param {Object} res - Response object
   */
  async getClassSubjects(req, res) {
    try {
      const { id } = req.params;
      
      // Verify class exists
      const classData = await classFunctions.getClassById(id);
      if (!classData) {
        return res.status(404).json({
          success: false,
          msg: 'Class not found'
        });
      }
      
      // Get subjects with detailed teacher information
      const subjects = await classFunctions.getClassSubjectsWithTeachers(id);
      
      res.status(200).json({
        success: true,
        data: subjects
      });
    } catch (error) {
      console.error('Error fetching class subjects:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching class subjects',
        error: error.message
      });
    }
  }

  /**
   * Get all students enrolled in a class
   * @param {Object} req - Request object with class ID in params
   * @param {Object} res - Response object
   */
  async getClassStudents(req, res) {
    try {
      const { id } = req.params;
      
      // Verify class exists
      const classData = await classFunctions.getClassById(id);
      if (!classData) {
        return res.status(404).json({
          success: false,
          msg: 'Class not found'
        });
      }
      
      // Get students with detailed information
      const students = await classFunctions.getClassStudents(id);
      
      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      console.error('Error fetching class students:', error);
      res.status(500).json({
        success: false,
        msg: 'Server error while fetching class students',
        error: error.message
      });
    }
  }
}

// Export as singleton
module.exports = new ClassController();
