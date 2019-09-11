export class BaseNodeResolver {
  protected node: any;

  constructor(node: any) {
    this.node = node;
  }

  public resolve(): any {};
}
