var express = require("express");
const userModel = require("../models/userModel");
const calendarioModel = require("../models/calendarioModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken"); // Importamos la biblioteca jsonwebtoken
const router = express.Router();
const secretKey = require('./secretKey');


router.post("/register", async (req, res) => {
    const {email, password, firstName, lastName, username} = req.body;

    // Hashear la contraseña utilizando SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const match = await userModel.find({
        $or: [{email: email}, {username: username}],
    });

    if (!match[0]) {
        // Crear un nuevo usuario
        const newUser = userModel({
            fullName: firstName + " " + lastName,
            email: email,
            username: username,
            hashedPassword: hashedPassword,
            creationDate: new Date(),
            timeZone: "GMT",
            preferredLanguage: "Español",
            notificationSettings: "Desactivadas",
            avatar: null,
            groups: [],
            ID: null,
            labels: [],
        });

        const newCalendar = calendarioModel({
            username: newUser._id,
            visibility: "Privado",
            events: [],
            reminders: []
        });

        await nuevoCalendario.save();

        newUser.calendario = nuevoCalendario._id;
        await newUser.save();

        // Generar el token JWT
        const token = jwt.sign({usuario: newUser.usuario}, secretKey, {});

        res.json({
            user: newUser,
            token: token,
            status: 200,
            success: true,
            details: "User created successfully",
        });
    } else {
        res.json({
            user: null,
            token: null,
            status: 201,
            success: false,
            details: "User already exists",
        });
    }
});

module.exports = router;
