const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware to parse the body of POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Setup sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Serve static files (CSS, images, fonts)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Simulate a user database
const users = [
    {
        username: 'user1',
        email: 'user1@example.com',
        password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36CKiE3nKjO8la0XeoGJfqi' // bcrypt hash for 'password123'
    }
];

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);

    const user = users.find(u => u.email === email);
    if (!user) {
        console.log('Invalid credentials: User not found');
        return res.status(401).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log('Invalid credentials: Incorrect password');
        return res.status(401).send('Invalid credentials');
    }

    req.session.user = user;
    console.log('Login successful');
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        console.log('Unauthorized access attempt to dashboard');
        return res.status(401).send('You are not logged in');
    }
    res.send(`Welcome ${req.session.user.username}`);
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Error logging out:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

