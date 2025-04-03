import { Container } from "@needle-di/core";
import { ApplicationBootstrap } from "./app";

const app = new Container().get(ApplicationBootstrap);

export async function startApplication() {
  return await app.start();
}
