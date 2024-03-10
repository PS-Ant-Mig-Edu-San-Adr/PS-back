const express = require('express');
const router = express.Router();
const usuarioModel = require('../models/userModel');
const calendarioModel = require('../models/calendarioModel');

router.get('/eventos/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const usuario = await usuarioModel.findOne({ usuario: username });

        if (!usuario) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendario = await calendarioModel.findOne({ usuario: usuario._id });

        if (!calendario) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        const eventos = calendario.eventos;

        return res.json({ status: 200, success: true, details: 'Eventos obtenidos correctamente', eventos });
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        return res.json({ status:500, success: false, details: 'Error interno del servidor' });
    }
});

router.post('/eventos/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { evento } = req.body;

        const usuario = await usuarioModel.findOne({ usuario: username });

        if (!usuario) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendario = await calendarioModel.findOne({ usuario: usuario._id });

        if (!calendario) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        calendario.eventos.push(evento);
        await calendario.save();

        return res.json({ status: 201, success: true, details: 'Evento creado correctamente' });
    } catch (error) {
        console.error('Error al crear el evento:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.put('/eventos/:username/:eventoId', async (req, res) => {
    try {
        const { username, eventoId } = req.params;
        const { eventoActualizado } = req.body;

        const usuario = await usuarioModel.findOne({ usuario: username });

        if (!usuario) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendario = await calendarioModel.findOne({ usuario: usuario._id });

        if (!calendario) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        const indexEvento = calendario.eventos.findIndex(evento => evento._id.toString() === eventoId);

        if (indexEvento === -1) {
            return res.json({ status: 404, success: false, details: 'Evento no encontrado' });
        }

        calendario.eventos[indexEvento] = eventoActualizado;
        await calendario.save();

        return res.json({ status: 200, success: true, details: 'Evento modificado correctamente' });
    } catch (error) {
        console.error('Error al modificar el evento:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.delete('/eventos/:username/:eventoId', async (req, res) => {
    try {
        const { username, eventoId } = req.params;

        const usuario = await usuarioModel.findOne({ usuario: username });

        if (!usuario) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendario = await calendarioModel.findOne({ usuario: usuario._id });

        if (!calendario) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        calendario.eventos = calendario.eventos.filter(evento => evento._id.toString() !== eventoId);
        await calendario.save();

        return res.json({ status: 200, success: true, details: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
