var express = require("express");
const userModel = require("../models/userModel");
const calendarioModel = require("../models/calendarioModel");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body;

    const match = await userModel.find({
        $or: [{ email: email }, { username: username }],
    });

    if (!match[0]) {

        // Crear un nuevo usuario
        const newUser = userModel({
        nombre: firstName + " " + lastName,
        correo: email,
        usuario: username,
        contraseñaHash: password,
        fechaCreacion: new Date(),
        zonaHoraria: "GMT",
        idiomaPreferido: "Español",
        configNotificaciones: "Desactivadas",
        avatar: null,
        grupos: [],
        DNI: null,
        etiquetas: [],
        });

        const nuevoCalendario = calendarioModel({
            usuario: newUser._id,
            privacidad: "Privado",
            eventos: [],
            recordatorios: []
        });

        await nuevoCalendario.save();

        newUser.calendario = nuevoCalendario._id;
        await newUser.save();

        res.json({
        user: newUser,
        status: 200,
        success: true,
        details: "User created successfully",
        });
    } else {
        res.json({
        user: match,
        status: 201,
        success: false,
        details: "User already exists",
        });
    }
});

module.exports = router;
