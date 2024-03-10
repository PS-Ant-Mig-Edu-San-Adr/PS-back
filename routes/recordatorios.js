const express = require('express');
const router = express.Router();
const usuarioModel = require('../models/userModel');
const calendarioModel = require('../models/calendarioModel');


router.get('/recordatorios/:username', async (req, res) => {
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

        const recordatorios = calendario.recordatorios;

        return res.json({ status: 200, success: true, details: 'Recordatorios obtenidos correctamente', recordatorios });
    } catch (error) {
        console.error('Error al obtener los recordatorios:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.post('/recordatorios/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { recordatorio } = req.body;

        const usuario = await usuarioModel.findOne({ usuario: username });

        if (!usuario) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendario = await calendarioModel.findOne({ usuario: usuario._id });

        if (!calendario) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        calendario.recordatorios.push(recordatorio);
        await calendario.save();

        return res.json({ status: 201, success: true, details: 'Recordatorio creado correctamente' });
    } catch (error) {
        console.error('Error al crear el recordatorio:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.put('/recordatorios/:username/:recordatorioId', async (req, res) => {
    try {
        const { username, recordatorioId } = req.params;
        const { recordatorioActualizado } = req.body;

        const usuario = await usuarioModel.findOne({ usuario: username });

        if (!usuario) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendario = await calendarioModel.findOne({ usuario: usuario._id });

        if (!calendario) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        const indexRecordatorio = calendario.recordatorios.findIndex(recordatorio => recordatorio._id.toString() === recordatorioId);

        if (indexRecordatorio === -1) {
            return res.json({ status: 404, success: false, details: 'Recordatorio no encontrado' });
        }

        calendario.recordatorios[indexRecordatorio] = recordatorioActualizado;
        await calendario.save();

        return res.json({ status: 200, success: true, details: 'Recordatorio modificado correctamente' });
    } catch (error) {
        console.error('Error al modificar el recordatorio:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.delete('/recordatorios/:username/:recordatorioId', async (req, res) => {
    try {
        const { username, recordatorioId } = req.params;

        const usuario = await usuarioModel.findOne({ usuario: username });

        if (!usuario) {
            return res.json({ status: 404, success: false, details: 'Usuario no encontrado' });
        }

        const calendario = await calendarioModel.findOne({ usuario: usuario._id });

        if (!calendario) {
            return res.json({ status: 404, success: false, details: 'Calendario no encontrado para este usuario' });
        }

        calendario.recordatorios = calendario.recordatorios.filter(recordatorio => recordatorio._id.toString() !== recordatorioId);
        await calendario.save();

        return res.json({ status: 200, success: true, details: 'Recordatorio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el recordatorio:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
