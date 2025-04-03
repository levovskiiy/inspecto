import { inject, injectable } from "@needle-di/core";
import { WebSocketServer, type WebSocket } from "ws";
import { RpcFunctions } from "./functions";
import { createBirpcGroup, type ChannelOptions } from "birpc";
import { ConfigService } from "./config";
import { parse, stringify } from "structured-clone-es";

@injectable()
export class ApplicationBootstrap {
  private static readonly _clients = new Set<WebSocket>();

  constructor(
    private rpcService = inject(RpcFunctions),
    private configSerice = inject(ConfigService)
  ) {}

  async start() {
    await this.configSerice.configure();
    const rpc = this.createRpc();

    const wsServer = new WebSocketServer({
      port: this.configSerice.config.port,
    });

    wsServer.on("connection", (ws) => {
      ApplicationBootstrap._clients.add(ws);

      const channel: ChannelOptions = {
        post: (d) => ws.send(d),
        on: (fn) => {
          ws.on("message", (data) => {
            fn(data);
          });
        },
        serialize: stringify,
        deserialize: parse,
      };

      rpc.updateChannels((c) => {
        c.push(channel);
      });

      ws.on("close", () => {
        ApplicationBootstrap._clients.delete(ws);

        rpc.updateChannels((c) => {
          const index = c.indexOf(channel);
          if (index >= 0) c.splice(index, 1);
        });
      });
    });

    const shotdown = () => {
      wsServer.close();
      for (const cl of ApplicationBootstrap._clients) {
        cl.close();
      }
    };

    process.on("SIGINT", shotdown);
    process.on("SIGTERM", shotdown);

    return {
      config: this.configSerice.config,
      wss: wsServer,
      rpc,
      functions: this.rpcService,
    };
  }

  private createRpc() {
    const funcs = {
      scan: async () => {
        return await this.rpcService.scan();
      },
    };

    return createBirpcGroup(funcs, [], {
      onFunctionError: (err, fn) => {
        console.error("RPC executing error on function: " + fn);
        console.error("Error:", err);
        throw err;
      },
    });
  }
}
