import * as ts from 'typescript';
import { BaseNodeResolver, NodeResolverBuilder } from './base';
import { IResolvedModule } from '../model/typescript';
import { ISymbol } from '../model/prism';

export class SourceFileNodeResolver extends BaseNodeResolver {
  private sourceFile: string;

  constructor(nodeResolverBuilder: NodeResolverBuilder) {
    super(nodeResolverBuilder);
    this.sourceFile = this._getFileName();
  }

  public resolve(): void {
    /**
     * Three import situations in resolvedModules:
     * 1. (Ignored) Built-in module import, e.g. import * as fs from 'fs';
     *    'fs' => undefined,
     * 2. (Ignored) External library import, e.g. import * as _ from 'lodash';
     *    'lodash' => {
     *      resolvedFileName: '${rootDir}/node_modules/@types/lodash/ts3.1/index.d.ts',
     *      originalPath: undefined,
     *      extension: '.d.ts',
     *      isExternalLibraryImport: true,
     *      packageId: [Object]
     *    },
     * 3. (Checked) Module in project import, e.g. import { B } from './core/b';
     *    './core/b' => {
     *      resolvedFileName: '${rootDir}/core/b.ts',
     *      originalPath: undefined,
     *      extension: '.ts',
     *      isExternalLibraryImport: false,
     *      packageId: undefined
     *    }
     **/
    const imports = new Set<string>();
    const resolvedModules: Map<string, IResolvedModule> = this.node['resolvedModules'];
    if (resolvedModules) {
      resolvedModules.forEach((resolvedModule: IResolvedModule | undefined) => {
        if (resolvedModule && !resolvedModule.isExternalLibraryImport) {
          imports.add(resolvedModule.resolvedFileName);
        }
      });
    }
    const symbols = this._getSymbols();
    this.network.addFile(this.sourceFile, imports, symbols);
  }

  private _getFileName(): string {
    return this.node['originalFileName'];
  }

  private _getSymbols(): Set<ISymbol> {
    const symbols = new Set<ISymbol>();
    this.node.locals.forEach((local: any) => {
      symbols.add({
        name: this._getSymbolName(local),
        type: this._isLocalSymbol(local) ? 'local' : 'ref',
      });
    });
    return symbols;
  }

  private _isLocalSymbol(symbol: any): boolean {
    return (symbol['flags'] !== ts.SymbolFlags.Alias)
      || !(symbol['flags'] === ts.SymbolFlags.BlockScopedVariable && symbol['valueDeclaration']);
  }

  private _getSymbolName(symbol: any): string {
    return symbol['escapedName'];
  }
}
