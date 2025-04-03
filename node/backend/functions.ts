import { ProjectScanner } from "../core";
import type { ServerFunctions } from "~~/shared";
import { injectable } from "@needle-di/core";

@injectable()
export class RpcFunctions implements ServerFunctions {
  private readonly _scanner: ProjectScanner;

  constructor() {
    this._scanner = new ProjectScanner({
      root: process.cwd(),
      include: ["*/**"],
      exclude: ["node_modules"],
    });
  }

  async scan() {
    return await this._scanner.scan();
  }
}
