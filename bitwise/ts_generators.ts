import ts, { factory } from "typescript";
import { BitwiseType, Endianess, Offset, OffsetType } from "./ast_types";

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
  memoryMap.dtmfSettings = MemoryMapDtmfSettings.fromBuffer(buffer, MemoryMapDtmfSettings.BASE);
*/
export function structExpSingleDecode(className: string, fieldName: string) {
  return (assignTo: string) => [
    factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier(assignTo), factory.createIdentifier(fieldName)),
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
      factory.createPropertyAccessExpression(
        factory.createIdentifier("String"),
        factory.createIdentifier("fromCharCode"),
      ),
      undefined,
      [
        factory.createCallExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier("buffer"), factory.createIdentifier("at")),
          undefined,
          [offsetArgument],
        ),
      ],
    );
  }
  if (type.isBCDEncoded) {
    throw new Error("Not implemented");
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
