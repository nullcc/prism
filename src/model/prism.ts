export interface ISourceFileNode {
  name: string;
  imports: Set<ISourceFileNode>;
  symbols: Set<ISymbol>;
}

export interface ISymbol {
  name: string;
  type: 'local' | 'ref';
}
