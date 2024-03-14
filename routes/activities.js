const express = require('express');
const router = express.Router();
const activityModel = require('../models/activityModel');
const organizationModel = require('../models/organizacionModel');

// Obtener todas las actividades de un usuario
router.get('/activities/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Encuentra todas las actividades asociadas al usuario
        const activities = await activityModel.find({ members: username });

        return res.json({ status: 200, success: true, details: 'Actividades obtenidas correctamente', activities });
    } catch (error) {
        console.error('Error al obtener las actividades:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});


router.post('/activities/:id', async (req, res) => {
    try {
        const { name, description, groups, members, privacy } = req.body;
        const organizationId = req.params.id;
        
        const organization = await organizationModel.findById(organizationId);
        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        const existingActivity = organization.activities.find(activity => activity.name === name);
        if (existingActivity) {
            return res.json({ status: 400, success: false, details: 'La actividad ya existe dentro de la organización' });
        }

        const newActivity = new activityModel({ name, description, groups, members, privacy });
        organization.activities.push(newActivity);
        await organization.save();

        return res.json({ status: 200, success: true, details: 'Actividad creada correctamente', activity: newActivity });
    } catch (error) {
        console.error('Error al crear la actividad:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});


// Actualizar una actividad existente
router.put('/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, groups, members, roles, privacy } = req.body;

        // Busca y actualiza la actividad por su ID
        const updatedActivity = await activityModel.findByIdAndUpdate(id, { name, description, groups, members, roles, privacy }, { new: true });

        return res.json({ status: 200, success: true, details: 'Actividad actualizada correctamente', activity: updatedActivity });
    } catch (error) {
        console.error('Error al actualizar la actividad:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

// Eliminar una actividad existente
router.delete('/actividades/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Elimina la actividad por su ID
        await activityModel.findByIdAndDelete(id);

        return res.json({ status: 200, success: true, details: 'Actividad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
