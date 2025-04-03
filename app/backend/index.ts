import { createBirpc, type BirpcReturn } from "birpc";
import { parse, stringify } from "structured-clone-es";
import type { Backend, ClientFunctions, ServerFunctions } from "~~/shared";

function createWebSocketBackend(url: string): Backend {
  let status: Backend["status"] = ref("idle");
  let error: Backend["connectionError"] = ref(undefined);

  let connectPromise: Promise<WebSocket> | undefined;
  let onMessage: any = () => {};

  const clientFunctions = {} as ClientFunctions;

  const rpc = createBirpc<ServerFunctions, ClientFunctions>(clientFunctions, {
    post: async (d) => {
      if (!connectPromise) connectPromise = connect();
      const ws = await connectPromise;
      while (ws.readyState === ws.CONNECTING) {
        await new Promise<void>((resolve) => setTimeout(resolve, 100));
      }
      if (ws.readyState !== ws.OPEN) {
        error.value ||= new Error(
          "WebSocket not open, message sending dismissed"
        );
        throw error;
      }
      ws.send(d);
    },
    on: (fn) => {
      onMessage = fn;
    },
    serialize: stringify,
    deserialize: parse,
    onError(err, name) {
      error.value = err;
      console.error(
        `[node-modules-inspector] RPC error on executing "${name}":`
      );
      console.error(err);
    },
    timeout: 120_000,
  });

  async function connect() {
    try {
      const ws = new WebSocket(url);

      ws.addEventListener("close", () => {
        status.value = "idle";
      });
      ws.addEventListener("open", () => {
        status.value = "connected";
        error.value = undefined;
      });
      ws.addEventListener("error", (e) => {
        status.value = "error";
        error.value = e;
      });
      ws.addEventListener("message", (e) => {
        status.value = "connected";
        error.value = undefined;
        onMessage(e.data);
      });

      return ws;
    } catch (e) {
      status.value = "error";
      error.value = e;
      throw e;
    }
  }

  return {
    status,
    connectionError: error,
    async connect() {
      if (!connectPromise) connectPromise = connect();
      await connectPromise;
    },
    functions: {
      scan: async () => {
        return await rpc.scan();
      },
    },
  };
}

export async function createBackend() {
  const meta = await $fetch("api/meta");
  const url = `${location.protocol.replace("http", "ws")}//${
    location.hostname
  }:${meta.port}`;

  return createWebSocketBackend(url);
}
