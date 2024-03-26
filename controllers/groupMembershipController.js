const {GroupMembership} = require('../models/groupMembershipModel');
const {Group} = require('../models/groupModel');
const {User} = require('../models/userModel');
const {RoleEnum} = require('../models/common/enum');
const {ActivityMembership} = require('../models/activityMembershipModel');
const {Activity} = require('../models/activityModel');
const {OrganizationMembership} = require('../models/organizationMembershipModel');


const groupMembershipController = {
    createGroupMembership: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.groupId);
            const user = await User.findByPk(req.params.userId);
            if (!group || !user) {
                return res.status(404).json({ success: false, details: 'Grupo o usuario no encontrado' });
            }

            const existingGroupMembership = await GroupMembership.findOne({
                where: {
                    group_id: req.params.groupId,
                    user_id: req.params.userId
                }
            });

            if (existingGroupMembership) {
                return res.status(400).json({ success: false, details: 'El usuario ya es miembro del grupo' });
            }

            const newGroupMembership = await GroupMembership.create({
                group_id: req.params.groupId,
                user_id: req.params.userId,
                role: RoleEnum.Member
            });

            const activityMembership = await ActivityMembership.findOne({
                where: {
                    activity_id: group.activity_id,
                    user_id: req.params.userId
                }
            });

            if (!activityMembership) {
                await ActivityMembership.create({
                    activity_id: group.activity_id,
                    user_id: req.params.userId,
                    role: RoleEnum.Member
                });
            }

            const organizationMembership = await OrganizationMembership.findOne({
                where: {
                    organization_id: group.activity.organization_id,
                    user_id: req.params.userId
                }
            });

            if (!organizationMembership) {
                await OrganizationMembership.create({
                    organization_id: group.activity.organization_id,
                    user_id: req.params.userId,
                    role: RoleEnum.Member
                });
            }

            return res.status(200).json({ success: true, result: newGroupMembership, details: 'Membresía de grupo creada correctamente' });

        } catch (error) {
        res.status(400).json({ success: false, details: error.message });
        }
    },
    
    getAllGroupMemberships: async (req, res) => {
        try {
        const groupMemberships = await GroupMembership.findAll();
        if (groupMemberships.length > 0) {
            res.status(200).json({ success: true, details: 'Membresías de grupo encontradas', result: groupMemberships });
        } else {
            res.status(404).json({ success: false, details: 'No se encontraron membresías de grupo' });
        }
        } catch (error) {
        res.status(500).json({ success: false, details: error.message});
        }
    },
    
    getGroupMembershipById: async (req, res) => {
        try {
        const groupMembership = await GroupMembership.findByPk(req.params.id);
        if (groupMembership) {
            res.status(200).json({ success: true, result: groupMembership, details: 'Membresía de grupo encontrada' });
        } else {
            res.status(404).json({ success: false, details: 'Membresía de grupo no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ success: false, details: error.message });
        }
    },
    
    updateGroupMembership: async (req, res) => {
        try {
            const userId = req.params.userId;
            const groupId = req.params.groupId;

            const groupMembership = await GroupMembership.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId
                }
            });
            
            if (!groupMembership) {
                return res.status(404).json({ success: false, details: 'Membresía de grupo no encontrada' });
            }

            await groupMembership.update(req.body);
            return res.status(200).json({ success: true, result: groupMembership, details: 'Membresía de grupo actualizada' });

        } catch (error) {
        res.status(500).json({ success: false, details: error.message });
        }
    },

    deleteGroupMembership: async (req, res) => {
        try {
        const groupMembership = await GroupMembership.findByPk(req.params.id);
        if (groupMembership) {
            await groupMembership.destroy();
            res.status(200).json({ success: true, details: 'Membresía de grupo eliminada' });
        } else {
            res.status(404).json({ success: false, details: 'Membresía de grupo no encontrada' });
        }
        } catch (error) {
        res.status(500).json({ success: false, details: error.message });
        }
    }
};

module.exports = groupMembershipController;