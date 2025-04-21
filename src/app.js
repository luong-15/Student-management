const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

// Load environment variables from root directory
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure session with better security
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict'
    }
}));

// Authentication middleware
const authMiddleware = (req, res, next) => {
    // Allow access to public paths
    const publicPaths = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/css',
        '/js',
        '/images'
    ];
    
    // Check if the path starts with any of the public paths
    const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
    
    if (!req.session.user && !isPublicPath) {
        return res.redirect('/auth/login');
    }
    next();
};

// Routes
app.use('/auth', authRoutes);
app.use('/', authMiddleware, studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).render('error', {
        error: '404 Not Found',
        message: 'The requested page does not exist'
    });
});

// Start server with error handling
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});