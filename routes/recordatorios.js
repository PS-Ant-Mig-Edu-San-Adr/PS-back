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

        const remindersId = calendar.reminders;

        const reminders = await reminderModel.find({ _id: { $in: remindersId } });

        return res.json({ status: 200, success: true, details: 'Recordatorios obtenidos correctamente', reminders: reminders });
    } catch (error) {
        console.error('Error al obtener los recordatorios:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

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

        newReminder.save();

        calendar.reminders.push(newReminder._id);

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
        const { selectedDateStart, selectedDateEnd, selectedRepeat, selectedTitle, selectedColor, selectedDescription } = req.body;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendar = await calendarModel.findOne({ userID: user._id });

        if (!calendar) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        const reminderIndex = calendar.reminders.findIndex(reminderId => reminderId.toString() === id);

        if (reminderIndex === -1) {
            return res.json({ status: 404, success: false, details: 'Recordatorio no encontrado en el calendario' });
        }

        const reminder = await reminderModel.findOne({ _id: id });

        if (!reminder) {
            return res.json({ status: 404, success: false, details: 'Recordatorio no encontrado' });
        }

        // Actualizar los campos del recordatorio en la colección de recordatorios
        reminder.startDate = selectedDateStart;
        reminder.endDate = selectedDateEnd;
        reminder.repeat = selectedRepeat;
        reminder.title = selectedTitle;
        reminder.color = selectedColor;
        reminder.description = selectedDescription;

        await reminder.save();

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
        
        calendar.reminders = calendar.reminders.filter(reminder => reminder.toString() !== id);
        await calendar.save();

        // Eliminar el recordatorio de la colección de recordatorios
        await reminderModel.deleteOne({ _id: id });

        return res.json({ status: 200, success: true, details: 'Recordatorio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el recordatorio:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
