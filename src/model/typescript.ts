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
