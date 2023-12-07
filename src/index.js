import Websocket from 'ws'
import SocksProxyAgent from 'socks-proxy-agent'

/**
 * TorWebsocket
 * A class that extends ws to create a WebSocket instance that uses a SOCKS5 proxy for Tor.
 * @param {Object} opts - An object containing configuration options for creating a Tor-based WebSocket instance.
 * @returns {WebSocket} - A new WebSocket instance configured to use a SOCKS5 proxy for Tor.
 */
export class TorWebsocket extends Websocket {
  constructor(url, opts = {}){
    // Set default values if not provided
    socksHost = opts?.socksHost? opts.socksHost: '127.0.0.1';
    socksPort = opts?.socksPort? socksPort: 9050;
    enforceOnion = opts?.enforceOnion? enforceOnion: false;

    //Delete TorWebsocket options for Websocket options passthrough
    if(opts?.socksHost)     delete opts.socksHost 
    if(opts?.socksPort)     delete opts.socksPort
    if(opts?.enforceOnion)  delete opts.enforceOnion

    if( opts?.agent ) {
      console.warn(`TorWebsocket does not support the "agent" option since it instantiates its own agent, it will be unset now.`)
      delete opts.agent
    }
    
    if (!url) throw new Error('No URL provided');

    try {
      // Parse target URL to extract hostname, port, and protocol
      const ({ hostname: targetHostname, port: targetPort, protocol: targetProtocol } = new URL(targetUrl));
    }
    catch(e) {
      throw new Error(`URL malformed: ${e.message}`);
    }

    const isOnion = hostname.endsWith('.onion')

    if(enforceOnion && !isOnion){
      throw new Error('Hostname must end in ".onion"');
    }

    // Ensure the target protocol is either "ws:" or "wss:"
    if (targetProtocol !== 'ws:' && targetProtocol !== 'wss:') {
      throw new Error('Protocol must be "ws" or "wss"');
    }

    if(!targetPort){
      if(targetProtocol === 'ws:'){
        targetPort = 80;
      }
      else if(targetProtocol === 'wss:'){
        targetPort = 443;
      }
    }

    // Create an onion URL for the WebSocket connection
    const onionUrl = new URL(`${targetProtocol}://${targetHostname}:${targetPort}`).toString();

    // Create a SOCKS5 proxy agent
    const agent = new SocksProxyAgent({ hostname: socksHost, port: socksPort });

    // Create a new WebSocket instance configured with the SOCKS5 proxy agent
    super(onionUrl, isOnion? { agent, ...opts }: {});
  }
}