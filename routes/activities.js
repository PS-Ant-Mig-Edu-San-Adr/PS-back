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


// Añadir un miembro a una actividad
// Añadir un miembro a una actividad y a la organización si no existe
router.post('/actividades/:id/addMember/:username', async (req, res) => {
    try {
        const { id, username } = req.params;
        const  member = req.body;

        console.log("Member: ", member, "Req:Body: ", req.body);

        if (member === undefined) {
            return res.json({ status: 400, success: false, details: 'Falta el miembro en el cuerpo de la solicitud' });
        }

        console.log("Member: ", req.body, "Id: ", id, "Username: ", username);
        console.log("MEMBER---------------");
        console.log(member);
        // Encuentra la organización que contiene la actividad
        const organization = await organizationModel.findOne({ "activities._id": id });
        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        // Encuentra la actividad dentro de la organización
        const activity = organization.activities.find(activity => activity._id.toString() === id);
        if (!activity) {
            return res.json({ status: 404, success: false, details: 'Actividad no encontrada' });
        }

        // Verifica si el usuario ya es miembro de la actividad

        const existingMember = activity.members.find(member => member.username === username);
        if (existingMember) {
            return res.json({ status: 400, success: false, details: 'El usuario ya es miembro de la actividad' });
        }

        console.log("Existing Member: ", existingMember);
        console.log("Member: ", member);

        // Agrega al nuevo miembro a la actividad
        activity.members.push(member);

        // Busca al usuario en la organización
        const existingUser = organization.members.find(member => member.username === username);
        if (!existingUser) {
            // Si el usuario no existe en la organización, agrégalo como nuevo miembro
            organization.members.push(member);
        }

        // Guarda los cambios en la organización
        await organization.save();

        return res.json({ status: 200, success: true, details: 'Miembro agregado correctamente a la actividad y a la organización', activity });
    } catch (error) {
        console.error('Error al agregar el miembro a la actividad y a la organización:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});



router.post('/activities/:id', async (req, res) => {
    try {
        const { name, description, groups, members, privacy } = req.body;
        const organizationId = req.params.id;
        
        const organization = await organizationModel.findById(organizationId);
        const organizationAdmins = organization.members.filter(member => member.role === 'admin');

        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        const existingActivity = organization.activities.find(activity => activity.name === name);
        if (existingActivity) {
            return res.json({ status: 400, success: false, details: 'La actividad ya existe dentro de la organización' });
        }

        // Agregar todos los adminMembers a newActivity
        const newActivityMembers= organizationAdmins;

        // Eliminar los duplicados de members
        members.forEach(member => {
            if (!newActivityMembers.some(admin => admin._id.toString() === member._id.toString())) {
                newActivityMembers.push(member);
            }
        });

        const newActivity = new activityModel({ name, description, groups, members: newActivityMembers, privacy });

        organization.activities.push(newActivity);

        await organization.save();

        return res.json({ status: 200, success: true, details: 'Actividad creada correctamente', activity: newActivity });
    } catch (error) {
        console.error('Error al crear la actividad:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});


// Actualizar una actividad existente
router.put('/activities/:organizationsId/:activityId', async (req, res) => {
    try {
        const { organizationsId, activityId } = req.params;
        const { name, description, groups, members, privacy } = req.body;

        const organization = await organizationModel.findById(organizationsId);

        // Busca la actividad por su ID
        const updatedActivity = organization.activities.find(activity => activity._id.toString() === activityId);

        if (!updatedActivity) {
            return res.status(404).json({ status: 404, success: false, details: 'Actividad no encontrada' });
        }

        // Actualiza las propiedades de la actividad si se proporcionan en el cuerpo de la solicitud
        if (name) updatedActivity.name = name;
        if (description) updatedActivity.description = description;
        if (groups) updatedActivity.groups = groups;

        if (members) {
            // Filtrar los miembros que tienen el rol 'admin'
            const adminMembers = members.filter(member => member.role === 'admin');

            // Recorrer los grupos actualizados de la actividad
            updatedActivity.groups.forEach(group => {
                // Filtrar los miembros 'admin' que no están en el grupo y agregarlos
                adminMembers.forEach(adminMember => {
                    if (group.members.some(member => member._id.toString() === adminMember._id.toString())) {
                        group.members.forEach(member => {
                            if (member._id.toString() === adminMember._id.toString()) {
                                member.role = adminMember.role;
                            }
                        });
                    } else {
                        group.members.push(adminMember);
                    }
                });
            });

            // Agregar todos los miembros a la actividad
            updatedActivity.members = members;

            // Agregar solo los miembros que no están en la organización
            members.forEach(member => {
                if (!organization.members.some(orgMember => orgMember._id.toString() === member._id.toString())) {
                    organization.members.push(member);
                }
            });
        }


        if (privacy) updatedActivity.privacy = privacy;

        await organizationModel.findByIdAndUpdate(organization._id, organization);

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


// Eliminar un miembro de una actividad
router.delete('/actividades/:id/removeMember/:username', async (req, res) => {
    try {
        const { id, username } = req.params;

        // Encuentra la organización que contiene la actividad
        const organization = await organizationModel.findOne({ "activities._id": id });
        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        // Encuentra la actividad dentro de la organización
        const activity = organization.activities.find(activity => activity._id.toString() === id);
        if (!activity) {
            return res.json({ status: 404, success: false, details: 'Actividad no encontrada' });
        }

        // Verifica si el usuario es miembro de la actividad
        const existingMemberIndex = activity.members.findIndex(member => member.username === username);
        if (existingMemberIndex === -1) {
            return res.json({ status: 400, success: false, details: 'El usuario no es miembro de la actividad' });
        }

        // Elimina al miembro de la actividad
        activity.members.splice(existingMemberIndex, 1);

        // Guarda los cambios en la organización
        await organization.save();

        return res.json({ status: 200, success: true, details: 'Miembro eliminado correctamente de la actividad', activity });
    } catch (error) {
        console.error('Error al eliminar el miembro de la actividad:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;
