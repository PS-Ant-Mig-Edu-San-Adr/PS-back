// organizationsController.js

const { Organization } = require('../models/organizationModel.js');

const organizationsController = {
  createOrganization: async (req, res) => {
    try {
      const organization = await Organization.create(req.body);
      res.status(201).json(organization);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },



  getAllOrganizations: async (req, res) => {
    console.log("Enters");
    console.log("Organization: ", Organization)
    try {
      console.log("Enters try");

      const organizations = await Organization.findAll();
      console.log("Organizations: ", organizations)

      if (organizations.length > 0) {
        res.json(organizations);
      } else {
        res.status(404).json({ error: 'No se encontraron organizaciones' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },



  getOrganizationById: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        res.json(organization);
      } else {
        res.status(404).json({ error: 'Organización no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  updateOrganization: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        await organization.update(req.body);
        res.json(organization);
      } else {
        res.status(404).json({ error: 'Organización no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  deleteOrganization: async (req, res) => {
    try {
      const organization = await Organization.findByPk(req.params.id);
      if (organization) {
        await organization.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Organización no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = organizationsController;
