const express = require('express');
const userModel = require('../models/userModel');

const router = express.Router();

// Ruta para comprobar si el usuario existe
router.get('/check-username/:username', async (req, res) => {
    const { username } = req.params;

    const existingUser = await userModel.findOne({ usuario: username });

    if (existingUser) {
        res.json({ status: 201, exists: true, details: "User already exists"});
    } else {
        res.json({ status: 200, exists: false, details: "User does not exist"});
    }
});

module.exports = router;