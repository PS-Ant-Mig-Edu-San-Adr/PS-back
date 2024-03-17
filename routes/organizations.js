const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const organizationModel = require('../models/organizacionModel');


router.post('/organizaciones/:username', async (req, res) => {
    try {
        
        const { username } = req.params;
        const { name, description, contact, email, domain, privacy } = req.body;

        const organizacion = await organizationModel.findOne({ name: name });
        const user = await userModel.findOne({ username });

        if (organizacion) {
            return res.json({ status: 404, success: false, details: 'Organization does already exists' });
        }else if (!user) {
            return res.json({ status: 405, success: false, details: 'User not found' });
        }

        const newOrganizacion = new organizationModel({
            name: name,
            description: description,
            contact: contact,
            email: email,
            privacy: privacy,
            members: [{ _id: user._id, role: "admin", email: user.email, name: user.fullName, username: user.username }],
            domain: domain
        });

        await newOrganizacion.save();
        return res.json({ status: 200, success: true, details: 'The organization was created succesfully' });
    
    } catch (error) {
        console.error('Error al crear la  organizacion:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.get('/organizaciones', async (req, res) => {
    try {
        const organizations = await organizationModel.find();

        console.log("Organizations: ", organizations);

        if (!organizations || organizations.length === 0) {
            return res.json({ status: 404, success: false, details: 'No se encontraron organizaciones' });
        }

        return res.json({ status: 200, success: true, details: 'Organizaciones encontradas correctamente', organizations });
    } catch (error) {
        console.error('Error al encontrar las organizaciones:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

// Endpoint para obtener organizaciones por username
router.get('/organizaciones/:username', async (req, res) => {
    try {
        const { username } = req.params;
        // Encuentra el usuario por username para obtener su ID
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ success: false, details: 'Usuario no encontrado' });
        }

        // Encuentra todas las organizaciones donde el usuario es miembro y tiene rol de admin
        const organizations = await organizationModel.find({
            'members': {
                $elemMatch: { '_id': user._id, 'role': 'admin' }
            }
        });

        if (!organizations || organizations.length === 0) {
            return res.status(404).json({ success: false, details: 'No se encontraron organizaciones para este usuario' });
        }

        return res.json({ success: true, organizations: organizations });
    } catch (error) {
        console.error('Error al buscar las organizaciones:', error);
        return res.status(500).json({ success: false, details: 'Error interno del servidor' });
    }
});

router.get('/organizaciones/byName/:name', async (req, res) => {
    try {
        console.log("Received: ", req)
        const { name } = req.params;

        const organizations = await organizationModel.find({ name: { $regex: new RegExp(name, 'i') } });

        if (!organizations || organizations.length === 0) {
            return res.json({ status: 404, success: false, details: 'Organizaciones no encontradas' });
        }

        return res.json({ status: 200, success: true, details: 'Organizaciones encontradas correctamente', organizations });
    } catch (error) {
        console.error('Error al encontrar las organizaciones:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});


router.get('/organizaciones/byId/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const organization = await organizationModel.findById(id);

        if (!organization) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        } 

        return res.json({ status: 200, success: true, details: 'Organizacion encontrada correctamente', organizacion: organization });
    } catch (error) {
        console.error('Error al encontrar la  organizacion:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});


router.put('/organizaciones/:id' , async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, members, roles, 
            contact, email, domain, organizations, privacy,
            activityId, groupId } = req.body;

        const updatedOrganizacion = await organizationModel.findById(id);

        if (!updatedOrganizacion) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        if(name) updatedOrganizacion.name = name;
        if(description) updatedOrganizacion.description = description;
        if(contact) updatedOrganizacion.contact = contact;
        if(email) updatedOrganizacion.email = email;
        if(domain) updatedOrganizacion.domain = domain;
        if(privacy) updatedOrganizacion.privacy = privacy;

        if (members) {
            const adminMembers = members.filter(member => member.role === 'admin');
            updatedOrganizacion.activities.forEach(activity => {
                activity.groups.forEach(group => {
                    adminMembers.forEach(adminMember => {
                        if (!group.members.some(member => member._id === adminMember._id)) {
                            group.members.push(adminMember);
                        }
                    });
                });
                adminMembers.forEach(adminMember => {
                    if (!activity.members.some(member => member._id === adminMember._id)) {
                        activity.members.push(adminMember);
                    }
                });
            });
            updatedOrganizacion.members = members;
        }
        

        console.log(updatedOrganizacion)
        
        if(organizations) updatedOrganizacion.organizations = organizations;

        await updatedOrganizacion.save();

        return res.json({ status: 200, success: true, details: 'Organización actualizada correctamente', activity: updatedOrganizacion });
    } catch (error) {
        console.error('Error al actualizar la actividad:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});



router.delete('/organizaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await activityModel.findByIdAndDelete(id);
        return res.json({ status: 200, success: true, details: 'Organización eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la organización:', error);
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

module.exports = router;