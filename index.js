#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Lexer, Parser } from "./lunachi.js";

const args = process.argv.slice(2);
if (!args[0]){
  console.log("Fataw ewwor: no input files >w<")
  process.exit(1);
}
const filePath = path.resolve(args[0]);
if (path.extname(filePath) !== '.lunac') {
  console.log('Invawid file fowmat. Onwy .lunac files awe awwowed. OwO');
  process.exit(1);
}

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.log(`Faiwed to wead file ${filePath}. >w<`);
    process.exit(1);
  }
  let lexer = new Lexer(data);
  let parser = new Parser(lexer, data);
  let result = parser.parse();
  console.log(result);
});
