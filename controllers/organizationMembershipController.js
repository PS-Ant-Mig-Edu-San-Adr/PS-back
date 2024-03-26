const { RoleEnum } = require('../models/common/enum');
const {OrganizationMembership} = require('../models/organizationMembershipModel');
const {Organization} = require('../models/organizationModel');
const {User} = require('../models/userModel');
const {ActivityMembership} = require('../models/activityMembershipModel');
const {GroupMembership} = require('../models/groupMembershipModel');


const organizationMembershipController = {
    createOrganizationMembership: async (req, res) => {
        try {
            const organization = await Organization.findByPk(req.params.organizationId);
            const user = await User.findByPk(req.params.userId);

            if (!organization || !user) {
                return res.status(404).json({ success: false, details: 'Organización o usuario no encontrados' });
            }

            const existingOrganizationMembership = await OrganizationMembership.findOne({
                where: {
                    organization_id: req.params.organizationId,
                    user_id: req.params.userId
                }
            });

            if (existingOrganizationMembership) {
                return res.status(400).json({ success: false, details: 'El usuario ya es miembro de la organización' });
            }

            const newOrganizationMembership = await OrganizationMembership.create({
                organization_id: req.params.organizationId,
                user_id: req.params.userId,
                role: RoleEnum.Member
            });

            return res.status(200).json({ success: true, result: newOrganizationMembership, details: 'Membresía de organización creada correctamente' });

        } catch (error) {
            return res.status(500).json({ success: false, details: error.message });
        }
    },
    
    getAllOrganizationMemberships: async (req, res) => {
        try {
        const organizationMemberships = await OrganizationMembership.findAll();
        if (organizationMemberships.length > 0) {
            res.json(organizationMemberships);
        } else {
            res.status(404).json({ success: false, details: 'No se encontraron membresías de organización'});
        }
        } catch (error) {
        res.status(500).json({ success: false, details: error.message});
        }
    },
    
    getOrganizationMembershipById: async (req, res) => {
        try {
        const organizationMembership = await OrganizationMembership.findByPk(req.params.id);
        if (organizationMembership) {
            res.json(organizationMembership);
        } else {
            res.status(404).json({ success: false, details: 'Membresía de organización no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ success: false, details: error.message });
        }
    },
    
    updateOrganizationMembership: async (req, res) => {
        try {
            const userId = req.params.userId;
            const organizationId = req.params.organizationId;

            const organizationMembership = await OrganizationMembership.findOne({
                where: {
                    organization_id: organizationId,
                    user_id: userId
                }
            });

            if (!organizationMembership) {
                return res.status(404).json({ success: false, details: 'Membresía de organización no encontrada' });
            }

            if (req.body.role === RoleEnum.Admin) {
                const activities = await organizationMembership.getOrganizationActivities();
                for (const activity of activities) {
                    
                    const activityMembership = await ActivityMembership.findOne({
                        where: {
                            activity_id: activity.id,
                            user_id: userId
                        }
                    });

                    if (!activityMembership) {
                        await ActivityMembership.create({
                            activity_id: activity.id,
                            user_id: userId,
                            role: RoleEnum.Admin
                        });
                    }else{
                        await activityMembership.update({ role: 'admin' });
                    }

                    const groups = await activity.getGroups();

                    for (const group of groups) {
                        
                        const groupMembership = await GroupMembership.findOne({
                            where: {
                                group_id: group.id,
                                user_id: userId
                            }
                        });

                        if (!groupMembership) {
                            await GroupMembership.create({
                                group_id: group.id,
                                user_id: userId,
                                role: RoleEnum.Admin
                            });
                        }else{
                            await groupMembership.update({ role: 'admin' });
                        }
                    }
                }

            }

            await organizationMembership.update(req.body);
            return res.status(200).json({ success: true, result: organizationMembership, details: 'Membresía de organización actualizada correctamente' });

        } catch (error) {
        res.status(500).json({ success: false, details: error.message });
        }
    },

    deleteOrganizationMembership: async (req, res) => {
        try {
        const userId = req.params.userId;
        const organizationId = req.params.organizationId;

        const organizationMembership = await OrganizationMembership.findOne({
            where: {
                organization_id: organizationId,
                user_id: userId
            }
        });

        if (!organizationMembership) {
            return res.status(404).json({ success: false, details: 'Membresía de organización no encontrada' });
        }

        const activities = await organizationMembership.getOrganizationActivities();
        for (const activity of activities) {
            const activityMembership = await ActivityMembership.findOne({
                where: {
                    activity_id: activity.id,
                    user_id: userId
                }
            });
            await activityMembership.destroy();
            const groups = await activity.getGroups();
            for (const group of groups) {
                const groupMembership = await GroupMembership.findOne({
                    where: {
                        group_id: group.id,
                        user_id: userId
                    }
                });
                await groupMembership.destroy();
            }
        }

        await organizationMembership.destroy();
        return res.status(200).json({ success: true, details: 'Membresía de organización eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, details: error.message });
    }
    }   
};

module.exports = organizationMembershipController;