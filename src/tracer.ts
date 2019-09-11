import * as events from 'events';
import { ResolverFactory } from './factory';
import { Network } from './network';

export const visitorEmitter = new events.EventEmitter();
export const network = new Network();
export const globalSymbols: Map<string, Set<string>> = new Map<string, Set<string>>();
export const dependencies: Map<string, Set<string>> = new Map<string, Set<string>>();

export const fn = (fileName: string, local: string) => {};

export const dfs = (fileName: string, fileLocal: string, fn: Function, visited: Map<string, boolean>) => {
  visited.set(fileName, true);
  fn(fileName, fileLocal);
  const fileDependencies: string[] = [];
  dependencies.forEach((v: Set<string>, k: string) => {
    if (v.has(fileName)) {
      fileDependencies.push(k)
    }
  });
  tree.set(fileName, fileDependencies);
  fileDependencies.forEach(fileDependency => {
    const b = dependencies.get(fileDependency);
    if (!b) {
      return;
    }
    if (b.has(fileName) && !visited.has(fileDependency)) {
      dfs(fileDependency, fileLocal, fn, visited)
    }
  });
};

export const tree: Map<string, string[]> = new Map<string, string[]>();

visitorEmitter.on('SourceFile', (node: any) => {
  const resolver = ResolverFactory.createResolver('SourceFile', node);
  const sourceFileDescriptor = resolver.resolve();
  network.addFile(sourceFileDescriptor);
});

visitorEmitter.on('RequireCall', (node: any) => {
  const resolver = ResolverFactory.createResolver('RequireCall', node);
  const sourceFileDescriptor = resolver.resolve();
  network.addFile(sourceFileDescriptor);
});
