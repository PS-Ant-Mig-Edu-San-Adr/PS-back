const {Activity} = require('../models/activityModel.js');
const {Organization} = require('../models/organizationModel.js');
const {ActivityMembership} = require('../models/activityMembershipModel.js');
const {OrganizationMembership} = require('../models/organizationMembershipModel.js');
const {RoleEnum} = require("../models/common/enum");
const {User} = require('../models/userModel');


const activityController = {
    createActivity: async (req, res) => {
        try {
            const organizationId = req.params.organizationId;
            const userId = req.params.userId;

            const organization = await Organization.findByPk(organizationId);
            if (!organization) {
                return res.status(404).json({success: false, details: 'Organización no encontrada'});
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({success: false, details: 'Usuario no encontrado'});
            }

            const newActivity = await organization.createActivity({
                name: req.body.name,
                description: req.body.description,
                privacy: req.body.privacy
            });

            const organizationAdmins = await OrganizationMembership.findAll({
                where: {
                    organization_id: organizationId,
                    role: 'admin'
                }
            });

            // Crear membresía de actividad para cada administrador de la organización
            await Promise.all(organizationAdmins.map(async (admin) => {
                await ActivityMembership.create({
                    user_id: admin.user_id,
                    activity_id: newActivity.id,
                    role: 'admin'
                });
            }));

            // FIXME: Replace userId with the userId obtained from tokens middleware
            await ActivityMembership.create({
                    user_id: userId,
                    activity_id: newActivity.id,
                    role: RoleEnum.Admin
                }
            );

            return res.status(200).json({
                success: true,
                details: "Actividad creada correctamente",
                result: newActivity
            });
        } catch (error) {
            return res.status(500).json({success: false, details: error.message});
        }
    },

    getAllActivities: async (req, res) => {
        try {
            const activities = await Activity.findAll();
            if (activities.length > 0) {
                return res.status(200).json({success: true, result: activities, details: 'Actividades encontradas'});
            } else {
                return res.status(404).json({success: false, details: 'No se encontraron actividades'});
            }
        } catch (error) {
            return res.status(500).json({success: false, details: error.message});
        }
    },

    getActivityById: async (req, res) => {
        try {
            const activity = await Activity.findByPk(req.params.id);
            if (activity) {
                return res.status(200).json({success: true, result: activity, details: 'Actividad encontrada'});
            } else {
                return res.status(404).json({success: false, details: 'Actividad no encontrada'});
            }
        } catch (error) {
            return res.status(500).json({success: false, details: error.message});
        }
    },

    updateActivity: async (req, res) => {
        try {
            const activity = await Activity.findByPk(req.params.id);
            if (activity) {
                await activity.update(req.body);
                return res.status(200).json({success: true, details: 'Actividad actualizada', result: activity});
            } else {
                return res.status(404).json({success: false, details: 'Actividad no encontrada'});
            }
        } catch (error) {
            return res.status(500).json({success: false, details: error.message});
        }
    },

    deleteActivity: async (req, res) => {
        try {
            const activity = await Activity.findByPk(req.params.id);
            if (activity) {
                await activity.destroy();
                return res.json({success: true, details: 'Actividad eliminada'});
            } else {
                return res.status(404).json({success: false, details: 'Actividad no encontrada'});
            }
        } catch (error) {
            return res.status(500).json({success: false, details: error.message});
        }
    }
};

module.exports = activityController;

