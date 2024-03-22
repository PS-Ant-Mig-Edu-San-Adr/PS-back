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