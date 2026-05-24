#!run
import {Counter} from "@hoge1e3/counter";

export async function main(){
  const tcs=[];
  for(let j=0;j<10;j++){
      
    const c=new Counter();
    for(let i=0;i<10;i++){
      c.add(i);
    }
    tcs.push(c);
  }
  for(let i=0;i<100;i++){
    const nc=trial.call(this,tcs);
      
    let s=0;
    for(let [n,cn] of nc.descend()){
      s+=cn;
    }
    this.echo(s+" ",{n:1});
    for(let [n,cn] of nc.descend()){
      this.echo(n+":"+cn+" ",{n:1});
    }
    for(let j=0;j<10;j++){
      nc.add(j);
    }
    
    tcs.unshift(nc);
    tcs.pop();
    await this.echo();
    await this.sleep(0.1);
  }
}
function trial(tcs){
  const c=new Counter();
  const wins=new Counter();
  for(let i=0;i<1000;i++){
    const a=(gen(10,tcs));  
    const w=winner(a);
    //if(w==9)this.echo(...a.sort());
    
    //this.echo(w);
    if(w!=null){
      c.add(w);
      wins.add(a.indexOf(w));
    }
  }
  //this.echo("win players ")
  for(let [n,cn] of wins.descend()){
    this.echo("p"+n+"="+cn+" ",{n:1});
  }
  this.echo(" ");
    
  return c;
}
function winner(a) {
  // get minimum but unique number
  const counts = {};
  for (const x of a) {
    counts[x] = (counts[x] ?? 0) + 1;
  }
  const uniques = a.filter(x => counts[x] === 1);
  if (uniques.length === 0) return null;
  return Math.min(...uniques);
}
function gen(n,tcs){
  const res=[];
  for(let i=0;i<n;i++){
    res.push(r(tcs[i]));
  }
  return res;
}
function r(c){
  let s=0;
  for(let [n,cn] of c.descend()){
    s+=cn;
  }
  s*=Math.random();
  for(let [n,cn] of c.descend()){
    s-=cn;
    if(s<=0)return n;
  }

}