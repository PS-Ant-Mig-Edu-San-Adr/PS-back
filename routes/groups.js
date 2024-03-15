const express = require('express');
const router = express.Router();
const activityModel = require('../models/activityModel');
const organizationModel = require('../models/organizacionModel');
const groupModel = require('../models/grupoModel');

router.post('/groups', async (req, res) => {
    try {
        const { name, description, members, events, privacy, schedules, organizationId, activityId } = req.body;

        const organization = await organizationModel.findById(organizationId);
        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        const activity = organization.activities.find(activity => activity._id == activityId);
        if (!activity) {
            return res.json({ status: 404, success: false, details: 'Actividad no encontrada' });
        }

        const existingGroup = activity.groups.find(group => group.name === name);
        if (existingGroup) {
            return res.json({ status: 400, success: false, details: 'El grupo ya existe dentro de la actividad' });
        }

        const newGroup = new groupModel({ name, description, members, events, privacy, schedules });
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;
