const { Reminder } = require('../models/reminderModel');

const reminderController = {
    createReminder: async (req, res) => {
        try {
            const reminder = await Reminder.create(req.body);
            res.status(201).json(reminder);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    getAllReminders: async (req, res) => {
        try {
            const reminders = await Reminder.findAll();
            if (reminders.length > 0) {
                res.json(reminders);
            } else {
                res.status(404).json({ error: 'No se encontraron recordatorios' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getReminderById: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (reminder) {
                res.json(reminder);
            } else {
                res.status(404).json({ error: 'Recordatorio no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updateReminder: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (reminder) {
                await reminder.update(req.body);
                res.json(reminder);
            } else {
                res.status(404).json({ error: 'Recordatorio no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    deleteReminder: async (req, res) => {
        try {
            const reminder = await Reminder.findByPk(req.params.id);
            if (reminder) {
                await reminder.destroy();
                res.json({ message: 'Recordatorio eliminado' });
            } else {
                res.status(404).json({ error: 'Recordatorio no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = reminderController;
