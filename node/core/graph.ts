export class SimpleGraph<P> {
  nodes = new Set<string>();
  edges = new Map<string, Set<string>>();
  nodeProps = new Map<string, P>();

  computeReachableNodes() {
    const result = new Set<string>();

    for (const [parent, child] of this.edges) {
      if (child.size > 0) {
        result.add(parent);
        child.forEach((c) => result.add(c));
      }
    }

    return result;
  }

  computeUnreachableNodes() {
    const used = this.computeReachableNodes();
    const unused = new Set<string>();

    for (const node of this.nodes) {
      if (!used.has(node)) {
        unused.add(node);
      }
    }

    return unused;
  }

  addNode(value: string, props?: P) {
    if (!this.nodes.has(value)) {
      this.nodes.add(value);
    }

    if (!this.edges.has(value)) {
      this.edges.set(value, new Set());
    }

    if (props) {
      this.nodeProps.set(value, props);
    }

    return this;
  }

  addEdge(root: string, child: string) {
    this.addNode(root).addNode(child);

    const adjacentNodes = this.edges.get(root);
    if (adjacentNodes) {
      adjacentNodes.add(child);
    }

    return this;
  }
}
