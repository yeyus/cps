/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import util from "util";
import ts, { Node, NodeFlags, SyntaxKind, createPrinter, factory } from "typescript";
import { BitwiseActionDict } from "./bitwise.ohm-bundle";
import { Field, FieldMask, Struct, TypeToken } from "./ast_types";
import { optionalExp } from "./to_ast";

class CodeEmmit {
  public imports: ts.ImportDeclaration[];

  public classes: ts.ClassDeclaration[];

  public fields: ts.PropertyDeclaration[];

  public decodeStatements: ts.Statement[];

  public encodeStatements: ts.Statement[];

  constructor() {
    this.imports = [];
    this.classes = [];
    this.fields = [];
    this.decodeStatements = [];
    this.encodeStatements = [];
  }
}

const TYPE_CONVERSION: Record<TypeToken, ts.KeywordTypeNode> = {
  bit: factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
  u8: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  i8: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  u16: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  i16: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  ul16: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  il16: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  u24: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  i24: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  ul24: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  il24: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  u32: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  i32: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  ul32: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  il32: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  bbcd: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  lbcd: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  char: factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
};

export function print(node: Node, fileName: string): string {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const sourceFile = ts.createSourceFile(
    fileName,
    "",
    ts.ScriptTarget.Latest,
    false, // setParentNodes
    ts.ScriptKind.TS,
  );

  // console.log(util.inspect(node, false, null, true));
  return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
}

