var express = require("express");
const userModel = require("../models/userModel");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ correo: email });

        if (user && user.contraseñaHash === password) {
            res.json({
                user: user,
                status: 200,
                success: true,
                details: "Login successful",
            });
        } else {
            res.json({
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