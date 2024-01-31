import {equal,ok} from "../assert.js";
//IMPORT END
export function _with(factory,src,patch){
    const param={...src};
    Object.assign(param,patch);
    return factory(param);   
}
export function withable(factory,o){
    o.with=(patch)=>_with(factory,o,patch);
    return o;
}
export function Withable(factory){
    const f=(...args)=>{
        return withable(f,factory(...args));
    };
    return f;
}
export function assigns(...args){
    let res={};
    for(let e of args)res=Object.assign(res,e);
    return res;
}
export function override(o,name,f){
    o[name]=f(o[name]);
    return o;
}
export const ImportDecls=Withable(({base,decls,tail})=>{
    tail=tail||"";
    decls=decls||[];
    const add=(symbol, file)=>
        has(file)?
            addSymbol(symbol,file):
        decls.length?
            addDecl({
                file,
                symbols:[symbol],
                head:"\n"
            }):
        self.with({
            decls:[newDecl({
                file,
                symbols:[symbol],
                head:""
                })],
            tail:"\n"+tail,
        });
    const addSymbol=(symbol,file)=>
        self.with({
            decls:decls.map((decl)=>
                file.equals(decl.file)?
                    decl.add(symbol):
                    decl)
        });
    const addDecl=(declp)=>
        self.with({
            decls:[...decls,newDecl(declp)]
        });
    const newDecl=(declp)=>
        ImportDecl(declp);
    const has=(file)=>
        decls.some((decl)=>
            file.equals(decl.file));
    const move=(from,to)=>
        self.with({
            decls:decls.map((decl=>
                decl.file.equals(from)?
                    decl.with({
                        file:to
                    }):
                    decl))});
    const toString=()=>
        decls.map(d=>d.str(self)).join("")+
        tail;
    const self={
        base,decls,tail,
        add,addDecl,addSymbol,toString,has,
        move
    };
    return self;
});
export function parse(s,base,opt={}){
    let {end}=opt;
    ok(base,"base.not.set");
    end=end||/IMPORT END/;
    const reg=/import\s+\{(.*)\}\s+from\s+["'](.+)["']\s*;/g;      
    let i=0;
    let declps=[];
    let r;
    let tail="";
    if(r=end.exec(s)){
        tail=s.substring(r.index);
        s=s.substring(0,r.index);
    }
    while(r=reg.exec(s)){
        let head=s.substring(i,r.index);
        let symbols=r[1].split(/\s*,\s*/);
        let file=base.rel(r[2]);
        declps.push({head,file,symbols});

        i=r.index+r[0].length;
        console.log(s.substring(i));
    }
    tail=s.substring(i)+tail;
    let res=ImportDecls({base,tail});
    for(let declp of declps){
        res=res.addDecl(declp);
    }
    return res;
}
export function test(){
    let base=getHome();
    let src=`import {aa, bbb} from './c.js';
import {qqq, ppp} from './d.js';
//IMPORT END
import {qqq,ppp} from 'e.js';
aaaaz
`;
 let decls=parse(src,base);
 equal(decls.decls.length,2);
  equal(decls+"",src);
 let d2=decls.add("rrr",base.rel("d.js"));
  equal(d2+"",`import {aa, bbb} from './c.js';
import {qqq, ppp, rrr} from './d.js';
//IMPORT END
import {qqq,ppp} from 'e.js';
aaaaz
`);
   let d3=d2.add("rre",base.rel("r.js"));
  equal(d3+"",`import {aa, bbb} from './c.js';
import {qqq, ppp, rrr} from './d.js';
import {rre} from './r.js';
//IMPORT END
import {qqq,ppp} from 'e.js';
aaaaz
`);
   let d4=d3.move(base.rel("d.js"),base.rel("dd.js"));
  equal(d4+"",`import {aa, bbb} from './c.js';
import {qqq, ppp, rrr} from './dd.js';
import {rre} from './r.js';
//IMPORT END
import {qqq,ppp} from 'e.js';
aaaaz
`);
 let d5=decls.add("rrr",base.rel("e.js"));
     equal(d5+"",`import {aa, bbb} from './c.js';
import {qqq, ppp} from './d.js';
import {rrr} from './e.js';
//IMPORT END
import {qqq,ppp} from 'e.js';
aaaaz
`);
 let d6=decls.with({base:base.rel("sub/")});
      equal(d6+"",`import {aa, bbb} from '../c.js';
import {qqq, ppp} from '../d.js';
//IMPORT END
import {qqq,ppp} from 'e.js';
aaaaz
`);
  let d7=parse("aaa();",base);
  ok(!d7.has("aaa"),"has");
  let d8=d7.add("aaa",base.rel("q.js"));
  equal(d8+"",`import {aaa} from './q.js';
aaa();`);
    print("passed");
}    
export const ImportDecl=Withable(({head,file,symbols})=>{
    head=head||"";
    if(!symbols){
        console.log({head,file,parent,symbols});
        throw new Error("nosym");
    }
    const add=(symbol)=>
        symbols.includes(symbol)?self:
        self.with({
            symbols:[...symbols, symbol]
        });
    const str=(parent)=>{
        const {base}=parent;
        return head+
        ("import {")+
        [...symbols].join(", ")+
        ("} from '")+
        pp(file.relPath(base))+
        ("';");
    };
    const pp=(p)=>p.match(/^[\/\.]/)?p:
        `./${p}`;
    const self={
        head,file,parent,symbols,
        add,str
    };
    return self;
});
//test();