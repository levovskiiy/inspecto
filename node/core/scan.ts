import fg from "fast-glob";
import type { ProjectConfig } from "~~/shared/types";
import { SimpleGraph } from "./graph";
import { extract } from "./extractor";
import type { Resolver } from "./resolver";

export class ProjectScanner {
  private readonly _graph = new SimpleGraph();

  constructor(
    private readonly _config: ProjectConfig,
    private readonly _resolver?: Resolver
  ) {}

  public async scan() {
    const scanner = await this._createScanner();

    const tasks = [];

    const result = [];
    for (const entry of scanner) {
      result.push(entry.path);
      this._graph.addNode(entry.path, entry);
      tasks.push(() => this._processFileTask(entry.path));
    }

    await Promise.all(tasks.map((t) => t()));

    return {
      allFiles: this._graph.nodes,
      fileDependencies: this._graph.edges,
      usedFiles: this._graph.computeReachableNodes(),
      unusedFiles: this._graph.computeUnreachableNodes(),
    };
  }

  private async _createScanner() {
    const scanner = await fg(this._config.include, {
      cwd: this._config.root,
      ignore: this._config.exclude,
      absolute: true,
      objectMode: true,
      onlyFiles: true,
    });

    return scanner;
  }

  private async _processFileTask(filePath: string) {
    const imports = await extract(filePath);
    if (imports == null) {
      return;
    }

    for (const item of imports) {
      this._graph.addNode(item).addEdge(filePath, item);
    }
  }
}
