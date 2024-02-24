import ts, { factory } from "typescript";
import { BitwiseType, Endianess, Offset, OffsetType } from "./ast/types";

type DecodeStatementGenerator = (assignTo?) => ts.Statement[];

export class CodeEmmit {
  public imports: ts.ImportDeclaration[];

  public classes: ts.ClassDeclaration[];

  public fields: ts.PropertyDeclaration[];

  public decodeStatements: DecodeStatementGenerator[];

  public encodeStatements: ts.Statement[];

  constructor() {
    this.imports = [];
    this.classes = [];
    this.fields = [];
    this.decodeStatements = [];
    this.encodeStatements = [];
  }
}

/*
    for (let i = 0; i < <length>; i += 1) {
      <block>
    }
 */
function iterateWithFor(length: number, block: ts.Statement[]): ts.ForStatement {
  return factory.createForStatement(
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
    factory.createBlock(block, true),
  );
}

/*
  let currentOffset = < initializer >;
*/
export function createCurrentOffsetVariableStatement(initializer?: ts.Expression): ts.VariableStatement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(factory.createIdentifier("currentOffset"), undefined, undefined, initializer)],
      ts.NodeFlags.Let,
    ),
  );
}

/*
  currentOffset += <offset>
*/
export function advanceOffsetStatement(offset: number) {
  return () => [
    factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createIdentifier("currentOffset"),
        factory.createToken(ts.SyntaxKind.PlusEqualsToken),
        factory.createNumericLiteral(offset.toString(10)),
      ),
    ),
  ];
}

/*
  if offset is relative
    currentOffset += <offset>
  if offset is absolute
    currentOffset = <offset>
*/
export function fieldOffsetDirective(offset: Offset) {
  return offset.type === OffsetType.RELATIVE
    ? advanceOffsetStatement(offset.base)
    : () => [
        factory.createExpressionStatement(
          factory.createBinaryExpression(
            factory.createIdentifier("currentOffset"),
            factory.createToken(ts.SyntaxKind.EqualsToken),
            factory.createNumericLiteral(offset.base.toString(10)),
          ),
        ),
      ];
}

/*
    for (let i = 0; i < 200; i += 1) {
      memoryMap.channelAttributes.push(
        MemoryMapChannelAttributes.fromBuffer(
          buffer,
          MemoryMapChannelAttributes.BASE + i * MemoryMapChannelAttributes.LENGTH,
        ),
      );
    }
 */
export function structExpArrayDecode(className: string, fieldName: string, length: number) {
  return (assignTo: string) => [
    iterateWithFor(length, [
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(assignTo),
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
    ]),
  ];
}

/*
  if Struct has ABSOLUTE OFFSET
    currentOffset = <MemoryMapDtmfSettings.BASE>;
    memoryMap.dtmfSettings = MemoryMapDtmfSettings.fromBuffer(buffer, currentOffset);
    currentOffset += <Struct>
  if Struct has RELATIVE OFFSET
    currentOffset += 
*/
export function structExpSingleDecode(className: string, fieldName: string, offset?: Offset): DecodeStatementGenerator {
  return (assignTo: string) =>
    [
      offset && offset.type === OffsetType.ABSOLUTE
        ? factory.createExpressionStatement(
            factory.createBinaryExpression(
              factory.createIdentifier("currentOffset"),
              factory.createToken(ts.SyntaxKind.EqualsToken),
              factory.createNumericLiteral(offset.base.toString(10)),
            ),
          )
        : null,
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(assignTo),
            factory.createIdentifier(fieldName),
          ),
          factory.createToken(ts.SyntaxKind.EqualsToken),
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(className),
              factory.createIdentifier("fromBuffer"),
            ),
            undefined,
            [factory.createIdentifier("buffer"), factory.createIdentifier("currentOffset")],
          ),
        ),
      ),
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createIdentifier("currentOffset"),
          factory.createToken(ts.SyntaxKind.PlusEqualsToken),
          factory.createPropertyAccessExpression(
            factory.createIdentifier(className),
            factory.createIdentifier("LENGTH"),
          ),
        ),
      ),
    ].filter((e) => e != null);
}

/*
      memoryMapChannelAttributes.isScanlist1 = BitView.asBoolean(buffer, currentOffset, 7);
*/
export function fieldMaskSingleDecode(maskName: string, bitLength: number, bitOffset: number) {
  return (assignTo: string) => [
    factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier(assignTo), factory.createIdentifier(maskName)),
        factory.createToken(ts.SyntaxKind.EqualsToken),
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("BitView"),
            bitLength > 1 ? factory.createIdentifier("asNumber") : factory.createIdentifier("asBoolean"),
          ),
          undefined,
          [
            factory.createIdentifier("buffer"),
            factory.createIdentifier("currentOffset"),
            factory.createNumericLiteral(bitOffset),
            bitLength > 1 ? factory.createNumericLiteral(bitLength) : null,
          ].filter((e) => e != null),
        ),
      ),
    ),
  ];
}

