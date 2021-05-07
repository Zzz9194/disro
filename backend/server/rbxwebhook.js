const REQUEST_VALITDITY_TIME = 55 * 1000; // 60s for game servers, none for studio (always assumes gameserver)

const EventEmitter = require('events');
const { performance } = require('perf_hooks');
const uuid = require('uuid');

const express = require('express');
const bodyParser = require('body-parser');

class Connection extends EventEmitter {
	constructor(serverId = null) {
		super();

		this.id = serverId ? serverId : uuid();

		this._queue = [];
	}

	send(target, data) {
		this._queue.push({ t: target, d: data });
		this._emptyQueue();
	}

	_emptyQueue(force) {
		if (
			force ||
			(this._req &&
				this._queue.length > 0 &&
				performance.now() - this._last <= REQUEST_VALITDITY_TIME)
		) {
			this._res.status(200).send(this._queue);

			this._req = null;
			this._res = null;

			this._queue.splice(0, this._queue.length);

			clearTimeout(this._timeout);
		}
	}

	onRequest(req, res) {
		this._req = req;
		this._res = res;

		this._last = performance.now();
		this._timeout = setTimeout(() => {
			if (this._res == res) {
				this._emptyQueue(true);
			}
		}, REQUEST_VALITDITY_TIME);

		this._emptyQueue();
	}
}

class rbxwebhookserver extends EventEmitter {
	constructor(options) {
		super();

		this.connections = {};
		this.options = options;

		const server = express.Router();

		function checkAuthentication(req, res, next) {
			if (options && options.apiKey) {
				const setKey = options.apiKey;
				const checkedKey = req.headers.authorization;

				if (setKey === checkedKey) next();
				else res.status(401).json({ error: 'Authentication failed.' });
		
			} else next();
		}

		server.get('/connect', checkAuthentication, (req, res) => {
			var connection = new Connection(req.headers.ServerId ? req.headers.ServerId : null);
			this.connections[connection.id] = connection;
			this.emit('connection', connection);

			res.status(201).json({ id: connection.id });
		});

		server.use((req, res, next) => {
			const connection = this.connections[req.headers['connection-id']]; // finds connection with cooresponding ID

			if (connection) {
				req.connection = connection;
				next();
			} else res.status(401).json({ error: 'Not connected' });
		});

		server.get('/disconnect', (req, res) => {
			req.connection.emit('disconnect');

			delete this.connections[req.connection.id];
			res.status(200).send('ok');
		});


		server.get('/data', (req, res) => {
			req.connection.onRequest(req, res);
		});

		server.post('/data', bodyParser.json(), (req, res) => {
			if (req.body.t) {
				req.connection.emit(req.body.t, req.body.d);
				res.status(200).send('ok');
			} else res.status(400).send({ error: 'Invalid target' });
		});

		this.router = server;
	}

	broadcast(target, data) {
		Object.keys(this.connections).forEach(id => {
			this.connections[id].send(target, data);
		});
	}
}

module.exports = rbxwebhookserver;