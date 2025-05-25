const express = require('express');
const path = require('path');
const morgan = require('morgan');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'password.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/conscious-spending', (req, res) => {
    res.sendFile(path.join(__dirname, 'conscious-spending.html'));
});

app.get('/objetivos', (req, res) => {
    res.sendFile(path.join(__dirname, 'objetivos.html'));
});

app.get('/investimentos', (req, res) => {
    res.sendFile(path.join(__dirname, 'investimentos.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'settings.html'));
});

// Handle 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});
