#!run

export async function main(){
process.env.newkeypad=true;
await this.sleep(3);
//te
process.env.newkeypad=false;

}