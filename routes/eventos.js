const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const calendarModel = require('../models/calendarioModel');
const eventModel = require('../models/eventoModel');
const organizationModel = require('../models/organizacionModel');
// Función para buscar usuario y calendario
const findUserAndCalendar = async (username) => {
    const user = await userModel.findOne({username});
    const calendar = user ? await calendarModel.findOne({userID: user._id}) : null;
    return {user, calendar};
};

router.get('/eventos/:username', async (req, res) => {
    try {
        const {username} = req.params;
        const {user, calendar} = await findUserAndCalendar(username);

        if (!user || !calendar) {
            return res.json({
                status: 404,
                success: false,
                details: !user ? 'Usuario no encontrado' : 'Calendario no encontrado para este usuario'
            });
        }

        const events = calendar.events;

        return res.json({status: 200, success: true, details: 'Eventos obtenidos correctamente', events});
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return res.json({status: 500, success: false, details: 'Error interno del servidor'});
    }
});

router.post('/eventos/grupo/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;
        const eventData = req.body;

        // Obtener todas las organizaciones
        const organizations = await organizationModel.find();

        // Recorrer todas las organizaciones en busca del grupo
        for (const [organizationIndex, organization] of organizations.entries()) {
            // Recorrer todas las actividades en busca del grupo
            for (const [activityIndex, activity] of organization.activities.entries()) {
                // Buscar el grupo por su ID dentro de la actividad
                const groupIndex = activity.groups.findIndex(group => group._id.toString() === groupId);
                if (groupIndex !== -1) {
                    organization.activities[activityIndex].groups[groupIndex].events.push(eventData);
                    await organizationModel.findByIdAndUpdate(organization._id, organization);
                    // Responder con un mensaje de éxito
                    return res.status(200).json({ success: true, message: 'Evento asociado con éxito al grupo.' });
                }
            }
        }
        // Si no se encuentra el grupo, responder con un mensaje de error
        return res.status(404).json({ success: false, message: 'Grupo no encontrado.' });
    } catch (error) {
        console.error('Error al asociar el evento con el grupo:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});


router.post('/eventos/:username', async (req, res) => {
    try {
        const {username} = req.params;
        const {
            startDate,
            endDate,
            repeat,
            title,
            color,
            description,
            location,
            group,
            notes,
            status,
            attachments
        } = req.body;

        const user = await userModel.findOne({username: username});

        if (!user) {
            return res.status(404).json({success: false, details: 'Usuario no encontrado'});
        }

        const calendar = await calendarModel.findOne({userID: user._id});

        if (!calendar) {
            return res.status(404).json({success: false, details: 'Calendario no encontrado para este usuario'});
        }

        const newEvent = new eventModel({
            startDate,
            endDate,
            repeat,
            title,
            color,
            description,
            location,
            group,
            notes,
            status,
            attachments
        });

        calendar.events.push(newEvent);
        await calendar.save();

        return res.status(201).json({success: true, details: 'Evento creado correctamente'});
    } catch (error) {
        console.error('Error creating the event:', error);
        return res.status(500).json({success: false, details: 'Error interno del servidor'});
    }
});

router.put('/eventos/:username/:eventoId', async (req, res) => {
    try {
        const {username, eventoId} = req.params;
        const {updatedEvent} = req.body;
        const {user, calendar} = await findUserAndCalendar(username);

        if (!user || !calendar) {
            return res.json({
                status: 404,
                success: false,
                details: !user ? 'Usuario no encontrado' : 'Calendario no encontrado para este usuario'
            });
        }

        const eventIndex = calendar.events.findIndex(event => event._id.toString() === eventoId);
        if (eventIndex === -1) {
            return res.json({status: 404, success: false, details: 'Evento no encontrado'});
        }

        calendar.events[eventIndex] = updatedEvent;
        await calendar.save();

        return res.json({status: 200, success: true, details: 'Evento modificado correctamente'});
    } catch (error) {
        console.error('Error al modificar el evento:', error);
        return res.json({status: 500, success: false, details: 'Error interno del servidor'});
    }
});

router.delete('/eventos/:username/:eventoId', async (req, res) => {
    try {
        const {username, eventoId: eventId} = req.params;

        const user = await userModel.findOne({username: username});

        if (!user) {
            return res.json({status: 404, success: false, details: 'Usuario no encontrado'});
        }

        const calendar = await calendarModel.findOne({userID: user._id});

        if (!calendar) {
            return res.json({status: 404, success: false, details: 'Calendario no encontrado para este usuario'});
        }

        calendar.events = calendar.events.filter(event => event._id.toString() !== eventId);
        await calendar.save();

        return res.json({status: 200, success: true, details: 'Evento eliminado correctamente'});
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        return res.json({status: 500, success: false, details: 'Error interno del servidor'});
    }
});

module.exports = router;
