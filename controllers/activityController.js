const { Activity } = require('../models/activityModel.js');


const activityController = {
    createActivity: async (req, res) => {
        try {
        const activity = await Activity.create(req.body);
        res.status(201).json(activity);
        } catch (error) {
        res.status(400).json({ error: error.message });
        }
    },
    
    getAllActivities: async (req, res) => {
        try {
        const activities = await Activity.findAll();
        if (activities.length > 0) {
            res.json(activities);
        } else {
            res.status(404).json({ error: 'No se encontraron actividades' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    getActivityById: async (req, res) => {
        try {
        const activity = await Activity.findByPk(req.params.id);
        if (activity) {
            res.json(activity);
        } else {
            res.status(404).json({ error: 'Actividad no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    updateActivity: async (req, res) => {
        try {
        const activity = await Activity.findByPk(req.params.id);
        if (activity) {
            await activity.update(req.body);
            res.json(activity);
        } else {
            res.status(404).json({ error: 'Actividad no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    deleteActivity: async (req, res) => {
        try {
        const activity = await Activity.findByPk(req.params.id);
        if (activity) {
            await activity.destroy();
            res.json({ message: 'Actividad eliminada' });
        } else {
            res.status(404).json({ error: 'Actividad no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    }
};

module.exports = activityController;

