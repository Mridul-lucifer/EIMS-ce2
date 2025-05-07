// routes/ClassRoutes.js
const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/ClassController');

router.post('/create', ClassController.createClass);
router.get('/all', ClassController.getAllClasses);
router.get('/:id', ClassController.getClassById);
router.put('/:id', ClassController.updateClass);
router.delete('/:id', ClassController.deleteClass);
router.get('/:id/subjects', ClassController.getClassSubjects);
router.get('/:id/students', ClassController.getClassStudents);

module.exports = router;