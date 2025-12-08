
const builtins={
  self(){
    const f=this.frame;
    const s=f.stack;
    s.push(this);
  }

};
export class Thread{
  newFrame(closure,args=[]){
    this.frame={
      parent:this.frame,
      stack:args.slice(),
      code:closure.code,
      pc:0,
      bind:{
        args,
        __parent:closure.bind,
      },
    };
  }
  step(){
    const f=this.frame;
    const c=f.code[f.pc++];
    if(!c){
      this.frame=
      this.frame.parent;
      return ;
    }
    this.proc(c);
  }
  proc(code){
    const op=
      typeof code==="string"?
        code:code.op;
    const f=builtins[op];
    if(f)return f.call(this, code);
    const c=this[op];
    if(c)this.newFrame(c,[code]);
  }
}