const {Membership} = require('../models/organizationMembershipModel');

const membershipController = {
    createMembership: async (req, res) => {
        try {
            const membership = await Membership.create(req.body);
            res.status(201).json(membership);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    getAllMemberships: async (req, res) => {
        try {
            const memberships = await Membership.findAll();
            if (memberships.length > 0) {
                res.json(memberships);
            } else {
                res.status(404).json({ error: 'No se encontraron membresías' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getMembershipById: async (req, res) => {
        try {
            const membership = await Membership.findByPk(req.params.id);
            if (membership) {
                res.json(membership);
            } else {
                res.status(404).json({ error: 'Membresía no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updateMembership: async (req, res) => {
        try {
            const membership = await Membership.findByPk(req.params.id);
            if (membership) {
                await membership.update(req.body);
                res.json(membership);
            } else {
                res.status(404).json({ error: 'Membresía no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    deleteMembership: async (req, res) => {
        try {
            const membership = await Membership.findByPk(req.params.id);
            if (membership) {
                await membership.destroy();
                res.json({ message: 'Membresía eliminada' });
            } else {
                res.status(404).json({ error: 'Membresía no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = membershipController;