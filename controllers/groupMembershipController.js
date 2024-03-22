const {GroupMembership} = require('../models/groupMembershipModel');

const groupMembershipController = {
    createGroupMembership: async (req, res) => {
        try {
        const groupMembership = await GroupMembership.create(req.body);
        res.status(201).json(groupMembership);
        } catch (error) {
        res.status(400).json({ error: error.message });
        }
    },
    
    getAllGroupMemberships: async (req, res) => {
        try {
        const groupMemberships = await GroupMembership.findAll();
        if (groupMemberships.length > 0) {
            res.json(groupMemberships);
        } else {
            res.status(404).json({ error: 'No se encontraron membresías de grupos' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    getGroupMembershipById: async (req, res) => {
        try {
        const groupMembership = await GroupMembership.findByPk(req.params.id);
        if (groupMembership) {
            res.json(groupMembership);
        } else {
            res.status(404).json({ error: 'Membresía de grupo no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    updateGroupMembership: async (req, res) => {
        try {
        const groupMembership = await GroupMembership.findByPk(req.params.id);
        if (groupMembership) {
            await groupMembership.update(req.body);
            res.json(groupMembership);
        } else {
            res.status(404).json({ error: 'Membresía de grupo no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },

    deleteGroupMembership: async (req, res) => {
        try {
        const groupMembership = await GroupMembership.findByPk(req.params.id);
        if (groupMembership) {
            await groupMembership.destroy();
            res.json({ message: 'Membresía de grupo eliminada' });
        } else {
            res.status(404).json({ error: 'Membresía de grupo no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    }
};

module.exports = groupMembershipController;