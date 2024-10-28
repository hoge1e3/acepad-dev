#!run
export async function main(){
    for(let i=0;i<10;i++){
        this.echo(i);
        await this.sleep(0.1);
    }
    this.echo("(press F1 to switch this session).");
}
/*
F5: run
F1: switch session(buffer)
*/