import Websocket from 'ws'
import SocksProxyAgent from 'socks-proxy-agent'

/**
 * TorWebsocket
 * 
 * @param {Object} opts - An object containing configuration options for creating a Tor-based WebSocket instance.
 * @returns {WebSocket} - A new WebSocket instance configured to use a SOCKS5 proxy for Tor.
 */
export const TorWebsocket = (url, opts = {}) => {
	// Set default values if not provided
	socksHost = opts?.socksHost? opts.socksHost: '127.0.0.1';
	socksPort = opts?.socksPort? socksPort: 9050;
	
  if (!url) throw new Error('No URL provided');

	try {
		// Parse target URL to extract hostname, port, and protocol
		({ hostname: targetHostname, port: targetPort, protocol: targetProtocol } = new URL(targetUrl));
	}
	catch(e) {
		throw new Error(`URL malformed: ${e.message}`);
	}

  // Ensure the target protocol is either "ws:" or "wss:"
  if (targetProtocol !== 'ws:' && targetProtocol !== 'wss:') {
    throw new Error('Protocol must be "ws" or "wss"');
  }

  // Create an onion URL for the WebSocket connection
  const onionUrl = new URL(`${targetProtocol}://${targetHostname}:${targetPort}`).toString();

  // Create a SOCKS5 proxy agent
  const socks5Agent = new SocksProxyAgent({ hostname: socksHost, port: socksPort });

  // Create and return a new WebSocket instance configured with the SOCKS5 proxy agent
  return new WebSocket(onionUrl, { agent: socks5Agent });
}