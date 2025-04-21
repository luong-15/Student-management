const db = require('../config/database');

class Student {
    static async findAll() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    s.StudentID,
                    s.FullName,
                    s.DateOfBirth,
                    s.Gender,
                    s.Address,
                    s.Email,
                    s.AvatarURL,
                    c.ClassName,
                    c.CourseName,
                    GROUP_CONCAT(DISTINCT sub.SubjectName) as Subjects,
                    i.InstructorName,
                    ROUND(AVG(g.ProcessScore), 1) as AvgProcessScore,
                    ROUND(AVG(g.MidtermScore), 1) as AvgMidtermScore,
                    ROUND(AVG(g.FinalScore), 1) as AvgFinalScore,
                    f.Amount as TuitionFee,
                    f.PaymentStatus,
                    (
                        SELECT SUM(AmountPaid)
                        FROM PaymentHistory ph 
                        WHERE ph.FinancialID = f.FinancialID
                    ) as TotalPaid
                FROM Students s
                LEFT JOIN StudentClasses sc ON s.StudentID = sc.StudentID
                LEFT JOIN Classes c ON sc.ClassID = c.ClassID
                LEFT JOIN ClassSubjects cs ON c.ClassID = cs.ClassID
                LEFT JOIN Subjects sub ON cs.SubjectID = sub.SubjectID
                LEFT JOIN Instructors i ON cs.InstructorID = i.InstructorID
                LEFT JOIN Grades g ON s.StudentID = g.StudentID
                LEFT JOIN Financial f ON s.StudentID = f.StudentID
                GROUP BY s.StudentID
                ORDER BY s.StudentID;
            `);
            return rows;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw new Error('Failed to fetch students');
        }
    }

    static calculateAverageScore(...scores) {
        const validScores = scores.filter(score => score !== null);
        return validScores.length > 0 
            ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
            : 'N/A';
    }
}

module.exports = Student;