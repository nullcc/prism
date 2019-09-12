import * as events from 'events';
import { ResolverFactory } from './factory';
import { Network } from './network';

export const astVisitorEmitter = new events.EventEmitter();
export const network = new Network();

astVisitorEmitter.on('data', ({ type, node }) => {
  const resolver = ResolverFactory.createResolver(type, node, network);
  resolver.resolve();
});
