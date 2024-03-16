const express = require('express');
const router = express.Router();
const activityModel = require('../models/activityModel');
const organizationModel = require('../models/organizacionModel');
const groupModel = require('../models/grupoModel');
const scheduleModel = require('../models/horarioModel');

router.post('/groups/:organizationId/:activityId', async (req, res) => {
    try {
        const { name, description, members, events, privacy, schedules } = req.body;
        const { organizationId, activityId } = req.params;


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
        activity.groups.push(newGroup);
        await organization.save();
        return res.json({ status: 200, success: true, details: 'Grupo obtenidas correctamente',  group: newGroup });
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.get('group', async (req, res) => {
    try{
        const { groupName, organizationId, activityId } = req.body;

        const organization = await organizationModel.findById(organizationId);
        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        const activity = organization.activities.find(activity => activity._id == activityId);
        if (!activity) {
            return res.json({ status: 404, success: false, details: 'Actividad no encontrada' });
        }

        const existingGroup = activity.groups.find(group => group.name === groupName);
        if (existingGroup) {
            return res.json({ status: 400, success: false, details: 'El grupo ya existe dentro de la actividad' });
        }

        return res.json({ status: 200, success: true, details: 'Grupo obtenido correctamente', existingGroup });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})


router.delete('/groups', async(req, res) => {
    try {
        const { nameGroup, organizationId, activityId } = req.body;

        const organization = await organizationModel.findById(organizationId);
        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        const activity = organization.activities.find(activity => activity._id == activityId);
        if (!activity) {
            return res.json({ status: 404, success: false, details: 'Actividad no encontrada' });
        }

        const existingGroup = activity.groups.find(group => group.name === nameGroup);
        if (!existingGroup) {
            return res.json({ status: 400, success: false, details: 'El grupo no existe dentro de la actividad' });
        }

        await existingGroup.deleteOne();

        res.json({ status: 200, success: true, details: 'Grupo eliminado' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.put('/groups/:organizationId/:activityId/:groupId', async (req, res) => {
    try {
        const { name, description, members, events, privacy, schedules } = req.body;
        const { organizationId, activityId, groupId } = req.params;

        const organization = await organizationModel.findById(organizationId);
        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        const activity = organization.activities.find(activity => activity._id == activityId);
        if (!activity) {
            return res.json({ status: 405, success: false, details: 'Actividad no encontrada' });
        }

        const updatedGroupIndex = activity.groups.findIndex(group => group._id.toString() === groupId);

        if (updatedGroupIndex === -1) {
            return res.json({ status: 407, success: false, details: 'Grupo no encontrado' });
        }
        
        const processSchedules = (schedules) => {
            return schedules.map(schedule => {
                const startTime = new Date(`1970-01-01T${schedule.startTime}`);
                const endTime = new Date(`1970-01-01T${schedule.endTime}`);
                const day = schedule.day;
                return { startTime, endTime, day };
            });
        };

        const updatedGroup = activity.groups[updatedGroupIndex];


        if (name) updatedGroup.name = name;
        if (description) updatedGroup.description = description;
        if (members) updatedGroup.members = members;
        if (events) updatedGroup.events = events;
        if (privacy) updatedGroup.privacy = privacy;
        if (schedules && schedules.length > 0) {
            const createdSchedules = await processSchedules(schedules);
            updatedGroup.schedules = createdSchedules;
        }

        

        activity.groups[updatedGroupIndex] = updatedGroup;

        

        await organization.save();

        return res.json({ status: 200, success: true, details: 'Grupo modificado correctamente', group: updatedGroup, organization });
    } catch (error) {
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});



module.exports = router;
