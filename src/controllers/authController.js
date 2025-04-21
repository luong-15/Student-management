const db = require('../config/database');
const bcrypt = require('bcrypt');

// Simple rate limiting implementation
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Input validation
            if (!email || !password) {
                return res.status(400).render('account', { 
                    error: 'Email and password are required' 
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).render('account', {
                    error: 'Please enter a valid email address'
                });
            }

            // Rate limiting check
            const ipAddress = req.ip;
            const currentAttempts = loginAttempts.get(ipAddress) || { 
                count: 0, 
                timestamp: Date.now() 
            };

            if (Date.now() - currentAttempts.timestamp > LOCK_TIME) {
                currentAttempts.count = 0;
                currentAttempts.timestamp = Date.now();
            }

            if (currentAttempts.count >= MAX_ATTEMPTS) {
                const remainingTime = Math.ceil(
                    (LOCK_TIME - (Date.now() - currentAttempts.timestamp)) / 1000 / 60
                );
                return res.status(429).render('account', {
                    error: `Too many login attempts. Please try again in ${remainingTime} minutes.`
                });
            }

            // Find user
            const [user] = await db.query(
                'SELECT accountID, username, email, password, role, studentID, instructorID FROM qlsv.accounts WHERE email = ? LIMIT 1', 
                [email]
            );

            // Increment login attempts
            currentAttempts.count++;
            loginAttempts.set(ipAddress, currentAttempts);

            // Check user exists and password
            if (!user || !user.password) {
                return res.status(401).render('account', { 
                    error: 'Invalid email or password'
                });
            }

            // Verify password
            const validPassword = await bcrypt.compare(
                String(password).slice(0, 72),
                user.password
            );

            if (!validPassword) {
                return res.status(401).render('account', { 
                    error: 'Invalid email or password'
                });
            }

            // Login successful - clear login attempts
            loginAttempts.delete(ipAddress);

            // Set session data
            req.session.regenerate((err) => {
                if (err) {
                    console.error('Session regeneration error:', err);
                    return res.status(500).render('account', {
                        error: 'Session error. Please try again.'
                    });
                }

                req.session.userId = user.accountID;
                req.session.user = {
                    id: user.accountID,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    studentId: user.studentID,
                    instructorId: user.instructorID
                };

                req.session.save((err) => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).render('account', {
                            error: 'Session error. Please try again.'
                        });
                    }
                    return res.redirect('/');
                });
            });

        } catch (error) {
            console.error('Login error:', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            
            return res.status(500).render('account', { 
                error: 'An error occurred during login. Please try again later.'
            });
        }
    }

    async register(req, res) {
        try {
            const { username, email, password, role } = req.body;
            
            const existingUsers = await db.query(
                'SELECT * FROM accounts WHERE email = ? OR username = ?',
                [email, username]
            );

            if (existingUsers.length > 0) {
                return res.render('account', {
                    error: 'Email or username already registered'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await db.query(
                'INSERT INTO accounts (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, role]
            );

            res.redirect('/account?success=Registration successful');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('account', {
                error: 'Registration failed. Please try again.'
            });
        }
    }

    async updateUserRole(accountId, role, referenceId) {
        try {
            let query;
            if (role === 'student') {
                query = 'UPDATE qlsv.accounts SET StudentID = ? WHERE accountID = ?';
            } else if (role === 'instructor') {
                query = 'UPDATE qlsv.accounts SET InstructorID = ? WHERE accountID = ?';
            } else {
                throw new Error('Invalid role');
            }

            await db.query(query, [referenceId, accountId]);
            return true;
        } catch (error) {
            console.error('Update role error:', error);
            return false;
        }
    }

    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/account');
        });
    }
}

exports.getLoginPage = (req, res) => {
    res.render('auth/login', { error: null });
};

exports.login = (req, res) => {
    // TODO: Implement login logic
    res.send('Login POST route');
};

exports.getRegisterPage = (req, res) => {
    res.render('auth/register', { error: null });
};

exports.register = (req, res) => {
    // TODO: Implement register logic
    res.send('Register POST route');
};

exports.getForgotPasswordPage = (req, res) => {
    res.render('auth/forgot-password', { error: null });
};

exports.forgotPassword = (req, res) => {
    // TODO: Implement forgot password logic
    res.send('Forgot password POST route');
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};

module.exports = AuthController;