const getDataViewDecodeMethod = (byteLength: number, signed: boolean) =>
  `get${signed ? "Int" : "Uint"}${byteLength * 8}`;

function fieldTypeDecodeCallExpression(type: BitwiseType, offsetArgument: ts.Expression): ts.Expression {
  if (type.isASCIIEncoded) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier("BitView"), factory.createIdentifier("asString")),
      undefined,
      [factory.createIdentifier("buffer"), offsetArgument],
    );
  }
  if (type.isBCDEncoded) {
    return factory.createCallExpression(factory.createIdentifier("parseInt"), undefined, [
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(factory.createIdentifier("buffer"), factory.createIdentifier("at")),
            undefined,
            [offsetArgument],
          ),
          factory.createIdentifier("toString"),
        ),
        undefined,
        [factory.createNumericLiteral("16")],
      ),
      factory.createNumericLiteral("10"),
    ]);
  }
  /* number */
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier("dataView"),
      factory.createIdentifier(getDataViewDecodeMethod(type.length, type.signed)),
    ),
    undefined,
    [offsetArgument, type.endianess === Endianess.LITTLE ? factory.createTrue() : null].filter((e) => e != null),
  );
}

/*
  if number
    object.field = buffer.at(currentOffset);
  if BCD
    < not implemented >
  if char
    object.field = String.fromCharCode(buffer.at(currentOffset))
*/
export function fieldSingleDecode(fieldName: string, type: BitwiseType) {
  return (assignTo: string) => [
    factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier(assignTo), factory.createIdentifier(fieldName)),
        factory.createToken(ts.SyntaxKind.EqualsToken),
        // type decoding
        fieldTypeDecodeCallExpression(type, factory.createIdentifier("currentOffset")),
      ),
    ),
  ];
}

export function fieldArrayDecode(fieldName: string, type: BitwiseType, length: number) {
  return (assignTo: string) => [
    iterateWithFor(length, [
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(assignTo),
              factory.createIdentifier(fieldName),
            ),
            factory.createIdentifier("push"),
          ),
          undefined,
          [
            fieldTypeDecodeCallExpression(
              type,
              factory.createBinaryExpression(
                factory.createIdentifier("currentOffset"),
                factory.createToken(ts.SyntaxKind.PlusToken),
                factory.createBinaryExpression(
                  factory.createIdentifier("i"),
                  factory.createToken(ts.SyntaxKind.AsteriskToken),
                  factory.createNumericLiteral(type.length),
                ),
              ),
            ),
          ],
        ),
      ),
    ]),
  ];
}

/*
  const dataView = new DataView(buffer.buffer);
 */
export function injectDataView() {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier("dataView"),
          undefined,
          undefined,
          factory.createNewExpression(factory.createIdentifier("DataView"), undefined, [
            factory.createPropertyAccessExpression(
              factory.createIdentifier("buffer"),
              factory.createIdentifier("buffer"),
            ),
          ]),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
}

export function generateStructClassDeclaration(
  className: string,
  fieldName: string,
  byteLength: number,
  childrenCodeEmmits: CodeEmmit[],
  offset?: Offset,
) {
  return factory.createClassDeclaration(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(className),
    undefined,
    undefined,
    [
      offset != null
        ? factory.createPropertyDeclaration(
            [factory.createToken(ts.SyntaxKind.PublicKeyword), factory.createToken(ts.SyntaxKind.StaticKeyword)],
            factory.createIdentifier("BASE"),
            undefined,
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            factory.createNumericLiteral(offset.base),
          )
        : undefined,
      factory.createPropertyDeclaration(
        [factory.createToken(ts.SyntaxKind.PublicKeyword), factory.createToken(ts.SyntaxKind.StaticKeyword)],
        factory.createIdentifier("LENGTH"),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        factory.createNumericLiteral(byteLength),
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
            injectDataView(),
            /*
              const fieldName = new Classname();
            */
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
                ts.NodeFlags.Const,
              ),
            ),
            /*
              ast.offset => let currentOffset = offset ?? MemoryMapPerbandpowersettings.BASE;
              !ast.offset => let currentOffset = offset;
            */
            createCurrentOffsetVariableStatement(
              offset != null
                ? factory.createBinaryExpression(
                    factory.createIdentifier("offset"),
                    factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier(className),
                      factory.createIdentifier("BASE"),
                    ),
                  )
                : factory.createIdentifier("offset"),
            ),
            // decodeStatements
            ...childrenCodeEmmits.flatMap((ce) => ce.decodeStatements).flatMap((generator) => generator(fieldName)),
            // return statements
            factory.createReturnStatement(factory.createIdentifier(fieldName)),
          ],
          true,
        ),
      ),
    ].filter((e) => e != null),
  );
}
