/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { IterationNode, NonterminalNode } from "ohm-js";
import { Comment, DefinitionTable, StructDefinition } from "../ast/types";
import { BitwiseActionDict } from "../bitwise.ohm-bundle";
import { snakeToCamel } from "./utils";

export const optionalExp = (node: IterationNode): NonterminalNode | null =>
  node.numChildren === 1 ? node.children[0] : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toDefinitionTable: BitwiseActionDict<any> = {
  Script(exps): DefinitionTable {
    const definitionTable = new Map<string, StructDefinition>();

    exps.children.forEach((e) => {
      const structDefinition: StructDefinition = e.toDefinitionTable();
      if (structDefinition != null) {
        definitionTable.set(structDefinition.name, structDefinition);
      }
    });

    return definitionTable;
  },
  /*
    StructDefinitionExp = "struct" fieldName "{" Exp+ "}" ";"
  */
  StructDefinitionExp(_arg0, structNameExp, _arg2, exp, _arg4, _arg5): StructDefinition {
    const name = structNameExp.sourceString;
    const structName = snakeToCamel(name);
    const structDefinition = new StructDefinition(structName);

    exp.children.forEach((c) => {
      const childAst = c.toAST();
      if (childAst instanceof Comment) return;
      structDefinition.addMember(childAst);
    });

    return structDefinition;
  },
  /*
    StructExp = DirectiveExp? "struct" "{" Exp+ "}" fieldName ("[" length "]")? ";"
  */
  StructExp(directiveExp, _arg1, _arg2, exp, _arg4, fieldname, _arg6, lengthExp, _arg8, _arg9) {
    return null;
  },
  /*
    FieldExp = DirectiveExp? typeToken FieldDefinitionExp ("[" length "]")? ";"
  */
  FieldExp(directiveExp, fieldType, fieldDefinition, _arg3, lengthExp, _arg5, _arg6) {
    return null;
  },
};

export default toDefinitionTable;
