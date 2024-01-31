import {exec} from 'command.js';
import {getHome} from 'states.js';
import {dprint} from 'debug.js';
import {print} from 'cursor.js';
export function _with(factory,src,patch){
    const param={...src};
    Object.assign(param,patch);
    return factory(param);   
}
function withable(factory,o){
    o.with=(patch)=>_with(factory,o,patch);
    return o;
}
function Withable(factory){
    const f=(...args)=>{
        return withable(f,factory(...args));
    };
    return f;
}
var ImportDecls=Withable(({base,decls,tail})=>{
    tail=tail||"";
    decls=decls||"";
    const add=(symbol, file)=>
        has(file)?
            addSymbol(symbol,file):
            addDecl({
                file,
                symbols:[symbol],
                head:"\n"
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
            decls:[...decls,ImportDecl({
                parent:self,...declp
            })]
        });
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
        decls.join("")+tail;
    const self={
        base,decls,tail,
        add,addDecl,addSymbol,toString,has,
        move
    };
    return self;
});
function parse(s,base){
    const reg=/import\s+\{(.*)\}\s+from\s+["'](.+)["']\s*;/g;      
    let i=0;
    let declps=[];
    let r;
    while(r=reg.exec(s)){
        let head=s.substring(i,r.index);
        let symbols=r[1].split(/\s*,\s*/);
        let file=base.rel(r[2]);
        declps.push({head,file,symbols});

        i=r.index+r[0].length;
        console.log(s.substring(i));
    }
    let tail=s.substring(i);
    let res=ImportDecls({base,tail});
    for(let declp of declps){
        res=res.addDecl(declp);
    }
    return res;
}
function test(){
    let base=getHome();
 let decls=parse(`import {aa,bbb} from 'c.js';
import {qqq,ppp} from 'd.js';
aaaaz
`,base);
  dprint(decls);
 let d2=decls.add("rrr",base.rel("d.js"));
  print(d2);
   let d3=d2.add("rre",base.rel("r.js"));
  print(d3);
   let d4=d3.move(base.rel("d.js"),base.rel("dd.js"));
  print(d4);
   

}
var ImportDecl=Withable(({head,file,parent,symbols})=>{
    head=head||"";
    if(!symbols){
        console.logs({head,file,parent,symbol});
        throw new Error("nosym");
    }
    const add=(symbol)=>
        symbols.includes(symbol)?self:
        self.with({
            symbols:[...symbols, symbol]
        });
    const toString=()=>{
        const {base}=parent;
        return head+
        ("import {")+
        [...symbols].join(", ")+
        ("} from '")+
        file.relPath(base)+
        ("';");
    };
    const self={
        head,file,parent,symbols,
        add,toString
    };
    return self;
});
test();