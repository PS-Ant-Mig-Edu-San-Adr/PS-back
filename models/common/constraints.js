const sequelize = require("../../config/database");

const setupConstraints = () => {
    let queryInterface = sequelize.getQueryInterface();

    queryInterface.removeConstraint('activities', 'unique_organization_activity_constraint').then(() => {
        console.log('Constraint removed from activities table');
    }).catch((error) => {
        console.error('Error removing constraint from activities table:', error);
    });

    queryInterface.addConstraint('activities', {
        fields: ['organization_id', 'name'],
        type: 'unique',
        name: 'unique_organization_activity_constraint'
    }).then(() => {
        console.log('Constraint added to activities table');
    }).catch((error) => {
        console.error('Error adding constraint to activities table:', error);
    });
};

module.exports = {
    setupConstraints
};
