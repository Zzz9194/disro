const { Command } = require('discord.js-commando');

const { kickUser } = require('../../backend/server/router');
const { usernameToUserId } = require('../../backend/roblox');
const { getServerIdByPlayerId, getServers } = require('./_servers');

const { permission } = require('../../backend/discord');

class GameKickCommand extends (Command) {
	constructor(client) {
		super(client, {
			name: 'gamekick',
			memberName: 'gamekick',
			aliases: ['gkick'],
			group: 'mod',
			description: 'Kick someone in a game',
			guildOnly: true,
			args: [
				{
					key: 'target',
					prompt: 'Who do you wish to kick?',
					max: 20, min: 3,
					type: 'string'
				},
				{
					key: 'reason',
					prompt: 'Why are you kicking them?',
					max: 60,
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return permission(msg);
	}

	async run(msg, { target, reason }) {

		let targetUid = await usernameToUserId(target);
		if (!targetUid) return msg.reply('Target user doesn\'t exist.');

		targetUid = targetUid.id;

		if (getServers().length <= 0) return msg.reply('There are no ongoing game servers.');

		const serverId = getServerIdByPlayerId(targetUid);

		if (!serverId) return msg.reply('Target isn\'t in a server.');

		const res = await kickUser(serverId, { targetId: targetUid, reason: reason });

		if (!res) return msg.reply('Failed to connect to the server.');
		else if (typeof res === 'string') return msg.reply(res);

		return msg.reply(`Successfully kicked in server \`${serverId}\`.`);

	}

}

module.exports = GameKickCommand;