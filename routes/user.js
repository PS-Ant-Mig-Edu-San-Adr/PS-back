var express = require("express");
const userModel = require("../models/userModel");
const crypto = require("crypto");
const router = express.Router();

router.put("/user/:username", async (req, res) => {
    const username = req.params.username;
    const { fullName, password, email, timeZone } = req.body;

    try {
        // Buscar al usuario por su nombre de usuario
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                details: "Usuario no encontrado"
            });
        }

        if (fullName) user.fullName = fullName;
        if (password) user.passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        if (email) user.email = email;
        if (timeZone) user.timeZone = timeZone;

        await user.save();

        res.json({
            status: 200,
            success: true,
            details: "Usuario modificado correctamente"
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            success: false,
            details: "Error interno del servidor"
        });
    }
});

router.delete("/user/:username", async (req, res) => {
    const username = req.params.username;

    try {
        // Buscar al usuario por su nombre de usuario
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                details: "Usuario no encontrado"
            });
        }

        // Eliminar al usuario de la base de datos
        await user.remove();

        res.status(200).json({
            success: true,
            details: "Usuario eliminado correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            details: "Error interno del servidor"
        });
    }
});

router.get("/searchUser:username", async (req, res) => {
    try {
        const { username } = req.params;

        const user = await userModel.findOne(username);

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrada' });
        } 

        return res.json({ status: 200, success: true, details: 'Usuario encontrado correctamente', user });
    } catch (error) {
        console.error('Error al encontrar al usuario:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
