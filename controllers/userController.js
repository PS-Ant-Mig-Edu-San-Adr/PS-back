const {User } = require('../models/userModel');

const userController = {
    createUser: async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            if (users.length > 0) {
                res.json(users);
            } else {
                res.status(404).json({ error: 'No se encontraron usuarios' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getUserById: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
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
    
    updateUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                await user.update(req.body);
                res.json(user);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                await user.destroy();
                res.json({ message: 'Usuario eliminado' });
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;