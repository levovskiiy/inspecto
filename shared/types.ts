export type ProjectConfig = {
  root: string;
  exclude: string[];
  include: string[];
};

export type ClientFunctions = object;
export type ServerFunctions = {
  scan(): Promise<ProjectScanInfo>;
};

export type ConnectionStatus = "idle" | "connected" | "error";

export type Backend = {
  status: Ref<ConnectionStatus>;
  connectionError: Ref<unknown>;
  connect(): void;
  functions: ServerFunctions;
};

export type ProjectScanInfo = {
  allFiles: Set<string>;
  fileDependencies: Map<string, Set<string>>;
  usedFiles: Set<string>;
  unusedFiles: Set<string>;
};
