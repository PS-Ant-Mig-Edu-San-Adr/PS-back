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
            members: [{ _id: user._id, role: "admin" }],
            domain: domain
        });

        await newOrganizacion.save();
        return res.json({ status: 200, success: true, details: 'The organization was created succesfully' });
    
    } catch (error) {
        console.error('Error al crear la  organizacion:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});


router.get('/organizaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const organizacion = await organizacionModel.findById(id);

        if (!organizacion) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        } 

        return res.json({ status: 200, success: true, details: 'Organizacion encontrada correctamente', organizacion });
    } catch (error) {
        console.error('Error al encontrar la  organizacion:', error);
        return res.json({ status: 500, success: false, details: 'Error interno del servidor' });
    }
});

router.put('/organizaciones/:id' , async (req, res) => {
    try {
        const { id } = req.params;
        const { selectedName, selectedDescription, selectedMembers, selectedRoles, 
            selectedContact, selectedEmail, selectedWebsite, selectedOrganizations, selectedPrivacy } = req.body;

        const updatedOrganizacion= await organizationModel.findByIdAndUpdate(id, { selectedName, selectedDescription, selectedMembers, selectedRoles, 
            selectedContact, selectedEmail, selectedWebsite, selectedOrganizations, selectedPrivacy }, { new: true });

        if (!updatedOrganizacion) {
            return res.json({ status: 404, success: false, details: 'Organización no encontrada' });
        }

        return res.json({ status: 200, success: true, details: 'Actividad actualizada correctamente', activity: updatedActivity });
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