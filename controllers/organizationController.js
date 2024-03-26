

const { Organization } = require('../models/organizationModel.js');
const { User } = require('../models/userModel.js');
const { Activity } = require('../models/activityModel.js');
const { OrganizationMembership } = require('../models/organizationMembershipModel.js');

const organizationsController = {
  createOrganization: async (req, res) => {
    try {
      const  userId = req.params.userId;

      const existingOrganization = await Organization.findOne({ where: { name: req.body.name } });
      const user = await User.findByPk(userId);

      if (existingOrganization) {
        return res.status(404).json({ success: false, details: 'La organización ya existe' });
      }else if (!user) {
        return res.status(404).json({ success: false, details: 'El usuario no existe' });
      }

      const newOrganization = await Organization.create(req.body);

      await OrganizationMembership.create({ user_id: userId, organization_id: newOrganization.id, role: 'admin' });

      return res.status(200).json({ success: true, details: 'Organización creada', result: newOrganization });

    } catch (error) {
      return res.status(400).json({ success: false, details: error.message });
    }
  },



  getAllOrganizations: async (req, res) => {
    console.log("Enters");
    console.log("Organization: ", Organization)
    try {

      const organizations = await Organization.findAll();

      if (organizations.length > 0) {
        return res.status(200).json({ success: true, details: 'Organizaciones encontradas', result: organizations });
      } else {
        return res.status(404).json({ success: false, details: 'No se encontraron organizaciones' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, details: error.message });
    }
  },



  getOrganizationById: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        return res.status(200).json({ success: true, details: 'Organización encontrada', result: organization});
      } else {
        return res.status(404).json({ success: false, details: 'Organización no encontrada' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, details: error.message });
    }
  },

  getOrganizationsByName: async (req, res) => {
    try {
      const organizations = await Organization.findAll({
        where: { name: req.params.name }
      });

      if (organizations.length > 0) {
        return res.status(200).json({ success: true, details: 'Organizaciones encontradas', result: organizations });
      } else {
        return res.status(404).json({ success: false, details: 'No se encontraron organizaciones' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, details: error.message });
    }
  },

  getOrganizationActivities: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        const activities = await organization.getActivities();
        return res.status(200).json({ success: true, details: 'La organización no tiene actividades', result: activities});
      } else {
        return res.status(404).json({ success: false, details: 'Organización no encontrada' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, details: 'Error interno del servidor' });
    }
  },


  updateOrganization: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        await organization.update(req.body);
        return res.status(200).json({ success: true, details: 'Organización actualizada', result: organization });
      } else {
        return res.status(404).json({ success: false, details: 'Organización no encontrada' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, details: error.message });
    }
  },

  
  deleteOrganization: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        await organization.destroy();
        return res.status(200).json({ success: true, details: 'Organización eliminada' });
      } else {
        return res.status(404).json({ success: false, details: 'Organización no encontrada' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, details: error.message });
    }
  }
};

module.exports = organizationsController;
