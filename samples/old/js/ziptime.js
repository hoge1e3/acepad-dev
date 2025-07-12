
export async function main(){
    this.cd("/ram/");
    this.rm("ztes/",{r:true});
    this.rm("uztes/",{r:true});
    this.mkdir("ztes/");
    this.mkdir("uztes/");
    this.cd("ztes/");
    
    for(let i=0;i<10;i++){
        await this.sleep(0.2);
        let d=new Date().getTime();
        let f=this.resolve(d+"");
        f.text(d+"");
        //this.echo(d," ",f.lastUpdate());
    }
    await this.zip(".","../zt.zip");
    this.cd("../uztes/");
    await this.unzip("../zt.zip",".");
    for(let f of this.resolve("./").listFiles()){
        this.echo(f.name()," ",f.lastUpdate());
    }
}