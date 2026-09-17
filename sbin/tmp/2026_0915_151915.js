#!run
import * as fs from "fs";
export async function main(file = ".") {
  const f = this.resolve(file, true);
  const files=fs.readdirSync(f.path());
  this.echo(...files);
}