export function createFromCodeEmmit(codeEmmit: CodeEmmit): string {
  const statements = [
    ...codeEmmit.imports.filter((statement) => statement != null),
    ...codeEmmit.classes.filter((statement) => statement != null),
  ];

  const sourceFile = factory.createSourceFile(
    statements,
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printFile(sourceFile);
}

const snakeToCamel = (str: string) =>
  str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toTS: BitwiseActionDict<any> = {
  Script(exps) {
    const codeEmmit = new CodeEmmit();

    const childrenCodeEmmits: CodeEmmit[] = exps.children.map((c) => c.toTS("<internal>"));

    // import BitView
    codeEmmit.imports = [
      factory.createImportDeclaration(
        undefined,
        factory.createImportClause(false, factory.createIdentifier("BitView"), undefined),
        factory.createStringLiteral("../bitview"),
        undefined,
      ),
      ...childrenCodeEmmits.flatMap((ce) => ce.imports),
    ];

    const className = `${this.args.name}MemoryMap`;
    console.log(`rule Script => className=${className}`);
    codeEmmit.classes = [
      ...childrenCodeEmmits.flatMap((ce) => ce.classes),
      factory.createClassDeclaration(
        [factory.createToken(ts.SyntaxKind.ExportKeyword)],
        factory.createIdentifier(className),
        undefined,
        undefined,
        [
          // class body
          // fields - propertydeclarations
          ...childrenCodeEmmits.flatMap((ce) => ce.fields),
          // fromBuffer
          factory.createMethodDeclaration(
            [factory.createToken(ts.SyntaxKind.PublicKeyword), factory.createToken(ts.SyntaxKind.StaticKeyword)],
            undefined,
            factory.createIdentifier("fromBuffer"),
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createIdentifier("buffer"),
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier("Uint8Array"), undefined),
                undefined,
              ),
            ],
            factory.createTypeReferenceNode(factory.createIdentifier(className), undefined),
            factory.createBlock(
              [
                factory.createVariableStatement(
                  undefined,
                  factory.createVariableDeclarationList(
                    [
                      factory.createVariableDeclaration(
                        factory.createIdentifier("memoryMap"),
                        undefined,
                        undefined,
                        factory.createNewExpression(factory.createIdentifier(className), undefined, []),
                      ),
                    ],
                    ts.NodeFlags.Const | ts.NodeFlags.Constant | ts.NodeFlags.Constant,
                  ),
                ),
                // decodeStatements
                ...childrenCodeEmmits.flatMap((ce) => ce.decodeStatements),
                factory.createReturnStatement(factory.createIdentifier("memoryMap")),
              ],
              true,
            ),
          ),
        ],
      ),
    ];

    // cant emmit fields
    // cant emmit decodeStatements
    // cant emmit encodeStatements

    return codeEmmit;
  },
  /*
    StructExp = DirectiveExp? "struct" "{" Exp+ "}" fieldName ("[" length "]")? ";"
  */
  StructExp(directiveExp, _arg1, _arg2, exps, _arg4, fieldnameExp, _arg6, lengthExp, _arg8, _arg9) {
    const ast: Struct = this.toAST();
    const codeEmmit = new CodeEmmit();

    const childrenCodeEmmits: CodeEmmit[] = exps.children.map((c) => c.toTS("<internal>"));

    codeEmmit.imports = childrenCodeEmmits.flatMap((ce) => ce.imports);

    const fieldName = snakeToCamel(fieldnameExp.toTS(""));
    const className = `MemoryMap${capitalize(fieldName)}`;
    const length = optionalExp(lengthExp)?.toTS("");
    const isArrayOfStruct = lengthExp.numChildren > 0;

    console.log(`rule StructExp => fielName=${fieldName} className=${className}`);

    codeEmmit.classes = [
      factory.createClassDeclaration(
        [factory.createToken(ts.SyntaxKind.ExportKeyword)],
        factory.createIdentifier(className),
        undefined,
        undefined,
        [
          ast.offset != null
            ? factory.createPropertyDeclaration(
                [factory.createToken(ts.SyntaxKind.PublicKeyword), factory.createToken(ts.SyntaxKind.StaticKeyword)],
                factory.createIdentifier("BASE"),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                factory.createNumericLiteral(ast.offset.base),
              )
            : undefined,
          factory.createPropertyDeclaration(
            [factory.createToken(ts.SyntaxKind.PublicKeyword), factory.createToken(ts.SyntaxKind.StaticKeyword)],
            factory.createIdentifier("LENGTH"),
            undefined,
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            factory.createNumericLiteral(ast.byteLength),
          ),
          // fields
          ...childrenCodeEmmits.flatMap((ce) => ce.fields),
          // decodeMethod
          factory.createMethodDeclaration(
            [factory.createToken(ts.SyntaxKind.PublicKeyword), factory.createToken(ts.SyntaxKind.StaticKeyword)],
            undefined,
            factory.createIdentifier("fromBuffer"),
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createIdentifier("buffer"),
                undefined,
                factory.createTypeReferenceNode(factory.createIdentifier("Uint8Array"), undefined),
                undefined,
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createIdentifier("offset"),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                undefined,
              ),
            ],
            factory.createTypeReferenceNode(factory.createIdentifier(className), undefined),
            factory.createBlock(
              [
                factory.createVariableStatement(
                  undefined,
                  factory.createVariableDeclarationList(
                    [
                      factory.createVariableDeclaration(
                        factory.createIdentifier(fieldName),
                        undefined,
                        undefined,
                        factory.createNewExpression(factory.createIdentifier(className), undefined, []),
                      ),
                    ],
                    ts.NodeFlags.Const | ts.NodeFlags.Constant | ts.NodeFlags.Constant,
                  ),
                ),
                // decodeStatements
                ...childrenCodeEmmits.flatMap((ce) => ce.decodeStatements),
                // return statements
                factory.createReturnStatement(factory.createIdentifier(fieldName)),
              ],
              true,
            ),
          ),
        ],
      ),
    ];

    codeEmmit.fields = [
      factory.createPropertyDeclaration(
        [factory.createToken(ts.SyntaxKind.PublicKeyword)],
        factory.createIdentifier(fieldName),
        undefined,
        isArrayOfStruct
          ? factory.createArrayTypeNode(factory.createTypeReferenceNode(factory.createIdentifier(className), undefined))
          : factory.createTypeReferenceNode(factory.createIdentifier(className), undefined),
        undefined,
      ),
    ];

    // decodeStatements
    console.log(`rule StructExp => ${fieldName} is array ${isArrayOfStruct}`);
    if (isArrayOfStruct) {
      codeEmmit.decodeStatements = [
        factory.createForStatement(
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier("i"),
                undefined,
                undefined,
                factory.createNumericLiteral("0"),
              ),
            ],
            ts.NodeFlags.Let,
          ),
          factory.createBinaryExpression(
            factory.createIdentifier("i"),
            factory.createToken(ts.SyntaxKind.LessThanToken),
            factory.createNumericLiteral(length),
          ),
          factory.createBinaryExpression(
            factory.createIdentifier("i"),
            factory.createToken(ts.SyntaxKind.PlusEqualsToken),
            factory.createNumericLiteral("1"),
          ),
          factory.createBlock(
            [
              factory.createExpressionStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier("memoryMap"),
                      factory.createIdentifier(fieldName),
                    ),
                    factory.createIdentifier("push"),
                  ),
                  undefined,
                  [
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier(className),
                        factory.createIdentifier("fromBuffer"),
                      ),
                      undefined,
                      [
                        factory.createIdentifier("buffer"),
                        factory.createBinaryExpression(
                          factory.createPropertyAccessExpression(
                            factory.createIdentifier(className),
                            factory.createIdentifier("BASE"),
                          ),
                          factory.createToken(ts.SyntaxKind.PlusToken),
                          factory.createBinaryExpression(
                            factory.createIdentifier("i"),
                            factory.createToken(ts.SyntaxKind.AsteriskToken),
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier(className),
                              factory.createIdentifier("LENGTH"),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
            true,
          ),
        ),
      ];
    } else {
      codeEmmit.decodeStatements = [
        factory.createExpressionStatement(
          factory.createBinaryExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier("memoryMap"),
              factory.createIdentifier(fieldName),
            ),
            factory.createToken(ts.SyntaxKind.EqualsToken),
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(className),
                factory.createIdentifier("fromBuffer"),
              ),
              undefined,
              [
                factory.createIdentifier("buffer"),
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(className),
                  factory.createIdentifier("BASE"),
                ),
              ],
            ),
          ),
        ),
      ];
    }

    return codeEmmit;
  },
  /*
    FieldExp = DirectiveExp? typeToken FieldDefinitionExp ("[" length "]")? ";"
  */
  FieldExp(directive, typeToken, fieldDefinition, _arg3, length, _arg5, _arg6) {
    const codeEmmit = new CodeEmmit();

    const ast: Field | FieldMask = this.toAST();

    const typeNode: ts.KeywordTypeNode = typeToken.toTS("");
    const isArrayOfStruct = length != null;

    if (ast instanceof FieldMask) {
      const fieldMask: FieldMask = ast;

      for (let i = 0; i < fieldMask.masks.length; i += 1) {
        const mask = fieldMask.masks[i];
        codeEmmit.fields.push(
          factory.createPropertyDeclaration(
            [factory.createToken(ts.SyntaxKind.PublicKeyword)],
            factory.createIdentifier(snakeToCamel(mask.name)),
            undefined,
            mask.bitLength > 1
              ? factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
              : factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
            undefined,
          ),
        );
        console.log(`rule FieldExp (maskfield) => fieldName=${snakeToCamel(mask.name)}`);
      }

      codeEmmit.decodeStatements = [
        /* TODO */
      ];
    } else {
      codeEmmit.fields = [
        factory.createPropertyDeclaration(
          [factory.createToken(ts.SyntaxKind.PublicKeyword)],
          factory.createIdentifier(snakeToCamel(ast.name)),
          undefined,
          isArrayOfStruct ? factory.createArrayTypeNode(typeNode) : typeNode,
          undefined,
        ),
      ];

      codeEmmit.decodeStatements = [
        /* TODO */
      ];

      console.log(`rule FieldExp (field) => fieldName=${snakeToCamel(ast.name)}`);
    }

    return codeEmmit;
  },
  /*
    singleLineComment = 
      | "//" singleLineCommentChars?
  */
  singleLineComment(_arg0, chars) {
    return new CodeEmmit();
  },
  typeToken(typeNode) {
    const typeValue = typeNode.sourceString;
    return TYPE_CONVERSION[typeValue];
  },
  length(_arg0): number {
    return parseInt(this.sourceString, 10);
  },
  fieldName(_arg0, _arg1) {
    return this.sourceString;
  },
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
  _iter(...children): any {
    return children.map((n) => n.toTS(""));
  },
};

export default toTS;
