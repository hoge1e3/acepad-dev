#!run
import * as fs from "fs";
export async function main(){
  const dir="/idb/pnode-ws/node_modules/@hoge1e3";
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    this.echo(file.name, file.isFile(), file.isSymbolicLink());
    if (file.isFile()) { // false for symlink
    }
  }

  return ;
}