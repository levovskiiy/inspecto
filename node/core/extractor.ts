import micromatch from "micromatch";
import { type Node } from "@babel/types";
import { readFile } from "node:fs/promises";
import { parseJavaScript } from "./parsers";
import { simpeASTTraverse } from "./traverse";

type Analyzer = (content: string) => string[];

const SUPPORTED: Readonly<Record<string, Analyzer>> = Object.freeze({
  "*/**.{js,ts,tsx,jsx,mjs}": extractImportsFromJavaScript,
  "*/**.{vue}": analyzeVue,
});

export async function extract(fullPath: string) {
  const match = micromatch.match([fullPath], Object.keys(SUPPORTED));
  if (!match || match.length === 0) {
    return null;
  }

  const extractor = SUPPORTED[match[0]];
  const content = await readFile(fullPath, "utf8");
  return extractor(content);
}

function extractImportsFromJavaScript(content: string): string[] {
  const ast = parseJavaScript(content);

  const result: string[] = [];
  simpeASTTraverse<Node>(ast, (node) => {
    switch (node.type) {
      case "ImportDeclaration":
      case "ExportNamedDeclaration":
      case "ExportAllDeclaration":
        if (node.source) {
          result.push(node.source.value);
        }

        break;
      case "CallExpression":
        if (
          node.callee.type === "Import" &&
          node.arguments.length > 0 &&
          node.arguments[0].type === "StringLiteral"
        ) {
          result.push(node.arguments[0].value);
        }

        break;
    }
  });

  return result;
}

function analyzeVue(content: string): string[] {
  return [];
}
