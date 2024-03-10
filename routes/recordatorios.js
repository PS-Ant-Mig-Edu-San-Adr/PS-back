const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const calendarModel = require('../models/calendarioModel');
const reminderModel = require('../models/recordatorioModel');


router.get('/recordatorios/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendar = await calendarModel.findOne({ userID: user._id });
        if (!calendar) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        const reminders = calendar.reminders;

        return res.json({ status: 200, success: true, details: 'Recordatorios obtenidos correctamente', reminders: reminders });
    } catch (error) {
        console.error('Error al obtener los recordatorios:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

const Recordatorio = require('../models/recordatorioModel');

// Express router
router.post('/recordatorios/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { selectedDateStart, selectedDateEnd, selectedRepeat, selectedTitle, selectedColor, selectedDescription } = req.body;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendar = await calendarModel.findOne({ userID: user._id });

        if (!calendar) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }
        const newReminder = new reminderModel({
            startDate: selectedDateStart,
            endDate: selectedDateEnd,
            repeat: selectedRepeat,
            title: selectedTitle,
            color: selectedColor,
            description: selectedDescription
        });

        calendar.reminders.push(newReminder);
        await calendar.save();

        return res.json({ status: 201, success: true, details: 'Recordatorio creado correctamente' });
    } catch (error) {
        console.error('Error al crear el recordatorio:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});



router.put('/recordatorios/:username/:id', async (req, res) => {
    try {
        const { username, id } = req.params;
        const { updatedReminder } = req.body;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendar = await calendarModel.findOne({ userID: user._id });

        if (!calendar) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        const reminderIndex = calendar.reminders.findIndex(recordatorio => recordatorio._id.toString() === id);

        if (reminderIndex === -1) {
            return res.json({ status: 404, success: false, details: 'Recordatorio no encontrado' });
        }

        calendar.reminders[reminderIndex] = updatedReminder;
        await calendar.save();

        return res.json({ status: 200, success: true, details: 'Recordatorio modificado correctamente' });
    } catch (error) {
        console.error('Error al modificar el recordatorio:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.delete('/recordatorios/:username/:id', async (req, res) => {
    try {
        const { username, id } = req.params;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendar = await calendarModel.findOne({ userID: user._id });

        if (!calendar) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }
        calendar.reminders = calendar.reminders.filter(reminder => reminder._id.toString() !== id);
        await calendar.save();

        return res.json({ status: 200, success: true, details: 'Recordatorio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el recordatorio:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
