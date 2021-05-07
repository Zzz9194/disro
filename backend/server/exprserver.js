const app = require('express')();

app.use('/rbxwebhook', require('./router.js').router);

app.get('/', async (req, res) => {
	res.send({ status: true });
});

module.exports = {
	start: () => app.listen(3000).once('listening', () => console.log('Server up!')),
};
