import { parse } from "@babel/parser";

/**
 * Parse source javaScript
 * @param {string} source source code
 * @param {string} ext extname file for select parser
 * @returns AST TREE (babel impl)
 */
export function parseJavaScript(source: string) {
  return parse(source, {
    plugins: ["jsx", "typescript"],
  });
}

/**
 * Parse vue SFC source. Reducing all styles and script blocks
 * @param {string} source source code
 * @returns Script and Style blocks
 */
export function parseVue(source: string): string[] {
  return [];
}

export function parseSCSS(source: string): string[] {
  return [];
}

export function parseCSS(source: string): string[] {
  return [];
}

export function parseStyl(source: string): string[] {
  return [];
}

export function parseSass(source: string): string[] {
  return [];
}
