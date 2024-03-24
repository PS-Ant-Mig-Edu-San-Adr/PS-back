// routes.js

const express = require('express');
const router = express.Router();
const organizationController = require('./controllers/organizationController');
const activityController = require('./controllers/activityController');
const eventController = require('./controllers/eventController');
const reminderController = require('./controllers/reminderController');
const groupController = require('./controllers/groupController');
const organizationMembershipController = require('./controllers/organizationMembershipController');
const activityMembershipController = require('./controllers/activityMembershipController');
const groupMembershipController = require('./controllers/groupMembershipController');
const userController = require('./controllers/userController');


// Organizaciones
router.get('/organizations', organizationController.getAllOrganizations);
router.get('/organizations/:id', organizationController.getOrganizationById);
router.get('/organizations/:id/activities', organizationController.getOrganizationActivities);
router.post('/organizations', organizationController.createOrganization);
router.put('/organizations/:id', organizationController.updateOrganization);
router.delete('/organizations/:id', organizationController.deleteOrganization);


// Actividades
router.get('/activities', activityController.getAllActivities);
router.get('/activities/:id', activityController.getActivityById);
router.post('/activities/:organizationId/:userId', activityController.createActivity);
router.put('/activities/:id', activityController.updateActivity);
router.delete('/activities/:id', activityController.deleteActivity);


// Eventos
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

// Recordatorios
router.get('/reminders', reminderController.getAllReminders);
router.get('/reminders/:id', reminderController.getReminderById);
router.post('/reminders', reminderController.createReminder);
router.put('/reminders/:id', reminderController.updateReminder);
router.delete('/reminders/:id', reminderController.deleteReminder);


// Grupos
router.get('/groups', groupController.getAllGroups);
router.get('/groups/:id', groupController.getGroupById);
router.post('/groups', groupController.createGroup);
router.put('/groups/:id', groupController.updateGroup);
router.delete('/groups/:id', groupController.deleteGroup);

// Membresías de organización
router.get('/organization-memberships', organizationMembershipController.getAllOrganizationMemberships);
router.get('/organization-memberships/:id', organizationMembershipController.getOrganizationMembershipById);
router.post('/organization-memberships', organizationMembershipController.createOrganizationMembership);
router.put('/organization-memberships/:id', organizationMembershipController.updateOrganizationMembership);
router.delete('/organization-memberships/:id', organizationMembershipController.deleteOrganizationMembership);

// Membresías de actividad
router.get('/activity-memberships', activityMembershipController.getAllActivityMemberships);
router.get('/activity-memberships/:id', activityMembershipController.getActivityMembershipById);
router.post('/activity-memberships/:activitiId/:userId', activityMembershipController.createActivityMembership);
router.put('/activity-memberships/:activitiId/:userId', activityMembershipController.updateActivityMembership);
router.delete('/activity-memberships/:activitiId/:userId', activityMembershipController.deleteActivityMembership);

// Membresías de grupo
router.get('/group-memberships', groupMembershipController.getAllGroupMemberships);
router.get('/group-memberships/:id', groupMembershipController.getGroupMembershipById);
router.post('/group-memberships', groupMembershipController.createGroupMembership);
router.put('/group-memberships/:id', groupMembershipController.updateGroupMembership);
router.delete('/group-memberships/:id', groupMembershipController.deleteGroupMembership);


// Usuarios
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/:id/activities', userController.getUserActivities);
router.get('/users/:id/reminders', userController.getUserReminders);
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);


module.exports = router;
