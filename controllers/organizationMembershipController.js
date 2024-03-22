const {OrganizationMembership} = require('../models/organizationMembershipModel');

const organizationMembershipController = {
    createOrganizationMembership: async (req, res) => {
        try {
        const organizationMembership = await OrganizationMembership.create(req.body);
        res.status(201).json(organizationMembership);
        } catch (error) {
        res.status(400).json({ error: error.message });
        }
    },
    
    getAllOrganizationMemberships: async (req, res) => {
        try {
        const organizationMemberships = await OrganizationMembership.findAll();
        if (organizationMemberships.length > 0) {
            res.json(organizationMemberships);
        } else {
            res.status(404).json({ error: 'No se encontraron membresías de organizaciones' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    getOrganizationMembershipById: async (req, res) => {
        try {
        const organizationMembership = await OrganizationMembership.findByPk(req.params.id);
        if (organizationMembership) {
            res.json(organizationMembership);
        } else {
            res.status(404).json({ error: 'Membresía de organización no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    
    updateOrganizationMembership: async (req, res) => {
        try {
        const organizationMembership = await OrganizationMembership.findByPk(req.params.id);
        if (organizationMembership) {
            await organizationMembership.update(req.body);
            res.json(organizationMembership);
        } else {
            res.status(404).json({ error: 'Membresía de organización no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },

    deleteOrganizationMembership: async (req, res) => {
        try {
        const organizationMembership = await OrganizationMembership.findByPk(req.params.id);
        if (organizationMembership) {
            await organizationMembership.destroy();
            res.json({ message: 'Membresía de organización eliminada' });
        } else {
            res.status(404).json({ error: 'Membresía de organización no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }   
};

module.exports = organizationMembershipController;