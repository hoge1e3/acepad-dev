#!run
import * as fs from "fs";
import * as path from "path";
import ignore from "ignore";
import pNode 
const excludes={".gsync":1,".sync":1,".git":1};

function* traverseNotIgnored(dir, ig = ignore()) {
  // also check .gitignore in subfolder
  const gitignore = path.join(dir, ".gitignore");
  let localIg = ig;
  if (fs.existsSync(gitignore)) {
    const rules = fs.readFileSync(gitignore, "utf8");
    localIg = ignore().add(ig).add(rules);
  }
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git") continue;
    if (name === ".gsync") continue;
    const rel = name;
    if (localIg.ignores(rel)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      yield* traverseNotIgnored(full, localIg);
    } else {
      yield full;
    }
  }
}
export async function main(){
  for(let f of traverseNotIgnored(this.$home)){ 
    this.echo(f)
    
  }
  return 
  const ig=ignore();
  const h=this.resolve(this.$home).rel("node_modules");
  //console.log(h)
  for(let l of h.rel(".gitignore").lines()){
    ig.add(l);
  }
  return ig.ignores(h.rel("typesript/package.json").relPath(h));
}

export async function traverseHere(f){
  const trs=(s)=>s.replace(/\/$/,"");
  const df=pNode.
    getDeviceManager().
    df().map(d=>
    trs(d.mountPoint));
  await fs.promises.readdir(f.path());
  return f.recursive({
    includeDir:true,
    excludes(f){
      return excludes.hasOwnProperty(
        f.truncSep())||
        df.includes(trs(f.path()));
    },
  });

  function* traverseNotIgnored(dir, ig = ignore()) {
    // also check .gitignore in subfolder
    const gitignore = path.join(dir, ".gitignore");
    let localIg = ig;
    if (fs.existsSync(gitignore)) {
      const rules = fs.readFileSync(gitignore, "utf8");
      localIg = ignore().add(ig).add(rules);
    }
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if(excludes.hasOwnProperty(name)||
        df.includes(trs(full)))continue;
      const rel = name;
      if (localIg.ignores(rel)) continue;
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        yield* traverseNotIgnored(full, localIg);
      } else {
        yield full;
      }
    }
  }
}
