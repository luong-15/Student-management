# Student Management System

This project is a Student Management System built with Node.js and MySQL. It provides a web interface for managing student data, including viewing, adding, and retrieving student information.

## Project Structure

```
student-management
├── src
│   ├── config
│   │   └── database.js        # Database connection configuration
│   ├── controllers
│   │   └── studentController.js # Controller for handling student-related requests
│   ├── models
│   │   └── Student.js         # Model defining the structure of student data
│   ├── routes
│   │   └── studentRoutes.js    # Routes for student-related operations
│   ├── views
│   │   ├── index.html          # HTML for the student management dashboard
│   │   └── infor.html          # HTML for displaying detailed student information
│   └── app.js                  # Entry point of the application
├── .env                         # Environment variables for database configuration
├── package.json                 # npm configuration file
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd student-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the database:**
   Create a `.env` file in the root directory and add your database configuration:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000` to access the Student Management Dashboard.

## Usage

- Use the dashboard to view all students and their details.
- Click on "Add New Student" to add a new student record.
- Click on a student's name to view detailed information about them.

## License

This project is licensed under the MIT License.