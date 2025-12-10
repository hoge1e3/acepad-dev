#!run

export async function main(){
  const base="/idb/pnode-ws/node_modules/ajv-formats";
  const codegen_1 = pNode.require(
    "ajv/dist/compile/codegen",base);
  console.log(codegen_1+"");
  const e=pNode.resolveEntry("require",
  "ajv/dist/compile/codegen",
  base);
  console.log("ent",e);
  return e.file.path();
}