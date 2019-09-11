export interface IResolvedModule {
  resolvedFileName: string;
  originalPath: string | undefined;
  extension: string;
  isExternalLibraryImport: boolean;
  packageId: IPackageId | undefined;
}

export interface IPackageId {
  name: string;
  subModuleName: string;
  version: string;
}

export interface ISourceFileDescriptor {
  path: string;
  depPaths: Set<string>;
}

export interface ISourceFileNode {
  path: string;
  deps: Set<ISourceFileNode>;
}
