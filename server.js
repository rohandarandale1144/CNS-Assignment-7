// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'super_secret_key', resave: false, saveUninitialized: true }));

// Mock database for demonstration purposes
const users = [];

// Serve the main page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Registration form (GET request)
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));

app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));


// Registration logic (POST request)
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.send('User already exists. Please try a different username.');
    }

    // Save the user in the mock database
    users.push({ username, password });
    console.log('Registered users:', users);

    // Redirect to login after registration
    res.redirect('/login');
});

// Login form (GET request)
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));

// Login logic (POST request)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate user credentials
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        req.session.username = username;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid credentials. Please try again.');
    }
});

// Dashboard route - protected
app.get('/dashboard', (req, res) => {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
    } else {
        res.redirect('/login');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// About page
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Log the contact form data (you can later send it via email or save it to a database)
    console.log('New Message from Contact Form:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);

    // Respond to the user after form submission
    res.send(`
        <html>
            <body>
                <h1>Thank you for your message, ${name}!</h1>
                <p>We have received your message and will get back to you soon.</p>
                <a href="/">Go back to the Home Page</a>
            </body>
        </html>
    `);
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));