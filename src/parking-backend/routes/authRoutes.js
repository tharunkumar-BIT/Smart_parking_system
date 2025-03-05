const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

// User Signup
router.post("/signup", async (req, res) => {
    const { name, car_number, city, state, country, pin_code, phone, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (name, car_number, city, state, country, pin_code, phone, email, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [name, car_number, city, state, country, pin_code, phone, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        res.status(200).json({ message: "Login successful", user });
    });
});

module.exports = router;
