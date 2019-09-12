import {
  BaseNodeResolver,
  NodeResolverBuilder,
  SourceFileNodeResolver,
  RequireCallNodeResolver,
} from './resolver';
import { Network } from './network';

export type ResolverType = 'SourceFile' | 'RequireCall';

const RESOLVER_MAP = new Map<string, typeof BaseNodeResolver>();
RESOLVER_MAP.set('SourceFile', SourceFileNodeResolver);
RESOLVER_MAP.set('RequireCall', RequireCallNodeResolver);

export class ResolverFactory {

  static createResolver(type: ResolverType, node: any, network: Network): BaseNodeResolver {
    const resolverCls = RESOLVER_MAP.get(type);
    if (!resolverCls) {
      throw new Error(`Resolver not found: ${type}!`);
    }
    const builder = new NodeResolverBuilder();
    return builder
      .setNodeResolverCls(resolverCls)
      .setNode(node)
      .setNetwork(network)
      .build();
  }
}
