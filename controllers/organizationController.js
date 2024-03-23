// organizationsController.js

const { Organization } = require('../models/organizationModel.js');

const organizationsController = {
  createOrganization: async (req, res) => {
    try {
      const organization = await Organization.create(req.body);
      return res.status(200).json({ success: true, details: 'Organización creada correctamente', result: organization });
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

  getOrganizationActivities: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        const activities = await organization.getActivities();
        return res.status(200).json({ status: 200, success: true, details: 'La organización no tiene actividades', activities });
      } else {
        return res.status(404).json({ status: 404, success: false, details: 'Organización no encontrada' });
      }
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, details: 'Error interno del servidor' });
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
        return await organization.destroy();
        res.status(200).json({ success: true, details: 'Organización eliminada' });
      } else {
        return res.status(404).json({ success: false, details: 'Organización no encontrada' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, details: error.message });
    }
  }
};

module.exports = organizationsController;
