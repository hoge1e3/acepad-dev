
const {sub}=require("./sub.js");
const test=require("test");
console.log(test(sub(5)));
const fs=require("fs");
console.log( fs.readdirSync(__dirname) );
console.log(process.cwd());

