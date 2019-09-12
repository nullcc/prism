import * as ts from 'typescript';
import * as path from 'path';
import { BaseNodeResolver, NodeResolverBuilder } from './base';
import { ISymbol } from '../model/prism';

export class RequireCallNodeResolver extends BaseNodeResolver {
  constructor(nodeResolverBuilder: NodeResolverBuilder) {
    super(nodeResolverBuilder);
  }

  public resolve(): void {
    const args = this._getArgs();
    const requiredModulePath = args[0].text;
    if (this._isExternalLibrary(requiredModulePath)) { // ignore external library
      return;
    }
    const modulePath = this._getModule(requiredModulePath);
    const node = this.node as ts.Node;
    const sourceFile = node.getSourceFile()['originalFileName'];
    const imports = new Set<string>();
    imports.add(modulePath);
    this.network.addFile(sourceFile, imports, new Set<ISymbol>());
  }

  private _getArgs() {
    return this.node.arguments;
  }

  private _getModule(depRequiredPath: string): string {
    const node = this.node as ts.Node;
    const dir = path.dirname(node.getSourceFile()['originalFileName']);
    let depPath = path.resolve(dir, depRequiredPath);
    const ext = path.extname(depPath);
    if (!ext) {
      depPath = `${depPath}.ts`;
    }
    return depPath;
  }

  private _isExternalLibrary(depRequiredPath: string): boolean {
    return !depRequiredPath.includes('.');
  }
}
