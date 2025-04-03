import { isObject } from "~~/shared";

type Visitor<T extends object> = (node: T) => void;

export function simpeASTTraverse<T extends object>(
  ast: T,
  visitor: Visitor<T>
): void {
  const visited = new Set();

  const traverse = (node: T | Array<T>) => {
    if (visited.has(node)) {
      return;
    }

    visited.add(node);

    if (Array.isArray(node)) {
      for (const item of node) {
        if (isObject(item)) {
          traverse(node);
        }
      }
    } else if (isObject(node)) {
      visitor(node);

      for (const value of Object.values(node)) {
        if (value) {
          traverse(value);
        }
      }
    }
  };

  traverse(ast as never);
}
