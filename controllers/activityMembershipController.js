const { ActivityMembership } = require('../models/activityMembershipModel');
const { OrganizationMembership } = require('../models/organizationMembershipModel');
const { GroupMembership } = require('../models/groupMembershipModel');
const { Activity } = require('../models/activityModel');
const { User } = require('../models/userModel');
const { or } = require('sequelize');

const activityMembershipController = {
    createActivityMembership: async (req, res) => {
        try {
            
            const activity = await Activity.findByPk(req.params.activityId);
            const user = await User.findByPk(req.params.userId);
            if (!activity || !user) {
                return res.status(404).json({ succes: false, details: 'Actividad o usuario no encontrados' });
            }

            const existingActivityMembership = await ActivityMembership.findOne({
                where: {
                    activity_id: req.params.activityId,
                    user_id: req.params.userId
                }
            });

            if (existingActivityMembership) {
                return res.status(400).json({ success: false, details: 'El usuario ya es miembro de la actividad' });
            }

            const newActivityMembership = await ActivityMembership.create({
                activity_id: req.params.activityId,
                user_id: req.params.userId,
                role: req.body.role
            });

            const organizationMembership = await OrganizationMembership.findOne({
                where: {
                    organization_id: activity.organization_id,
                    user_id: req.params.userId
                }
            });

            if (!organizationMembership) {
                await OrganizationMembership.create({
                    organization_id: activity.organization_id,
                    user_id: req.params.userId,
                    role: 'member'
                });
            }

            return res.status(200).json({ success: true, result: newActivityMembership, details: 'Membresía de actividad creada correctamente'});
        } catch (error) {
            return res.status(500).json({success: false, error: error.message});
        }
    },

    getAllActivityMemberships: async (req, res) => {
        try {
            const activityMemberships = await ActivityMembership.findAll();
            if (activityMemberships.length > 0) {
                return res.status(200).json({ success: true, result: activityMemberships, details: 'Membresías de actividades encontradas'});
            } else {
                return res.status(404).json({ success: false, details: 'No se encontraron membresías de actividades' });
            }
        } catch (error) {
            return res.status(500).json({success: false, details: error.message });
        }
    },

    getActivityMembershipById: async (req, res) => {
        try {
            const activityMembership = await ActivityMembership.findByPk(req.params.id);
            if (activityMembership) {
                return res.status(200).json({ success: true, result: activityMembership, details: 'Membresía de actividad encontrada' });
            } else {
                return res.status(404).json({ success: false, details: 'Membresía de actividad no encontrada' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, details: error.message });
        }
    },

    updateActivityMembership: async (req, res) => {
        try {
            const userId = req.params.userId;
            const activityId = req.params.activityId;

            const activityMembership = await ActivityMembership.findOne({
                where: {
                    user_id: userId,
                    activity_id: activityId
                }
            });

            if (!activityMembership) {
                return res.status(404).json({ success: false, details: 'Membresía de actividad no encontrada' });
            }

            if(req.body.role === 'admin') {
                const groups = await activityMembership.getGroups();
                for (let i = 0; i < groups.length; i++) {
                    const groupMembership = await GroupMembership.findOne({
                        where: {
                            user_id: userId,
                            group_id: groups[i].id
                        }
                    });

                    if (!groupMembership) {
                        await GroupMembership.create({
                            user_id: userId,
                            group_id: groups[i].id,
                            role: 'admin'
                        });
                    } else {
                        await groupMembership.update({ role: 'admin' });
                    }
                }
            }

            await activityMembership.update(req.body);
            return res.status(200).json({ success: true, result: activityMembership, details: 'Membresía de actividad actualizada correctamente' });
            
        } catch (error) {
            return res.status(500).json({ success: false, details: error.message });
        }
    },

    deleteActivityMembership: async (req, res) => {
        try {
            const userId = req.params.userId;
            const activityId = req.params.activityId;

            const activityMembership = await ActivityMembership.findOne({
                where: {
                    user_id: userId,
                    activity_id: activityId
                }
            });

            if (!activityMembership) {
                return res.status(404).json({ success: false, details: 'Membresía de actividad no encontrada' });
            }

            const groups = await activityMembership.getGroups();
            for (let i = 0; i < groups.length; i++) {
                const groupMembership = await GroupMembership.findOne({
                    where: {
                        user_id: userId,
                        group_id: groups[i].id
                    }
                });

                if (groupMembership) {
                    await groupMembership.destroy();
                }
            }

            await activityMembership.destroy();
            return res.status(200).json({ success: true, details: 'Membresía de actividad eliminada correctamente' });
        } catch (error) {
            return res.status(500).json({ success: false, details: error.message});
        }
    }
};

module.exports = activityMembershipController;