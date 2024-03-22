const {Event} = require('../models/eventModel');

const eventController = {
    createEvent: async (req, res) => {
        try {
            const event = await Event.create(req.body);
            res.status(201).json(event);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.findAll();
            if (events.length > 0) {
                res.json(events);
            } else {
                res.status(404).json({ error: 'No se encontraron eventos' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getEventById: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                res.json(event);
            } else {
                res.status(404).json({ error: 'Evento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updateEvent: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                await event.update(req.body);
                res.json(event);
            } else {
                res.status(404).json({ error: 'Evento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                await event.destroy();
                res.json({ message: 'Evento eliminado' });
            } else {
                res.status(404).json({ error: 'Evento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};


module.exports = eventController;