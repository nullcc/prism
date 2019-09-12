import { Network } from '../network';

export class BaseNodeResolver {
  protected node: any;
  protected network: Network;

  constructor(nodeResolverBuilder: NodeResolverBuilder) {
    this.node = nodeResolverBuilder.node;
    this.network = nodeResolverBuilder.network;
  }

  public resolve(): void {};
}

export class NodeResolverBuilder {
  private _nodeResolverCls: typeof BaseNodeResolver;
  private _node: any;
  private _network: Network;

  public build(): BaseNodeResolver {
    return new this._nodeResolverCls(this);
  }

  get nodeResolverCls(): typeof BaseNodeResolver {
    return this._nodeResolverCls;
  }

  get node(): any {
    return this._node;
  }

  get network(): Network {
    return this._network;
  }

  public setNodeResolverCls(nodeResolverCls: typeof BaseNodeResolver): NodeResolverBuilder {
    this._nodeResolverCls= nodeResolverCls;
    return this;
  }

  public setNode(node: any): NodeResolverBuilder {
    this._node= node;
    return this;
  }

  public setNetwork(network: Network): NodeResolverBuilder {
    this._network = network;
    return this;
  }
}
