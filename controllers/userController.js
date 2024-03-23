const {User} = require('../models/userModel');
const crypto = require("crypto");

const userController = {
    registerUser: async (req, res) => {
        try {
            const username = req.body.username;

            // Verificar si el usuario ya existe en la base de datos
            const existingUser = await User.findOne({ where: { username: username } });
            if (existingUser) {
                return res.status(400).json({ success: false, details: 'El nombre de usuario ya está en uso' });
            }

            // `passwordHash` es la contraseña aún sin hashear
            const password = req.body.passwordHash;

            // Hashear la contraseña antes de almacenarla
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            // Crear el usuario con la contraseña hasheada
            const user = await User.create({
                fullName: req.body.fullName,
                email: req.body.email,
                username: req.body.username,
                passwordHash: hashedPassword,
                timeZone: req.body.timeZone,
                preferredLanguage: req.body.preferredLanguage,
                notificationSettings: req.body.notificationSettings,
                avatar: req.body.avatar,
                tags: req.body.tags
            });

            res.status(201).json({success: true, details: user});
        } catch (error) {
            res.status(400).json({success: false, details: error.message});
        }
    },
    loginUser: async (req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.passwordHash;

            // Hashear la contraseña antes de compararla
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            // Buscamos si existe el usuario
            const user = await User.findOne({
                where: {
                    username: username,
                    passwordHash: hashedPassword
                }
            });

            if (!user) {
                return res.status(404).json({success: false, details: 'Usuario o contraseña incorrectos'});
            }

            res.status(201).json({success: true, details: user});

        } catch (error) {
            res.status(400).json({success: false, details: error.message});

        }
    },

    getAllUsers: async (req, res) => {
        try {

            const users = await User.findAll();

            if (users.length <= 0) {
                return res.status(404).json({success: false, error: 'No se encontraron usuarios'});
            }

            res.json({success: true, details: users});

        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({success: false, error: 'Usuario no encontrado'});
            }

            res.json({success: true, details: user});

        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({success: false, error: 'Usuario no encontrado'});
            }

            await user.update(req.body);
            res.json({success: true, details: user});
        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({success: false, error: 'Usuario no encontrado'});
            }
            await user.destroy();
            res.json({success: true, message: 'Usuario eliminado'});
        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    }
};

module.exports = userController;