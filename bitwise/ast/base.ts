/* eslint-disable max-classes-per-file */
export enum NodeTypes {
  SCRIPT,
  STRUCT,
  STRUCT_DEFINITION,
  STRUCT_DECLARATION,
  STRUCT_REFERENCE,
  PRIMITIVE_TYPE_FIELD,
  FIELD_MASK,
  OFFSET,
  MASK,
  COMMENT,
}

export interface HasByteLength {
  get byteLength(): number;
}

export abstract class ASTNode {
  readonly kind: NodeTypes;

  // eslint-disable-next-line no-use-before-define
  public children?: ASTNode[];

  constructor(kind: NodeTypes) {
    this.kind = kind;
  }

  public getChildren(): ASTNode[] {
    return this.children;
  }
}

export abstract class ASTNodeTerminal extends ASTNode {
  public getChildren(): ASTNode[] {
    return [];
  }
}
