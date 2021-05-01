const modRoleId = require("../config.json").moderationRoleId;

module.exports = {
    permission: function(msg) {
        if (modRoleId.trim() == "") return msg.client.isOwner(msg.author);
        else return msg.member.roles.keyArray().includes(modRoleId);
    }
}