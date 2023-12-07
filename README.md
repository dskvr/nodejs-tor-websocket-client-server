## ws-tor
Simple wrapper for `ws` that implements `socks-proxy-agent` to simplify client connections to a websocket over tor. 

### Usage 
```js
var host = "aaaaaaaaaaaaaaaaaaaaaaaaaaa.onion";
var port = 1502;
// use require("./index.js") or whatever to import CreateTorWebSocket
var socket = CreateTorWebSocket(host, port);

socket.on('open', function () {
	console.log('"open" event!');
	socket.send('ping');
});

socket.on('message', function (data, flags) {
	console.log('received %j %j', data, flags);
	//socket.close();
});
```

### Server Example 
```js
var WebSocket = require('ws');
var server = new WebSocket.Server({
	port: 8080
});

var wsList = [];
server.on('connection', function($ws) {
	console.log("Connected!!")
	wsList.push($ws);
	// When you receive a message, send that message to every socket.
	$ws.on('message', function(msg) {
		console.log("Message received!!")
	});
	// When a socket closes, or disconnects, remove it from the array.
	$ws.on('close', function() {
		wsList = wsList.filter(s => s !== $ws);
	});
});
```
### Tor Configuration
You will need to have a tor daemon running with `HiddenServiceDir` and `HiddenServicePort` set, it's recommended to have `AvoidDiskWrites 1`. 

```c
AvoidDiskWrites 1
HiddenServiceDir EMPTY_DIR_PATH
HiddenServicePort 1502 8080
```

In the example above, 1502 is onion's hidden service port and 8080 is your server's port. Change where necessary.  