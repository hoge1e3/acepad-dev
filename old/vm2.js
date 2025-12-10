//self never contain functions
export class Thread{
  self(self){
    const f=self.frame;
    const s=f.stack;
    s.push(self);
  }
  get(self,{n}){
    const s=self.frame.stack;
    n=n||s.pop(self);
    const o=s.pop(self);
    s.push(o[n]);
  }
  set(self,{n,v}){
    const s=self.frame.stack;
    n=n||s.pop(self);
    v=v||s.pop(self);
    const o=s.pop(self);
    s.push(o[n]=v);
  }
  enter(self,inst){
    let {
      closure,stack,
    }=inst;
    stack=stack||[];
    self.frame={
      parent:self.frame,
      stack:(stack).slice(),
      code:closure.code,
      pc:0,
      bind:{
        __parent:closure.bind,
      },
    };
  }
  step(self){
    const f=self.frame;
    const c=f.code[f.pc++];
    if(!c){
      this.exit(self);
      return ;
    }
    this.proc(self,c);
  }
  exit(self){
    self.frame=
    self.frame.parent;
  }
  proc(self,inst){
    const op=
      typeof inst==="string"?
        inst:inst.op;
    const f=this[op];
    if(f)return f.call(this, inst);
    const closure=self[op];
    if(closure){
      this.enter(self,{
        ...inst,
        closure,
      });
      return ;
    }
    this.enter(self,inst);
  }
}