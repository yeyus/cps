/* eslint-disable @typescript-eslint/no-unused-vars */
import ts, { Node, NodeFlags, SyntaxKind, factory } from "typescript";
import { BitwiseActionDict } from "../bitwise.ohm-bundle";
import {
  PrimitiveTypeField,
  MaskedField,
  StructFieldReference,
  Offset,
  Struct,
  StructDefinition,
  TypeToken,
} from "../ast/types";
import { optionalExp } from "./to_ast";
import {
  CodeEmmit,
  advanceOffsetStatement,
  createCurrentOffsetVariableStatement,
  fieldArrayDecode,
  fieldMaskSingleDecode,
  fieldOffsetDirective,
  fieldSingleDecode,
  generateStructClassDeclaration,
  injectDataView,
  structExpArrayDecode,
  structExpSingleDecode,
} from "../ts_generators";
import { attachDefinitionsToAST, capitalize, debug, snakeToCamel } from "./utils";
import { ASTNode, NodeTypes } from "../ast/base";

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

  ts.addSyntheticLeadingComment(
    statements[0],
    ts.SyntaxKind.MultiLineCommentTrivia,
    "This file is AUTO-GENERATED by the bitwise to TS compiler so scram!",
    true,
  );

  const disabledRules = ["@typescript-eslint/no-unused-vars", "max-classes-per-file"];

  ts.addSyntheticLeadingComment(
    statements[0],
    ts.SyntaxKind.MultiLineCommentTrivia,
    `eslint-disable ${disabledRules.join(", ")}`,
    true,
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: false });

  return printer.printFile(sourceFile);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toTS: BitwiseActionDict<any> = {
  Script(exps) {
    const { definitionTable } = this.args;
    const codeEmmit = new CodeEmmit();

    const childrenCodeEmmits: CodeEmmit[] = exps.children.map((c) => c.toTS("<internal>", definitionTable));

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
    debug(`rule Script => className=${className}`);

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
                injectDataView(),
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
                    ts.NodeFlags.Const,
                  ),
                ),
                // let currentOffset = 0;
                createCurrentOffsetVariableStatement(factory.createNumericLiteral(0)),
                // decodeStatements
                ...childrenCodeEmmits
                  .flatMap((ce) => ce.decodeStatements)
                  .flatMap((generator) => generator("memoryMap")),
                // return
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
    StructDefinitionExp = "struct" fieldName "{" Exp+ "}" ";"
  */
  StructDefinitionExp(_arg0, fieldNameExp, _arg2, exps, _arg4, _arg5) {
    const { definitionTable } = this.args;
    const ast: Struct = this.toAST();
    const codeEmmit = new CodeEmmit();

    const childrenCodeEmmits: CodeEmmit[] = exps.children.map((c) => c.toTS("<internal>", definitionTable));

    const fieldName = snakeToCamel(fieldNameExp.toTS("", definitionTable));
    const className = `MemoryMap${capitalize(fieldName)}`;

    debug(`rule StructDefinitionExp => structName=${fieldName} className=${className}`);

    codeEmmit.classes = [
      generateStructClassDeclaration(className, fieldName, ast.byteLength, childrenCodeEmmits, ast.offset),
    ];

    return codeEmmit;
  },
  /*
    StructDeclarationExp = "struct" fieldName fieldName ("[" length "]")? ";"
  */
  StructDeclarationExp(directiveExp, _arg0, structNameExp, fieldNameExp, _arg3, lengthExp, _arg5, _arg6) {
    const offset: Offset | undefined = optionalExp(directiveExp)?.toAST();
    const { definitionTable } = this.args;
    const codeEmmit = new CodeEmmit();

    const length = optionalExp(lengthExp)?.toTS("", definitionTable);
    const isArrayOfStruct = lengthExp.numChildren > 0;
    const fieldName = snakeToCamel(fieldNameExp.toTS("", definitionTable));
    const structName = snakeToCamel(structNameExp.toTS("", definitionTable));
    const className = `MemoryMap${capitalize(structName)}`;

    const structDefinition: StructDefinition | undefined = definitionTable.get(structName);

    debug(`rule StructDeclarationExp => className=${className} fieldName=${fieldName}`);

    codeEmmit.fields = [
      factory.createPropertyDeclaration(
        [factory.createToken(ts.SyntaxKind.PublicKeyword)],
        factory.createIdentifier(fieldName),
        factory.createToken(ts.SyntaxKind.ExclamationToken),
        isArrayOfStruct
          ? factory.createArrayTypeNode(factory.createTypeReferenceNode(factory.createIdentifier(className), undefined))
          : factory.createTypeReferenceNode(factory.createIdentifier(className), undefined),
        undefined,
      ),
    ];

    debug(
      `rule StructDeclarationExp => DEBUG: structDefinition => ${structDefinition} byteLength=${structDefinition.byteLength}`,
    );
    codeEmmit.decodeStatements = [
      isArrayOfStruct
        ? structExpArrayDecode(className, fieldName, length)
        : structExpSingleDecode(className, fieldName, offset),
    ];

    return codeEmmit;
  },
  /*
    StructExp = DirectiveExp? "struct" "{" Exp+ "}" fieldName ("[" length "]")? ";"
  */
  StructExp(directiveExp, _arg1, _arg2, exps, _arg4, fieldnameExp, _arg6, lengthExp, _arg8, _arg9) {
    const { definitionTable } = this.args;
    const ast: ASTNode = attachDefinitionsToAST(this.toAST(), definitionTable);
    const struct = ast as Struct;
    const offset: Offset | undefined = optionalExp(directiveExp)?.toAST();
    const codeEmmit = new CodeEmmit();

    const childrenCodeEmmits: CodeEmmit[] = exps.children.map((c) => c.toTS("<internal>", definitionTable));

    codeEmmit.imports = childrenCodeEmmits.flatMap((ce) => ce.imports);

    const fieldName = snakeToCamel(fieldnameExp.toTS("", definitionTable));
    const className = `MemoryMap${capitalize(fieldName)}`;
    const length = optionalExp(lengthExp)?.toTS("", definitionTable);
    const isArrayOfStruct = lengthExp.numChildren > 0;

    debug(`rule StructExp => fielName=${fieldName} className=${className}`);

    codeEmmit.classes = [
      ...childrenCodeEmmits.flatMap((ce) => ce.classes).filter((e) => e != null),
      generateStructClassDeclaration(className, fieldName, struct.byteLength, childrenCodeEmmits, offset),
    ];

    codeEmmit.fields = [
      factory.createPropertyDeclaration(
        [factory.createToken(ts.SyntaxKind.PublicKeyword)],
        factory.createIdentifier(fieldName),
        isArrayOfStruct ? undefined : factory.createToken(ts.SyntaxKind.ExclamationToken),
        isArrayOfStruct
          ? factory.createArrayTypeNode(factory.createTypeReferenceNode(factory.createIdentifier(className), undefined))
          : factory.createTypeReferenceNode(factory.createIdentifier(className), undefined),
        isArrayOfStruct ? factory.createArrayLiteralExpression([], false) : undefined,
      ),
    ];

    // decodeStatements
    debug(`rule StructExp => ${fieldName} is array ${isArrayOfStruct}`);
    codeEmmit.decodeStatements = [
      isArrayOfStruct
        ? structExpArrayDecode(className, fieldName, length)
        : structExpSingleDecode(className, fieldName, offset),
    ];

    return codeEmmit;
  },
  /*
    FieldExp = DirectiveExp? typeToken FieldDefinitionExp ("[" length "]")? ";"
  */
  FieldExp(directive, typeToken, fieldDefinition, _arg3, length, _arg5, _arg6) {
    const { definitionTable } = this.args;
    const codeEmmit = new CodeEmmit();

    const ast: ASTNode = attachDefinitionsToAST(this.toAST(), definitionTable);

    const typeNode: ts.KeywordTypeNode = typeToken.toTS("", definitionTable);

    if (ast.kind === NodeTypes.FIELD_MASK) {
      const maskedField: MaskedField = ast as MaskedField;

      for (let i = 0; i < maskedField.children.length; i += 1) {
        const mask = maskedField.children[i];
        const maskName = snakeToCamel(mask.name);
        codeEmmit.fields.push(
          factory.createPropertyDeclaration(
            [factory.createToken(ts.SyntaxKind.PublicKeyword)],
            factory.createIdentifier(maskName),
            factory.createToken(ts.SyntaxKind.ExclamationToken),
            mask.bitLength > 1
              ? factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
              : factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
            undefined,
          ),
        );

        codeEmmit.decodeStatements.push(fieldMaskSingleDecode(maskName, mask.bitLength, mask.bitOffset));

        debug(`rule FieldExp (maskfield) => fieldName=${maskName}`);
      }

      codeEmmit.decodeStatements.push(advanceOffsetStatement(1));
    } else if (ast.kind === NodeTypes.PRIMITIVE_TYPE_FIELD) {
      const field = ast as PrimitiveTypeField;
      const isFieldArray = field.length > 1;
      const fieldName = snakeToCamel(field.name);
      codeEmmit.fields = [
        factory.createPropertyDeclaration(
          [factory.createToken(ts.SyntaxKind.PublicKeyword)],
          factory.createIdentifier(fieldName),
          isFieldArray ? undefined : factory.createToken(ts.SyntaxKind.ExclamationToken),
          isFieldArray ? factory.createArrayTypeNode(typeNode) : typeNode,
          isFieldArray ? factory.createArrayLiteralExpression([], false) : undefined,
        ),
      ];

      codeEmmit.decodeStatements = [
        field.offset != null ? fieldOffsetDirective(field.offset) : null,
        isFieldArray ? fieldArrayDecode(fieldName, field.type, field.length) : fieldSingleDecode(fieldName, field.type),
        advanceOffsetStatement(field.byteLength),
      ].filter((e) => e != null);

      debug(`rule FieldExp (field) => fieldName=${fieldName} length=${field.length}`);
    } else {
      throw new Error(`Unknown Field type`);
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
    return children.map((n) => n.toTS("", this.args.definitionTable));
  },
};

export default toTS;
