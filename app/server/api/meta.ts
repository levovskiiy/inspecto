import { startApplication } from "~~/node/backend";

const app = startApplication();

export default eventHandler(async (event) => {
  return (await app).config;
});
