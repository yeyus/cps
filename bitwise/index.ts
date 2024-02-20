/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import * as fs from "fs";
import * as util from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import toAST from "./operations/to_ast";
import toDefinitionTable from "./operations/to_definition_table";
import grammar, { BitwiseSemantics } from "./bitwise.ohm-bundle";
import toTS, { createFromCodeEmmit } from "./operations/to_ts";
import { DefinitionTable } from "./ast/types";

const semantics: BitwiseSemantics = grammar.createSemantics();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toAST", toAST);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toDefinitionTable()", toDefinitionTable);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toTS(name, definitionTable)", toTS);

yargs(hideBin(process.argv))
  .command(
    "generate [memmap]",
    "generate a TS translation of a bitwise memory map",
    (args) => args.positional("memmap", { describe: "memmap file to parse", type: "string" }),
    (argv) => {
      const filePath: string = argv.memmap;
      const memmap = fs.readFileSync(filePath, "utf-8");

      const matchResult = grammar.match(memmap);
      const definitionTable: DefinitionTable = semantics(matchResult).toDefinitionTable();
      console.log("definitionTable =>", definitionTable);
      const codeEmitter = semantics(matchResult).toTS("QuanshengUVK5", definitionTable);

      console.log(createFromCodeEmmit(codeEmitter), "QuanshengUVK5.ts");
    },
  )
  .command(
    "printast [memmap]",
    "print an AST representation of a bitwise memory map",
    (args) => args.positional("memmap", { describe: "memmap file to parse", type: "string" }),
    (argv) => {
      const filePath: string = argv.memmap;
      const memmap = fs.readFileSync(filePath, "utf-8");

      const matchResult = grammar.match(memmap);

      const ast = semantics(matchResult).toAST();
      console.log(util.inspect(ast, false, null, true));
    },
  )
  .strictCommands()
  .demandCommand(1)
  .parse();
