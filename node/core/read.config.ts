import { existsSync, readFileSync } from "fs";
import { join } from "pathe";

export function readTSConfig(path: string) {
  const tsConfigPath = join(path, "tsconfig.json");
  const jsConfigPath = join(path, "jsconfig.json");

  let config: unknown | undefined;
  if (existsSync(tsConfigPath)) {
    config = readConfig(tsConfigPath);
  } else if (existsSync(jsConfigPath)) {
    config = readConfig(jsConfigPath);
  }

  if (!config) {
    throw new Error("not found tsconfig or jsconfig for parse aliases");
  }

  return config;
}

const STRIP_REGEXP = /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g;

function readConfig(path: string) {
  let content = readFileSync(path, "utf8");
  content = content.replace(STRIP_REGEXP, "");

  return JSON.parse(content);
}
