    let home=["さいこう","うまい","おいしい",
    "だいすき","おすすめ","おしです","はまる",
    "えらい","いだい"];
    let kn=["きのこ","たけのこ"];
    let fk=["めっちゃ","とても","まじで","がちで","ぜったい",
    "すごく",""];

export async function main(){
//        let kn=["きのこ","たけのこ"];
    let r=[];
    for(let k of kn){
        for(let i=0;i<10;i++){
            r.push(gg(k));
        }
    }
    this.echo(JSON.stringify(r,null,4));
}
function s(a){
    return a[Math.floor(Math.random()*a.length)];
}
function g(p){
    return p+s(fk)+s(home);
}
function gg(p){
    let s="";
    while(s.length<32){
        s+=g(p);
    }
    return s;
}