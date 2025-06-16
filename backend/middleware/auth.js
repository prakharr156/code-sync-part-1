const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // const token = req.body.token || req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        const token =  req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token Missing' });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (e) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Token verification failed" });
    }
};
