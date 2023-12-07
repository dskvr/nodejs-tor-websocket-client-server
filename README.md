## ws-tor
A simple class that extends `ws` by implementing `socks-proxy-agent` in the constructor to simplify the use of Tor and Websockets. 

### Usage 
```js
import Websocket from 'ws-tor'

const ws_tor_opts = { socksHostname: "127.0.0.1", socksPort: "9050", enforceOnion: false }
var socket = new Websocket("ws://abc...xyz.onion:1502", ws_tor_opts);

socket.on('open', function () {
	console.log('ws opened');
	socket.send('ping');
});

socket.on('message', console.log);
```

### Options 
- `socksHostname` _(default: `127.0.0.1`)_: The hostname of the Tor SOCKS proxy.
- `socksPort` _(default: `9050`)_: The port of the Tor SOCKS proxy. 
- `enforceOnion` _(default: `false`)_: If set to `true`, it will only connect to onion addresses.
- All `ws` [options](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback) are passed through to `ws` constructor **except `agent`**

### Tor Configuration
You will need to have a tor daemon running with `HiddenServiceDir` and `HiddenServicePort` set, it's recommended to have `AvoidDiskWrites 1` set as well. 

```c
AvoidDiskWrites 1
HiddenServiceDir EMPTY_DIR_PATH
HiddenServicePort 1502 8080
```

In the example above, 1502 is onion's hidden service port and 8080 is your server's port. Change where necessary.  

### Server Configuration
Nothing special about the server, but to test this you'll obviously need to expose a HiddenService via a tor daemon. Below is a run of the mill server implementation that will work with the client example. You can learn more about onion services [here](https://community.torproject.org/onion-services/setup/)

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
		console.log("pong")
	});
	// When a socket closes, or disconnects, remove it from the array.
	$ws.on('close', function() {
		wsList = wsList.filter(s => s !== $ws);
	});
});
```

### Acknowledgements 
Thanks to SlowsieNT for [nodejs-tor-websocket-client-server](https://github.com/SlowsieNT/nodejs-tor-websocket-client-server)

