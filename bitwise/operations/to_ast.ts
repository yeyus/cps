/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { IterationNode, NonterminalNode } from "ohm-js";
import {
  BitwiseType,
  PrimitiveTypeField,
  MaskedField,
  Mask,
  Offset,
  OffsetType,
  Struct,
  Comment,
  StructDefinition,
  StructFieldReference,
  Script,
} from "../ast/types";
import { BitwiseActionDict } from "../bitwise.ohm-bundle";

export const optionalExp = (node: IterationNode): NonterminalNode | null =>
  node.numChildren === 1 ? node.children[0] : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toAST: BitwiseActionDict<any> = {
  /*
    Script = Exp*
  */
  Script(exps) {
    const script = new Script();

    exps.children.forEach((e) => {
      script.add(e.toAST());
    });

    return script;
  },
  /*
    DirectiveExp = "#" directiveToken (hexaddress|offset) ";"
  */
  DirectiveExp(_arg0, directiveToken, base, _arg3) {
    if (directiveToken.sourceString === "seek") {
      return new Offset(OffsetType.RELATIVE, base.toAST());
    }
    if (directiveToken.sourceString === "seekto") {
      return new Offset(OffsetType.ABSOLUTE, base.toAST());
    }
    throw new Error("dunno");
  },
  /*
    StructDefinitionExp = "struct" fieldName "{" Exp+ "}" ";"
  */
  StructDefinitionExp(_arg0, structNameExp, _arg2, exp, _arg4, _arg5) {
    const name = structNameExp.toAST();

    const structDefinition = new StructDefinition(name);

    exp.children.forEach((c) => {
      const childAst = c.toAST();
      if (childAst instanceof Comment) return;
      structDefinition.addMember(childAst);
    });

    return structDefinition;
  },
  /*
    StructDeclarationExp = DirectiveExp? "struct" fieldName fieldName ("[" length "]")? ";"
  */
  StructDeclarationExp(directiveExp, _arg0, structNameExp, fieldNameExp, _arg3, lengthExp, _arg5, _arg6) {
    const length = optionalExp(lengthExp)?.toAST();
    const structName = structNameExp.toAST();
    const fieldName = fieldNameExp.toAST();
    const offset = optionalExp(directiveExp)?.toAST();

    return new StructFieldReference(fieldName, structName, length, offset);
  },
  /*
    StructExp = DirectiveExp? "struct" "{" Exp+ "}" fieldName ("[" length "]")? ";"
  */
  StructExp(directiveExp, _arg1, _arg2, exp, _arg4, fieldname, _arg6, lengthExp, _arg8, _arg9) {
    const length = optionalExp(lengthExp)?.toAST();

    const struct = new Struct(fieldname.toAST(), length);
    struct.offset = optionalExp(directiveExp)?.toAST();

    exp.children.forEach((c) => {
      const childAst = c.toAST();
      if (childAst instanceof Comment) return;
      struct.addMember(childAst);
    });

    return struct;
  },
  /*
    FieldExp = DirectiveExp? typeToken FieldDefinitionExp ("[" length "]")? ";"
  */
  FieldExp(directiveExp, fieldType, fieldDefinition, _arg3, lengthExp, _arg5, _arg6) {
    let field: PrimitiveTypeField | MaskedField;

    const fieldDef = fieldDefinition.toAST();
    const length = optionalExp(lengthExp)?.toAST();
    const offset = optionalExp(directiveExp)?.toAST();
    if (typeof fieldDef === "string") {
      field = new PrimitiveTypeField(fieldType.toAST(), fieldDef, length, offset);
    } else {
      const fieldMask = new MaskedField(fieldType.toAST(), "<multiple>", length, offset);

      for (let i = 0; i < fieldDef.length; i += 1) {
        fieldMask.add(fieldDef[i]);
      }
      field = fieldMask;
    }

    return field;
  },
  /*
    FieldMaskDefinitionExp = fieldName ":" length
  */
  FieldMaskDefinitionExp(fieldName, _arg1, length) {
    return new Mask(fieldName.toAST(), length.toAST());
  },
  /*
    FieldMaskDefinitionListExp = (FieldMaskDefinitionExp ",")* FieldMaskDefinitionExp
  */
  FieldMaskDefinitionListExp(arg0, _arg1, arg2) {
    const masks = [];

    arg0.children.forEach((m) => masks.push(m.toAST()));
    masks.push(arg2.toAST());

    return masks;
  },
  /*
    singleLineComment = 
      | "//" singleLineCommentChars?
  */
  singleLineComment(_arg0, chars) {
    return new Comment(chars.sourceString);
  },
  /*
    hexaddress = "0x" hexdigit+
  */
  hexaddress(_arg0, hexdigits) {
    return parseInt(hexdigits.sourceString, 16);
  },
  /*
    hexdigit = digit | "a".."f" | "A".."F"
  */
  hexdigit(_arg0) {
    return this.sourceString;
  },
  fieldName(_arg0, _arg1) {
    return this.sourceString;
  },
  typeToken(typeNode): BitwiseType {
    const typeValue = typeNode.sourceString;
    switch (typeValue) {
      case "u8":
        return BitwiseType.U8;
      case "u16":
        return BitwiseType.U16;
      case "ul16":
        return BitwiseType.UL16;
      case "u24":
        return BitwiseType.U24;
      case "ul24":
        return BitwiseType.UL24;
      case "u32":
        return BitwiseType.U32;
      case "ul32":
        return BitwiseType.UL32;
      case "i8":
        return BitwiseType.I8;
      case "i16":
        return BitwiseType.I16;
      case "il16":
        return BitwiseType.IL16;
      case "i24":
        return BitwiseType.I24;
      case "il24":
        return BitwiseType.IL24;
      case "i32":
        return BitwiseType.I32;
      case "il32":
        return BitwiseType.IL32;
      case "char":
        return BitwiseType.CHAR;
      case "lbcd":
        return BitwiseType.LBCD;
      case "bbcd":
        return BitwiseType.BBCD;
      default:
        throw new Error(`Unknown type ${typeValue}`);
    }
  },
  length(_arg0): number {
    return parseInt(this.sourceString, 10);
  },
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
  _iter(...children): any {
    return children.map((n) => n.toAST());
  },
};

export default toAST;
