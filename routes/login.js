var express = require("express");
const userModel = require("../models/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken"); // Importamos la biblioteca jsonwebtoken
const router = express.Router();
const secretKey = require('./secretKey');

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Hashear la contraseña utilizando SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    console.log("Hashed password:", hashedPassword)
    try {
        const user = await userModel.findOne({ email: email });

        if (user && user.passwordHash === hashedPassword) {
            // Generar un token JWT
            const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '10s' });

            res.json({
                user: user,
                token: token,
                status: 200,
                success: true,
                details: "Login successful",
            });
        } else {
            res.json({
                user: null,
                token: null,
                status: 401,
                success: false,
                details: "Invalid email or password",
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            status: 500,
            success: false,
            details: "Internal server error",
        });
    }
});

module.exports = router;