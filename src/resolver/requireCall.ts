import * as ts from 'typescript';
import * as path from 'path';
import { BaseNodeResolver } from './base';
import { ISourceFileDescriptor } from '../interface';

export class RequireCallNodeResolver extends BaseNodeResolver {
  constructor(node: any) {
    super(node);
  }

  public resolve(): ISourceFileDescriptor {
    const args = this._getArgs();
    const depRequiredPath = args[0].text;
    const sourceFileDescriptor = this._createSourceFileDescriptor();
    if (this._isLibDep(depRequiredPath)) { // ignore lib require call
      return sourceFileDescriptor;
    }
    const depPath = this._getDepPath(depRequiredPath);
    sourceFileDescriptor.depPaths.add(depPath);
    return sourceFileDescriptor;
  }

  private _createSourceFileDescriptor(): ISourceFileDescriptor {
    const node = this.node as ts.Node;
    return {
      path: node.getSourceFile()['originalFileName'],
      depPaths: new Set<string>(),
    };
  }

  private _getArgs() {
    return this.node.arguments;
  }

  private _getDepPath(depRequiredPath: string): string {
    const node = this.node as ts.Node;
    const dir = path.dirname(node.getSourceFile()['originalFileName']);
    let depPath = path.resolve(dir, depRequiredPath);
    const ext = path.extname(depPath);
    if (!ext) {
      depPath = `${depPath}.ts`;
    }
    return depPath;
  }

  private _isLibDep(depRequiredPath: string): boolean {
    return !depRequiredPath.includes('.');
  }
}
