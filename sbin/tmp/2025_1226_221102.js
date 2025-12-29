#!run
import fs from "fs";
import path from "path";
import {getDeviceManager} from "pnode:main"
export async function main(){
  const d=getDeviceManager()
  const mps=new Set(
    d.readFstab().map(
      e=>e.mountPoint)
  );
  return JSON.stringify(
    [...mps],null,2);
}

function* traverse(dir, exc) {
  /*
  yield all files in dir and its subdir.
  ignore directory specified in exc that is Set object
  but dont ignore dir itself even it is in exc
  */

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    const full = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      // skip excluded directories, but not the root dir itself
      if (exc?.has(full) || exc?.has(ent.name)) {
        continue;
      }
      yield* traverse(full, exc);
    } else if (ent.isFile()) {
      yield full;
    }
  }
}