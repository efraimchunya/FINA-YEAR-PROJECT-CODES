const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/operator/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const operatorId = req.user?.id; // If you're using auth middleware

    // Example: Replace this with actual filtering by operatorId if needed
    const totalToursResult = await pool.query(
      "SELECT COUNT(*) FROM tours WHERE operator_id = $1", [operatorId]
    );
    const totalBookingsResult = await pool.query(
      "SELECT COUNT(*) FROM bookings WHERE operator_id = $1", [operatorId]
    );
    const confirmedBookingsResult = await pool.query(
      "SELECT COUNT(*) FROM bookings WHERE status = 'confirmed' AND operator_id = $1", [operatorId]
    );
    const revenueResult = await pool.query(
      "SELECT COALESCE(SUM(price), 0) FROM bookings WHERE status = 'confirmed' AND operator_id = $1", [operatorId]
    );

    const sitesResult = await pool.query(
      "SELECT * FROM sites WHERE operator_id = $1", [operatorId]
    );

    const recentBookingsResult = await pool.query(
      "SELECT * FROM bookings WHERE operator_id = $1 ORDER BY created_at DESC LIMIT 5", [operatorId]
    );

    res.json({
      metrics: {
        totalTours: parseInt(totalToursResult.rows[0].count),
        totalBookings: parseInt(totalBookingsResult.rows[0].count),
        confirmedBookings: parseInt(confirmedBookingsResult.rows[0].count),
        revenue: parseFloat(revenueResult.rows[0].coalesce),
      },
      sites: sitesResult.rows,
      bookings: recentBookingsResult.rows,
    });
  } catch (err) {
    console.error("Error loading operator dashboard:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
