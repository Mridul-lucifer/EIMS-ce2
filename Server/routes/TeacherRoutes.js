// routes/TeacherRoutes.js
const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/TeacherController');

// Teacher routes
router.post('/create', TeacherController.createTeacher);
router.get('/all', TeacherController.getAllTeachers);
router.get('/:id', TeacherController.getTeacherById);
router.put('/:id', TeacherController.updateTeacher);
router.delete('/:id', TeacherController.deleteTeacher);

module.exports = router;