const { Command } = require('discord.js-commando');

const { banUser } = require('../../backend/server/router');
const { usernameToUserId } = require('../../backend/roblox');
const { getServerIdByPlayerId, getServers } = require('./_servers');

const { permission } = require('../../backend/discord');

class GameBanCommand extends (Command) {
	constructor(client) {
		super(client, {
			name: 'gameban',
			memberName: 'gameban',
			aliases: ['gban'],
			group: 'mod',
			description: 'Ban a player from the game',
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 30
			},
			args: [
				{
					key: 'target',
					prompt: 'Who do you wish to ban?',
					max: 20, min: 3,
					type: 'string'
				},
				{
					key: 'reason',
					prompt: 'Why are you banning them?',
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

		const targetName = targetUid.username;
		targetUid = targetUid.id;

		if (getServers().length <= 0) return msg.reply('There are no ongoing game servers to execute that request.');

		const serverId = getServerIdByPlayerId(targetUid);

		const res = await banUser(serverId, {
			targetName: targetName,
			targetId: targetUid,
			reason: reason
		});

		if (!res) return msg.reply('Failed to connect to the server.');
		else if (typeof res === 'string') return msg.reply(res);

		return msg.reply(`Successfully banned user ${ serverId ? `, also kicked from server \`${serverId}\`.` : '.' }`);

	}

}

module.exports = GameBanCommand;