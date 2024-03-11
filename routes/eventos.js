
const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const calendarModel = require('../models/calendarioModel');

// Función para buscar usuario y calendario
const findUserAndCalendar = async (username) => {
    const user = await userModel.findOne({ username });
    const calendar = user ? await calendarModel.findOne({ userID: user._id }) : null;
    return { user, calendar };
};

router.get('/eventos/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { user, calendar } = await findUserAndCalendar(username);

        if (!user || !calendar) {
            return res.json({ status: 404, success: false, details: !user ? 'Usuario no encontrado' : 'Calendario no encontrado para este usuario' });
        }

        const events = calendar.events;

        return res.json({ status: 200, success: true, details: 'Eventos obtenidos correctamente', events });
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

const Evento = require('../models/eventoModel');

router.post('/eventos/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { event } = req.body;
        const { user, calendar } = await findUserAndCalendar(username);

        if (!user || !calendar) {
            return res.json({ status: 404, success: false, details: !user ? 'Usuario no encontrado' : 'Calendario no encontrado para este usuario' });
        }

        calendar.events.push(event);
        await calendar.save();

        return res.json({ status: 201, success: true, details: 'Evento creado correctamente' });
    } catch (error) {
        console.error('Error al crear el evento:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.put('/eventos/:username/:eventoId', async (req, res) => {
    try {
        const { username, eventoId } = req.params;
        const { updatedEvent } = req.body;
        const { user, calendar } = await findUserAndCalendar(username);

        if (!user || !calendar) {
            return res.json({ status: 404, success: false, details: !user ? 'Usuario no encontrado' : 'Calendario no encontrado para este usuario' });
        }

        const eventIndex = calendar.events.findIndex(event => event._id.toString() === eventoId);
        if (eventIndex === -1) {
            return res.json({ status: 404, success: false, details: 'Evento no encontrado' });
        }

        calendar.events[eventIndex] = updatedEvent;
        await calendar.save();

        return res.json({ status: 200, success: true, details: 'Evento modificado correctamente' });
    } catch (error) {
        console.error('Error al modificar el evento:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.delete('/eventos/:username/:eventoId', async (req, res) => {
    try {
        const { username, eventoId: eventId } = req.params;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendar = await calendarModel.findOne({ userID: user._id });

        if (!calendar) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        calendar.events = calendar.events.filter(event => event._id.toString() !== eventId);
        await calendar.save();

        return res.json({ status: 200, success: true, details: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
