const {Event} = require('../models/eventModel');
const {Group} = require('../models/groupModel');

const eventController = {
    createEvent: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.groupId);
            if (group) {
                const event = await Event.create(req.body);
                await group.addEvent(event);
                return res.status(200).json({ success: true, result: event, details: 'Evento creado correctamente' });
            } else {
                return res.status(404).json({ success: false, details: 'Grupo no encontrado' });
            }
        } catch (error) {
            res.status(400).json({ success: false, details: error.message });
        }
    },
    
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.findAll();
            if (events.length > 0) {
                res.status(200).json({ success: true, details: 'Eventos encontrados', result: events });
            } else {
                res.status(404).json({ success: false, details: 'No se encontraron eventos' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    },
    
    getEventById: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                res.status(200).json({ success: true, result: event, details: 'Evento encontrado' });
            } else {
                res.status(404).json({ success: false, details: 'Evento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    },
    
    updateEvent: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                await event.update(req.body);
                res.status(200).json({ success: true, result: event, details: 'Evento actualizado' });
            } else {
                res.status(404).json({ success: false, details: 'Evento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    },
    
    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                await event.destroy();
                res.status(200).json({ success: true, details: 'Evento eliminado' });
            } else {
                res.status(404).json({ success: false, details: 'Evento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    }
};


module.exports = eventController;