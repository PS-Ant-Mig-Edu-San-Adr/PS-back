const User = require('../userModel');
const Activity = require('../activityModel');
const Event = require('../eventModel');
const Reminder = require('../reminderModel');
const Group = require('../groupModel');
const OrganizationMembership = require('../organizationMembershipModel'); 
const ActivityMembership = require('../activityMembershipModel');
const GroupMembership = require('../groupMembershipModel');
const Organization = require('../organizationModel');

// ------------------------USER
User.hasMany(Reminder, { foreignKey: 'user_id', sourceKey: 'id' });
User.hasMany(OrganizationMembership, { foreignKey: 'user_id', sourceKey: 'id' });
User.hasMany(ActivityMembership, { foreignKey: 'user_id', sourceKey: 'id' });
User.hasMany(GroupMembership, { foreignKey: 'user_id', sourceKey: 'id' });

// ------------------------ORGANIZATION
Organization.belongsTo(Organization, { foreignKey: 'parent_organization_id', as: 'ParentOrganization' });
Organization.hasMany(Organization, { foreignKey: 'parent_organization_id', as: 'ChildOrganizations' });
Organization.hasMany(Activity, { foreignKey: 'organization_id', sourceKey: 'id', as: 'activities' });
Organization.hasMany(OrganizationMembership, { foreignKey: 'organization_id', sourceKey: 'id' });

// ------------------------ACTIVITY
Activity.belongsTo(Organization, { foreignKey: 'organization_id', sourceKey: 'id', as: 'organization'});
Activity.hasMany(Group, { foreignKey: 'activity_id', sourceKey: 'id'});
Activity.hasMany(ActivityMembership, { foreignKey: 'activity_id', sourceKey: 'id' });

// ------------------------GROUP
Group.hasMany(Event, { foreignKey: 'group_id', sourceKey: 'id'});
Group.belongsTo(Activity, { foreignKey: 'activity_id', sourceKey: 'id'});
Group.belongsTo(Organization, { foreignKey: 'organization_id', sourceKey: 'id'});
Group.hasMany(GroupMembership, { foreignKey: 'group_id', sourceKey: 'id' });


// ------------------------EVENT
Event.belongsTo(Group, { foreignKey: 'group_id', sourceKey: 'id'});

// ------------------------REMINDER
Reminder.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' });


// ------------------------ORGANIZATION MEMBERSHIP
OrganizationMembership.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id'});
OrganizationMembership.belongsTo(Organization, { foreignKey: 'organization_id', sourceKey: 'id'});

// ------------------------ACTIVITY MEMBERSHIP
ActivityMembership.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id'});
ActivityMembership.belongsTo(Activity, { foreignKey: 'activity_id', sourceKey: 'id'});

// ------------------------GROUP MEMBERSHIP
GroupMembership.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id'});
GroupMembership.belongsTo(Group, { foreignKey: 'group_id', sourceKey: 'id'});




