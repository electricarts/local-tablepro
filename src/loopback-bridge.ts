import net, { type Server, type Socket } from 'node:net';

interface ActiveBridge {
  endpoint: string;
  peers: Set<Socket>;
  ready: Promise<number>;
  server: Server;
}

export class LoopbackBridgePool {
  private readonly active = new Map<string, ActiveBridge>();

  async acquire(siteId: string, endpoint: string): Promise<number> {
    const current = this.active.get(siteId);
    if (current?.endpoint === endpoint) {
      return current.ready;
    }
    if (current) {
      await this.release(siteId);
    }

    const peers = new Set<Socket>();
    const server = net.createServer((downstream) => {
      const upstream = net.createConnection(endpoint);
      peers.add(downstream);
      peers.add(upstream);

      const discard = (socket: Socket) => peers.delete(socket);
      downstream.once('close', () => discard(downstream));
      upstream.once('close', () => discard(upstream));
      downstream.once('error', () => upstream.destroy());
      upstream.once('error', () => downstream.destroy());
      downstream.pipe(upstream);
      upstream.pipe(downstream);
    });

    const bridge: ActiveBridge = {
      endpoint,
      peers,
      ready: Promise.resolve(0),
      server,
    };

    bridge.ready = new Promise<number>((resolve, reject) => {
      const failed = (error: Error) => {
        if (this.active.get(siteId) === bridge) {
          this.active.delete(siteId);
        }
        reject(error);
      };

      server.once('error', failed);
      server.listen({ host: '127.0.0.1', port: 0 }, () => {
        server.off('error', failed);
        server.on('error', (error) => {
          console.error('[local-tablepro] Loopback bridge failure.', error);
          for (const peer of peers) {
            peer.destroy();
          }
        });
        const address = server.address();
        if (!address || typeof address === 'string') {
          failed(new Error('The loopback bridge did not receive a TCP port.'));
          return;
        }
        resolve(address.port);
      });
    });

    this.active.set(siteId, bridge);
    return bridge.ready;
  }

  async release(siteId: string): Promise<void> {
    const bridge = this.active.get(siteId);
    if (!bridge) {
      return;
    }

    this.active.delete(siteId);
    try {
      await bridge.ready;
    } catch {
      return;
    }

    for (const peer of bridge.peers) {
      peer.destroy();
    }
    bridge.peers.clear();

    if (bridge.server.listening) {
      await new Promise<void>((resolve) => bridge.server.close(() => resolve()));
    }
  }

  async releaseAll(): Promise<void> {
    await Promise.all([...this.active.keys()].map((siteId) => this.release(siteId)));
  }
}
