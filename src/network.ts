import * as _ from 'lodash';
import { ISourceFileNode, ISourceFileDescriptor } from './interface';

export class Network {
  private _network: Map<string, ISourceFileNode>;

  constructor() {
    this._network = new Map<string, ISourceFileNode>();
  }

  public addFile(sourceFileDescriptor: ISourceFileDescriptor) {
    const node = this._createSourceFileNode(sourceFileDescriptor);
    this._network.set(node.path, node);
  }

  public findDeps(dir:string, filePath: string): string[] {
    const sourceFileNode = this._network.get(filePath);
    if (!sourceFileNode) {
      throw new Error(`File not found in network: ${filePath}`);
    }
    const depNodes = this._bfs(sourceFileNode);
    return _
      .chain(depNodes)
      .map(depNode => depNode.path.replace(dir, ''))
      .uniq()
      .value();
  }

  public dump(): Map<string, ISourceFileNode> {
    return this._network;
  }

  private _createSourceFileNode(sourceFileDescriptor: ISourceFileDescriptor): ISourceFileNode {
    let node = this._network.get(sourceFileDescriptor.path);
    if (!node) {
      node = {
        path: sourceFileDescriptor.path,
        deps: new Set<ISourceFileNode>(),
      };
    }
    sourceFileDescriptor.depPaths.forEach((depPath: string) => {
      const depSourceFileNode = this._network.get(depPath);
      if (depSourceFileNode) {
        node.deps.add(depSourceFileNode);
      } else {
        const depNode = {
          path: depPath,
          deps: new Set<ISourceFileNode>(),
        };
        this._network.set(depPath, depNode);
        node.deps.add(depNode);
      }
    });
    return node;
  }

  private _bfs(node: ISourceFileNode): ISourceFileNode[] {
    const res: ISourceFileNode[] = [];
    const visited = new Set<ISourceFileNode>();
    const q = [ node ];
    while (q.length > 0) {
      const node = q.shift();
      if (!visited.has(node)) {
        res.push(node);
      }
      node.deps.forEach(depNode => {
        if (!visited.has(depNode)) {
          q.push(depNode);
        }
      });
      visited.add(node);
    }
    return res;
  }
}
