const modRoleId = require('../config.json').moderationRoleId;

module.exports = {
	permission: function(msg) {
		if (!msg.member) return false;

		if (modRoleId.trim() == '') return msg.client.isOwner(msg.author);
		else return msg.member.roles.cache.keyArray().includes(modRoleId);
	}
};