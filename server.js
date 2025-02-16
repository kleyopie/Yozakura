// filepath: /c:/Users/admin/Desktop/HotelReservation/HotelReservation/server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import the cors package
const app = express();
const port = 3001; // Change the port number if needed

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./reservations.db'); // Use a file-based database

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        roomType TEXT,
        adults INTEGER,
        children INTEGER,
        checkIn TEXT,
        checkOut TEXT
    )`);
});

// Routes
app.post('/reserve', (req, res) => {
    const { id, roomType, adults, children, checkIn, checkOut } = req.body;
    console.log('Received reservation:', req.body); // Log the received reservation
    const stmt = db.prepare(`INSERT INTO reservations (id, roomType, adults, children, checkIn, checkOut) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(id, roomType, adults, children, checkIn, checkOut, (err) => {
        if (err) {
            console.error('Failed to save reservation:', err.message); // Log the error message
            return res.status(500).send('Failed to save reservation');
        }
        console.log('Reservation saved successfully'); // Log success
        res.send('Reservation saved successfully');
    });
    stmt.finalize();
});

// New route to get all reservations
app.get('/reservations', (req, res) => {
    db.all(`SELECT * FROM reservations`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Failed to retrieve reservations');
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});