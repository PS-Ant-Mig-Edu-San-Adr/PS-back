const {Reminder} = require('../models/reminderModel');

// FIXME: Check all fields validity before updating or creating
const reminderController = {
    createReminder: async (req, res) => {
        try {
            // Crear un nuevo recordatorio
            const reminder = await Reminder.create(req.body);

            res.status(201).json({success: true, result: reminder, details: 'Recordatorio creado correctamente'});
        } catch (error) {
            res.status(400).json({success: false, result: undefined, details: error.message});
        }
    },

    getAllReminders: async (req, res) => {
        try {
            const reminders = await Reminder.findAll();
            if (reminders.length <= 0) {
                return res.status(404).json({success: false, result: undefined, details: 'No se encontraron recordatorios'});
            }

            res.json({success: true, result: reminders, details: 'Recordatorios encontrados'});

        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    },

    getReminderById: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (!reminder) {
                return res.status(404).json({success: false, result: undefined, details: 'Recordatorio no encontrado'});
            }
            res.json({success: true, result: reminder, details: "Recordatorio encontrado"});

        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    },

    updateReminder: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (!reminder) {
                return res.status(404).json({success: false, result: undefined, details: 'Recordatorio no encontrado'});
            }
            await reminder.update(req.body);
            res.json({success: true, result: reminder, details: 'Recordatorio actualizado'});

        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    },

    deleteReminder: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (!reminder) {
                return res.status(404).json({success: false, result: undefined,  details: 'Recordatorio no encontrado'});
            }

            await reminder.destroy();
            res.json({success: true, result: undefined, details: 'Recordatorio eliminado'});

        } catch (error) {
            res.status(500).json({success: false, result: undefined, details: error.message});
        }
    }
};

module.exports = reminderController;
