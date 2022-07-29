const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 5444});

wss.getUniqueID = function () {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	
	return s4() + s4() + '-' + s4();
};


wss.on('connection', function connection(ws) {
	ws.id = wss.getUniqueID();
	
	ws.send(JSON.stringify({type: 'auth', token: ws.id}));
	
	wss.clients.forEach(function each(client) {
		console.log('Client.ID: ' + client.id);
	});
	
	ws.onmessage = (message) => {
		console.log("message received from :", ws.id, message.data)
		wss.clients.forEach(function each(client) {
			if (client.id !== ws.id && client.readyState === WebSocket.OPEN) {
				client.send(message.data);
			} else {
				// SI le client est pas la -> direct dans les logs
			}
		});
	};
	// TODO chercher dans les log le dernier timestamp de différent
});

const updateClients = (message) => {

};
