var express = require("express");
const userModel = require("../models/userModel");
const crypto = require("crypto");
const router = express.Router();
const path = require('path');
const os = require('os');
const fs = require('fs');

const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() });

router.put("/user/:username", async (req, res) => {
    const username = req.params.username;
    const { inputUsername, password, email, timeZone, fileName } = req.body;

    try {
        // Buscar al usuario por su nombre de usuario
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                details: "Usuario no encontrado"
            });
        }

        if (inputUsername) user.username = inputUsername;
        if (password) user.passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        if (email) user.email = email;
        if (timeZone) user.timeZone = timeZone;
        if (fileName) user.avatar = `http://localhost:3001/assets/profiles/${fileName}`;

        await user.save();

        res.json({
            user: user,
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

router.get("/searchUser/:username", async (req, res) => {
    try {
        const { username } = req.params;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrada' });
        } 

        return res.json({ status: 200, success: true, details: 'Usuario encontrado correctamente', user });
        
    } catch (error) {
        console.error('Error al encontrar al usuario:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});


router.post("/image", upload.single('file'), async (req, res) => {
    const file = req.file;
    const originalFileName = file.originalname;

    const imagePath = path.join(__dirname, '..', 'assets', 'profiles', originalFileName);


    try {
        
        fs.writeFileSync(imagePath, fs.readFileSync(file.path));
        res.json({ success: true, details: "Imagen guardada correctamente", status: 200, name: originalFileName});
    } catch (error) {
        console.error("Error al guardar la imagen:", error);
        res.json({ success: false, details: "Error al guardar la imagen", status: 500 });
    }
});

router.put("/userNotificactions/:username", async (req, res) => {
    const username = req.params.username;
    const { notificationsOption } = req.body;

    try {
        // Buscar al usuario por su nombre de usuario
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.json({
                success: false,
                details: "Usuario no encontrado",
                status: 404
            });
        }

        if (notificationsOption) user.notificationSettings  = notificationsOption;
        
        await user.save();

        res.json({
            user: user,
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

router.get("/filterUser/:query", async (req, res) => {
    try {
        const { query } = req.params;

        const users = await userModel.find({
            $or: [
                { username: { $regex: '^' + query, $options: 'i' } },
                { fullname: { $regex: '^' + query, $options: 'i' } },
                { email: { $regex: '^' + query, $options: 'i' } }
            ]
        });

        if (!users || users.length === 0) {
            return res.json({ status: 404, success: false, details: 'No se encontraron usuarios' });
        } 

        return res.json({ status: 200, success: true, details: 'Usuarios encontrados correctamente', users });
        
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
