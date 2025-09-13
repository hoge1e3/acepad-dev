#!run

export async function main(){
   await this.cp("README.md", "READUS.md");
   await this.rm({r:true},"/tmp/");
}