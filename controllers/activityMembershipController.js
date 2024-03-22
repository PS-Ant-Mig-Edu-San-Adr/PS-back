const { ActivityMembership } = require('../models/activityMembershipModel');

const activityMembershipController = {
    createActivityMembership: async (req, res) => {
        try {
            const activityMembership = await ActivityMembership.create(req.body);
            res.status(201).json(activityMembership);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAllActivityMemberships: async (req, res) => {
        try {
            const activityMemberships = await ActivityMembership.findAll();
            if (activityMemberships.length > 0) {
                res.json(activityMemberships);
            } else {
                res.status(404).json({ error: 'No se encontraron membresías de actividades' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getActivityMembershipById: async (req, res) => {
        try {
            const activityMembership = await ActivityMembership.findByPk(req.params.id);
            if (activityMembership) {
                res.json(activityMembership);
            } else {
                res.status(404).json({ error: 'Membresía de actividad no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateActivityMembership: async (req, res) => {
        try {
            const activityMembership = await ActivityMembership.findByPk(req.params.id);
            if (activityMembership) {
                await activityMembership.update(req.body);
                res.json(activityMembership);
            } else {
                res.status(404).json({ error: 'Membresía de actividad no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteActivityMembership: async (req, res) => {
        try {
            const activityMembership = await ActivityMembership.findByPk(req.params.id);
            if (activityMembership) {
                await activityMembership.destroy();
                res.json({ message: 'Membresía de actividad eliminada' });
            } else {
                res.status(404).json({ error: 'Membresía de actividad no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = activityMembershipController;