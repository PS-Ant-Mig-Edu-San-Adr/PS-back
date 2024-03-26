const {Group} = require('../models/groupModel');
const {Activity} = require('../models/activityModel');
const {User} = require('../models/userModel');
const {GroupMembership} = require('../models/groupMembershipModel');
const {ActivityMembership} = require('../models/activityMembershipModel');

const groupController = {
    createGroup: async (req, res) => {
        try {
            const activityId = req.params.activityId;
            const userId = req.params.userId;

            const activity = await Activity.findByPk(activityId);
            if (!activity) {
                return res.status(404).json({ success: false, details: 'Actividad no encontrada' });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, details: 'Usuario no encontrado' });
            }

            const newGroup = await activity.createGroup({
                name: req.body.name,
                description: req.body.description,
                privacy: req.body.privacy
            });

            const activityAdmins = await ActivityMembership.findAll({
                where: {
                    activity_id: activityId,
                    role: 'admin'
                }
            });

            await Promise.all(activityAdmins.map(async (admin) => {
                await GroupMembership.create({
                    user_id: admin.user_id,
                    group_id: newGroup.id,
                    role: 'admin'
                });
            }));

            await GroupMembership.create({
                user_id: userId,
                group_id: newGroup.id,
                role: 'admin'
            });

            return res.status(200).json({success: true, details: "Grupo creado correctamente", result: newGroup});
            
        } catch (error) {
            res.status(400).json({ success: false, details: error.message });
        }
    },
    
    getAllGroups: async (req, res) => {
        try {
            const groups = await Group.findAll();
            if (groups.length > 0) {
                res.status(200).json({ success: true, details: 'Grupos encontrados', result: groups });
            } else {
                res.status(404).json({ success: false, details: 'No se encontraron grupos' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    },
    
    getGroupById: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (group) {
                res.status(200).json({ success: true, details: 'Grupo encontrado', result: group});
            } else {
                res.status(404).json({ success: false, details: 'Grupo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    },

    getGroupEvents: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.groupId);
            if (!group) {
                return res.status(404).json({ success: false, details: 'Grupo no encontrado'});
            }

            const events = await group.getEvents();
            res.status(200).json({ success: true, details: 'Eventos encontrados', result: events });

        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    },
    
    updateGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (group) {
                await group.update(req.body);
                res.status(200).json({ success: true, details: 'Grupo actualizado', result: group });
            } else {
                res.status(404).json({ success: false, details: 'Grupo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    },
    
    deleteGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (group) {
                await group.destroy();
                res.status(200).json({ success: true, details: 'Grupo eliminado' });
            } else {
                res.status(404).json({ success: false, details: 'Grupo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, details: error.message });
        }
    }
};


module.exports = groupController;