import { ASTNode, NodeTypes } from "../ast/base";
import { DefinitionTable, StructFieldReference } from "../ast/types";

// eslint-disable-next-line no-console
export const debug = (...args) => process.env.DEBUG && console.log(...args);

export const snakeToCamel = (str: string) =>
  str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const findNodes = (root: ASTNode, predicate: (node: ASTNode) => boolean): ASTNode[] => {
  const visit = [root];
  const foundNodes = [];

  while (visit.length > 0) {
    const current = visit.shift();

    visit.push(...current.getChildren());

    if (predicate(current)) foundNodes.push(current);
  }

  return foundNodes;
};

export const attachDefinitionsToAST = (root: ASTNode, definitionTable: DefinitionTable) => {
  const references: ASTNode[] = findNodes(root, (n) => n.kind === NodeTypes.STRUCT_REFERENCE);

  references.forEach((node) => {
    const reference = node as StructFieldReference;
    reference.attachDefinition(definitionTable.get(reference.structName));
  });

  return root;
};
