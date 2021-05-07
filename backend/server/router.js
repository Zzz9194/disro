const rbxWebhookServer = require('./rbxwebhook');
const server = new rbxWebhookServer({ apiKey: require('../../config.json').serverApiKey });

const serversData = {};

server.on('connection', c => {

	console.log(`Connected to client ${c.id}`);

	c.on('disconnect', () => {
		if (serversData[c.id]) delete serversData[c.id];
		console.log(`Disconnected from client ${c.id}`);
	});

	c.on('allServerPlayers', data => {
		serversData[data.serverId] = data.players;
	});

	c.on('addServerPlayer', data => {
		serversData[data.serverId][data.player.userId] = data.player.username;
	});

	c.on('removeServerPlayer', data => {
		delete serversData[data.serverId][data.player.toString()];
	});

});

async function unbanUser(data) {
	const connection = server.connections[Object.keys(server.connections)[0]];

	connection.send('gameunban', data);

	return true;
}

async function kickUser(serverId, data) {
	const connection = server.connections[serverId];
	if (!connection) return 'Server wasn\'t found.';

	connection.send('gamekick', data);

	return true;
}

async function banUser(serverId, data) {
	let connection = server.connections[Object.keys(server.connections)[0]];

	if (serverId !== null && !!server.connections[serverId]) connection = server.connections[serverId];

	connection.send('gameban', data);

	return true;
}

module.exports = {
	router: server.router,
	kickUser: kickUser,
	banUser: banUser,
	unbanUser: unbanUser,
	servers: serversData
};
