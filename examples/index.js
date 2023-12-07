var url = "aaaaaaaaaaaaaaaaaaaaaaaaaaa.onion:1502";
// use require("./index.js") or whatever to import CreateTorWebSocket
var socket = new TorWebsocket(url);

socket.on('open', function () {
	console.log('"open" event!');
	socket.send('ping');
});

socket.on('message', function (data, flags) {
	console.log('received %j %j', data, flags);
	//socket.close();
});