const {Group} = require('../models/groupModel');

const groupController = {
    createGroup: async (req, res) => {
        try {
            const group = await Group.create(req.body);
            res.status(201).json(group);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    getAllGroups: async (req, res) => {
        try {
            const groups = await Group.findAll();
            if (groups.length > 0) {
                res.json(groups);
            } else {
                res.status(404).json({ error: 'No se encontraron grupos' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getGroupById: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ error: 'Grupo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updateGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (group) {
                await group.update(req.body);
                res.json(group);
            } else {
                res.status(404).json({ error: 'Grupo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    deleteGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (group) {
                await group.destroy();
                res.json({ message: 'Grupo eliminado' });
            } else {
                res.status(404).json({ error: 'Grupo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};


module.exports = groupController;