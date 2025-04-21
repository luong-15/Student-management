const Student = require('../models/Student');

exports.getAllStudents = (req, res) => {
    res.render('students/index', { students: [] });
};

exports.getAddStudentPage = (req, res) => {
    res.render('students/add', { error: null });
};

exports.addStudent = (req, res) => {
    // TODO: Implement add student logic
    res.send('Add student POST route');
};

exports.getStudent = (req, res) => {
    // TODO: Implement get student logic
    res.send('Get student route');
};

exports.updateStudent = (req, res) => {
    // TODO: Implement update student logic
    res.send('Update student POST route');
};

exports.deleteStudent = (req, res) => {
    // TODO: Implement delete student logic
    res.send('Delete student POST route');
};