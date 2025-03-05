const express = require("express");
const db = require("../db");
const router = express.Router();

// Fetch all available slots
router.get("/slots", (req, res) => {
  db.query("SELECT * FROM parking_slots WHERE available = 1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Handle booking
router.post("/book", (req, res) => {
  const { userId, slotId } = req.body;
  const sql = "UPDATE parking_slots SET available = 0, userId = ? WHERE id = ?";
  
  db.query(sql, [userId, slotId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Slot booked successfully!" });
  });
});

module.exports = router;
