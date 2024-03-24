const {User} = require('../models/userModel');
const crypto = require("crypto");
const {Reminder} = require("../models/reminderModel");

const userController = {
    registerUser: async (req, res) => {
        try {
            const username = req.body.username;

            // Verificar si el usuario ya existe en la base de datos
            const existingUser = await User.findOne({ where: { username: username } });
            if (existingUser) {
                return res.status(400).json({ success: false, result: undefined, details: 'El nombre de usuario ya está en uso' });
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

            res.status(201).json({success: true, result: user, details: "Usuario creado exitosamente"});
        } catch (error) {
            res.status(400).json({success: false, result: undefined, details: error.message});
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
                return res.status(404).json({success: false, result: undefined, details: 'Usuario o contraseña incorrectos'});
            }

            res.status(201).json({success: true, result: user, details: 'Inicio de sesión exitoso'});

        } catch (error) {
            res.status(400).json({success: false, result: undefined, details: error.message});

        }
    },

    getAllUsers: async (req, res) => {
        try {

            const users = await User.findAll();

            if (users.length <= 0) {
                return res.status(404).json({success: false, result: undefined, details: 'No se encontraron usuarios'});
            }

            res.json({success: true, result: users, details: 'Usuarios encontrados'});

        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({success: false, result: undefined, details: 'Usuario no encontrado'});
            }

            res.json({success: true, result: user, details: 'Usuario encontrado'});

        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    },

    getUserActivities: async (req, res) => {
        try {
          const user = await User.findByPk(req.params.id, {
            include: {
              model: ActivityMembership,
              include: Activity
            }
          });
    
          if (user) {
            if (user.activities.length > 0) {
              res.status(200).json({ status: 200, success: true, details: 'Actividades obtenidas correctamente', activities: user.activities });
            } else {
              res.status(404).json({ status: 404, success: false, details: 'No se encontraron actividades para el usuario especificado', activities: [] });
            }
          } else {
            res.status(405).json({ status:405, success: false, details: 'Usuario no encontrado' });
          }
        } catch (error) {
          res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
        }
    },
    

    getUserReminders: async (req, res) => {
        try {
            const reminders = await Reminder.findAll({
                where: {userId: req.params.userId}
            });
            if (reminders.length <= 0) {
                return res.status(404).json({success: false, result: undefined, details: 'No se encontraron recordatorios para el usuario'});
            }

            res.json({success: true, result: reminders, details: 'Recordatorios encontrados'});

        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({success: false, result: undefined,  details: 'Usuario no encontrado'});
            }

            await user.update(req.body);
            res.json({success: true, result: user, details: 'Usuario actualizado'});
        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({success: false, result: undefined, details: 'Usuario no encontrado'});
            }
            await user.destroy();
            res.json({success: true, result: user, details: 'Usuario eliminado'});
        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    }
};

module.exports = userController;