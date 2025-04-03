export interface Resolver {
  resolve(root: string, request: string): string;
}

export class DefaultResolver implements Resolver {
  constructor() {}

  resolve(root: string, request: string): string {
    throw new Error("Method not implemented.");
  }
}
