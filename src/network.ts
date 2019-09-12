import * as _ from 'lodash';
import { ISourceFileNode, ISymbol } from './model/prism';

export class Network {
  private _network: Map<string, ISourceFileNode>;

  constructor() {
    this._network = new Map<string, ISourceFileNode>();
  }

  public addFile(sourceFile: string, imports: Set<string>, symbols: Set<ISymbol>) {
    const node = this._createSourceFileNode(sourceFile, imports, symbols);
    this._network.set(node.name, node);
  }

  public findImports(dir:string, filePath: string): string[] {
    const sourceFileNode = this._network.get(filePath);
    if (!sourceFileNode) {
      throw new Error(`File not found in network: ${filePath}`);
    }
    const depNodes = this._bfs(sourceFileNode);
    return _
      .chain(depNodes)
      .map(depNode => depNode.name.replace(dir, ''))
      .uniq()
      .value();
  }

  public dump() {
    return this._network;
  }

  private _createSourceFileNode(sourceFile: string, imports: Set<string>, symbols: Set<ISymbol>): ISourceFileNode {
    let node: ISourceFileNode = this._network.get(sourceFile);
    if (!node) {
      node = {
        name: sourceFile,
        imports: new Set<ISourceFileNode>(),
        symbols,
      };
    }
    imports.forEach((importedModule: string) => {
      const importedSourceFileNode = this._network.get(importedModule);
      if (importedSourceFileNode) {
        node.imports.add(importedSourceFileNode);
      } else {
        const importedModuleNode: ISourceFileNode = {
          name: importedModule,
          imports: new Set<ISourceFileNode>(),
          symbols: new Set<ISymbol>(),
        };
        this._network.set(importedModule, importedModuleNode);
        node.imports.add(importedModuleNode);
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
      node.imports.forEach(depNode => {
        if (!visited.has(depNode)) {
          q.push(depNode);
        }
      });
      visited.add(node);
    }
    return res;
  }
}
