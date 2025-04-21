const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student routes
router.get('/', studentController.getAllStudents);
router.get('/add', studentController.getAddStudentPage);
router.post('/add', studentController.addStudent);
router.get('/:id', studentController.getStudent);
router.post('/:id/update', studentController.updateStudent);
router.post('/:id/delete', studentController.deleteStudent);

module.exports = router;