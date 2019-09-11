import * as ts from 'typescript';
import { BaseNodeResolver } from './base';
import { globalSymbols } from '../tracer';
import { IResolvedModule, ISourceFileDescriptor } from '../interface';

export class SourceFileNodeResolver extends BaseNodeResolver {
  private filePath: string;
  private resolvedModules: Map<string, IResolvedModule>;

  constructor(node: any) {
    super(node);
    this.filePath = this._getFilePath();
    this.resolvedModules = this._getResolvedModules();
  }

  public resolve(): ISourceFileDescriptor {
    this._init();
    this._extractSymbolFromSourceFile();
    return this._createSourceFileDescriptor();
  }

  private _getFilePath(): string {
    return this.node['originalFileName'];
  }

  private _getResolvedModules(): Map<string, IResolvedModule> {
    return this.node['resolvedModules'] || new Map<string, IResolvedModule>();
  }

  private _init(): void {
    if (!globalSymbols.has(this.filePath)) {
      globalSymbols.set(this.filePath, new Set<string>());
    }
  }

  private _extractSymbolFromSourceFile(): void {
    const fileLocals = globalSymbols.get(this.filePath);
    this.node.locals.forEach((local: any) => {
      if (!this._isLocalSymbol(local)) {
        return;
      }
      fileLocals.add(this._getSymbolName(local));
    });
  }

  private _createSourceFileDescriptor(): ISourceFileDescriptor {
    const sourceFileDescriptor: ISourceFileDescriptor = {
      path: this.filePath,
      depPaths: new Set<string>(),
    };
    this.resolvedModules.forEach((resolvedModule: IResolvedModule) => {
      if (resolvedModule && resolvedModule.resolvedFileName.indexOf('node_modules') === -1) {
        sourceFileDescriptor.depPaths.add(resolvedModule.resolvedFileName);
      }
    });
    return sourceFileDescriptor;
  }

  private _isLocalSymbol(symbol: any): boolean {
    return symbol['flags'] !== ts.SymbolFlags.Alias;
  }

  private _getSymbolName(symbol: any): string {
    return symbol['escapedName'];
  }
}
