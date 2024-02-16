/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
// import util from "util";
import toAST from "./operations/to_ast";
import grammar, { BitwiseSemantics } from "./bitwise.ohm-bundle";
import { TEST } from "./test";
import toTS, { createFromCodeEmmit } from "./operations/to_ts";

const semantics: BitwiseSemantics = grammar.createSemantics();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toAST", toAST);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
semantics.addOperation<any>("toTS(name)", toTS);

const matchResult = grammar.match(TEST);
// const ast = semantics(matchResult).toAST();
// console.log(util.inspect(ast, false, null, true));

const codeEmitter = semantics(matchResult).toTS("QuanshengUVK5");

console.log(createFromCodeEmmit(codeEmitter), "QuanshengUVK5.ts");
