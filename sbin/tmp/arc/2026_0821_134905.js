#!run

export async function main(){
  return this.enterCommand(`
cd /idb/
ls
sleep 1
echo done
`);
}