// Install bcrypt.js for password hashing and comparison
// npm install bcryptjs
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // Import bcrypt.js
const app = express();
const port = 3000;

// ... (Your existing middleware and database connection pool setup) ...

// Existing MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ... (Your existing GET routes and POST /register route) ...

// New POST route to handle user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    // SQL query to find the user by their email
    const sql = `SELECT * FROM users WHERE email = ?`;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return res.status(500).send('Database connection error.');
        }

        connection.query(sql, [email], async (error, results) => {
            connection.release();

            if (error) {
                console.error('Error querying database:', error);
                return res.status(500).send('Error during login.');
            }

            // Check if a user was found
            if (results.length === 0) {
                // User not found
                return res.status(401).send('Invalid email or password.');
            }

            const user = results[0];
            
            // Compare the provided password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                // Passwords match, login successful
                // You can set a session here for persistent login state
                res.status(200).send('Login successful! Welcome, ' + user.full_name);
            } else {
                // Passwords do not match
                res.status(401).send('Invalid email or password.');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
