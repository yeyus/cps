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
import { debug } from "./operations/utils";

const semantics: BitwiseSemantics = grammar.createSemantics();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toAST", toAST);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toDefinitionTable()", toDefinitionTable);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toTS(name, definitionTable)", toTS);

yargs(hideBin(process.argv))
  .command(
    "generate [name] [memmap]",
    "generate a TS translation of a bitwise memory map",
    (args) =>
      args
        .positional("name", { describe: "name for the base parser class", type: "string" })
        .positional("memmap", { describe: "memmap file to parse", type: "string" }),
    (argv) => {
      const filePath: string = argv.memmap;
      const className: string = argv.name;
      const memmap = fs.readFileSync(filePath, "utf-8");

      const matchResult = grammar.match(memmap);
      const definitionTable: DefinitionTable = semantics(matchResult).toDefinitionTable();
      debug("definitionTable =>", definitionTable);
      const codeEmitter = semantics(matchResult).toTS(className, definitionTable);

      console.log(createFromCodeEmmit(codeEmitter));
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
