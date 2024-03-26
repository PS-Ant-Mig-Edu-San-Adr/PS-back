const {User} = require('../models/userModel');
const crypto = require("crypto");
const {Reminder} = require("../models/reminderModel");
const {Organization} = require("../models/organizationModel");
const {OrganizationMembership} = require("../models/organizationMembershipModel");
const {ActivityMembership} = require("../models/activityMembershipModel");
const {Activity} = require("../models/activityModel");

const userController = {
    // FIXME: No dejar que salte el error en la base de datos, comprobar validez de todos los campos previamente, tanto en register como en update
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

    getUserOrganizations: async (req, res) => {
        try {
          const organizations = await Organization.findAll({
            include: [
              {
                model: OrganizationMembership,
                where: { user_id: req.params.id, role: 'admin'}
              }
            ]
          });
    
          if (organizations.length > 0) {
            return res.status(200).json({ success: true, details: 'Organizaciones encontradas', result: organizations });
          } else {
            return res.status(404).json({ success: false, details: 'No se encontraron organizaciones' });
          }
        } catch (error) {
            return res.status(500).json({ success: false, details: error.message });
        }
      },    

    getUserActivities: async (req, res) => {
        try {
          const activities = await ActivityMembership.findAll({
            include: [
                {
                    model: Activity,
                    where: { user_id: req.params.id, role: 'admin'}
                }
                ]
          });
    
          if (activities.length > 0) {
            return res.status(200).json({ success: true, details: 'Actividades encontradas', result: activities });
          } else {
            return res.status(404).json({ success: false, details: 'No se encontraron actividades' });
          }
        } catch (error) {
          res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
        }
    },
    

    getUserReminders: async (req, res) => {
        try {
            const reminders = await Reminder.findAll({
                where: {user_id: req.params.id}
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

            // `passwordHash` es la contraseña aún sin hashear
            const password = req.body.passwordHash;

            // Hashear la contraseña antes de almacenarla
            req.body.passwordHash = crypto.createHash('sha256').update(password).digest('hex');

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