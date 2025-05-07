//StudentController.js
const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');

// Student routes
router.post('/create', StudentController.createStudent);
router.get('/all', StudentController.getAllStudents);
router.get('/:id', StudentController.getStudentById);
router.put('/:id', StudentController.updateStudent);
router.delete('/:id', StudentController.deleteStudent);

module.exports = router;