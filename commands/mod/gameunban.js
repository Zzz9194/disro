const { Command } = require('discord.js-commando');

const { getServers } = require('./_servers');
const { unbanUser } = require('../../backend/server/router');
const { usernameToUserId } = require('../../backend/roblox');

const { permission } = require('../../backend/discord');

class GameUnbanCommand extends (Command) {
	constructor(client) {
		super(client, {
			name: 'gameunban',
			memberName: 'gameunban',
			aliases: ['gunban'],
			group: 'mod',
			description: 'Unban a player from the game',
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 30
			},
			args: [
				{
					key: 'target',
					prompt: 'Who do you wish to unban?',
					max: 20, min: 3,
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return permission(msg);
	}

	async run(msg, { target }) {

		let targetUid = await usernameToUserId(target);
		if (!targetUid) return msg.reply('Target user doesn\'t exist.');

		const targetName = targetUid.username;
		targetUid = targetUid.id;

		if (getServers().length <= 0) return msg.reply('There are no ongoing game servers to execute that request.');

		const res = await unbanUser({
			targetId: targetUid,
			targetName: targetName,
		});

		if (!res) return msg.reply('Failed to connect to the server.');
		else if (typeof res === 'string') return msg.reply(res);

		return msg.reply('Successfully unbanned user.');
	}

}

module.exports = GameUnbanCommand;