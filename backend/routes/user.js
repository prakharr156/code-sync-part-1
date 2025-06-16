const express = require("express");
const router = express.Router();
const { login, signup } = require("../Controller/Auth");
const { auth } = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout); // 🆕 ADD THIS ROUTE

// Test Protected Route
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Token verified. Protected route access successful.",
        user: req.user
    });
});
// In your backend - routes/auth.js or similar
router.get('/verify', auth, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  });
});
module.exports = router;
