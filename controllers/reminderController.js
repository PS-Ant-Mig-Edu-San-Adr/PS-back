const {Reminder} = require('../models/reminderModel');

const reminderController = {
    createReminder: async (req, res) => {
        try {
            // Crear un nuevo recordatorio
            const reminder = await Reminder.create(req.body);

            res.status(201).json({success: true, details: reminder});
        } catch (error) {
            res.status(400).json({success: false, details: error.message});
        }
    },

    getAllReminders: async (req, res) => {
        try {
            const reminders = await Reminder.findAll();
            if (reminders.length <= 0) {
                return res.status(404).json({success: false, details: 'No se encontraron recordatorios'});
            }

            res.json({success: true, details: reminders});

        } catch (error) {
            res.status(500).json({success: false, details: error.message});
        }
    },

    getReminderById: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (!reminder) {
                return res.status(404).json({success: false, details: 'Recordatorio no encontrado'});
            }
            res.json({success: true, details: reminder});

        } catch (error) {
            res.status(500).json({success: false, details: error.message});
        }
    },

    updateReminder: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (!reminder) {
                return res.status(404).json({details: 'Recordatorio no encontrado'});
            }
            await reminder.update(req.body);
            res.json({success: true, details: reminder});

        } catch (error) {
            res.status(500).json({success: false, details: error.message});
        }
    },

    deleteReminder: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (!reminder) {
                return res.status(404).json({success: false, details: 'Recordatorio no encontrado'});
            }

            await reminder.destroy();
            res.json({success: true, details: 'Recordatorio eliminado'});

        } catch (error) {
            res.status(500).json({success: false, details: error.message});
        }
    }
};

module.exports = reminderController;
