
export async function main(reg,file){
    reg=typeof reg=="string"?
        new RegExp(reg):reg;
    for(let line of this.resolve(file).lines()){
        if(reg.exec(line)){
            this.echo(line);
        }
    }
}