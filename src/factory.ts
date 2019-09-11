import {
  BaseNodeResolver,
  SourceFileNodeResolver,
  RequireCallNodeResolver,
} from './resolver';

export type ResolverType = 'SourceFile' | 'RequireCall';

const RESOLVER_MAP = new Map<string, typeof BaseNodeResolver>();
RESOLVER_MAP.set('SourceFile', SourceFileNodeResolver);
RESOLVER_MAP.set('RequireCall', RequireCallNodeResolver);

export class ResolverFactory {

  static createResolver(type: ResolverType, node: any): BaseNodeResolver {
    const resolverClazz = RESOLVER_MAP.get(type);
    if (resolverClazz) {
      return new resolverClazz(node);
    }
  }
}
