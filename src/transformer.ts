import * as ts from 'typescript';
import { visitorEmitter } from './tracer';

export default (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      const visitor = (node: ts.Node): ts.Node => {
        return ts.visitEachChild(visitNode(node, program), visitor, ctx);
      };
      return <ts.SourceFile> ts.visitEachChild(visitNode(sourceFile, program), visitor, ctx);
    };
  };
}

const visitNode = (node: ts.Node, program: ts.Program): ts.Node => {
  emit(node, program);
  return node;
};

const emit = (node: ts.Node, program: ts.Program): void => {
  const typeChecker = program.getTypeChecker();
  if (isSourceFile(node, typeChecker)) {
    visitorEmitter.emit('SourceFile', node);
    return;
  }
  if (isRequireCallExpression(node, typeChecker)) {
    visitorEmitter.emit('RequireCall', node);
    return;
  }
};

const isSourceFile = (node: ts.Node, typeChecker: ts.TypeChecker): node is ts.SourceFile => {
  return ts.isSourceFile(node);
};

const isRequireCallExpression = (node: ts.Node, typeChecker: ts.TypeChecker): node is ts.CallExpression => {
  if (!ts.isCallExpression(node)) {
    return false;
  }
  const signature = typeChecker.getResolvedSignature(node);
  if (typeof signature === 'undefined') {
    return false;
  }
  const { declaration } = signature;
  return !!declaration
    && !ts.isJSDocSignature(declaration)
    && node.expression.getText() === 'require';
};
