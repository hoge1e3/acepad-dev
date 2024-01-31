export var acepad={instance:window};
acepad.def=function (...a){
    const t=acepad.instance;
    let name,defs;
    if(a.length==2){
        [name,defs]=a;
    }else{
        defs=a[0];
    }
    Object.assign(t,defs);
    if(name){
        t[name]={};
        let cdef=`class ${name}{
            constructor (a){this.acepad=a;}\n`;
        for(let _k in defs){
            let v=defs[_k];
            const k=removePackageName(_k,name);
            if(typeof v==="function"){
                t[name][k]=v.bind(t);
                cdef+=`    ${k}(...a){
                    return this.acepad.${_k}(...a);
                }\n`;
            }else{
                t[name][k]=v;
            }
        }
        cdef+=`}`;
        console.log(cdef);
    }
};
export function removePackageName(methodName, packageName) {
  // メソッド名を小文字に変換
  const lowerMethodName = methodName.toLowerCase();
  // パッケージ名も小文字に変換
  const lowerPackageName = packageName.toLowerCase();

  // メソッド名にパッケージ名が含まれている場合、それを削除
  const index = lowerMethodName.indexOf(lowerPackageName);
  if (index !== -1) {
    // メソッド名の元の大文字小文字を保持したまま削除
    return methodName.substring(0, index) + 
    methodName.substring(index + packageName.length);
  } else {
    return methodName;
  }
}
/*
 function def<A,M>(main:A,_mod:(a:A)=>M):{main:A,mod:M}{
    const mod=_mod(main);
    return {main,mod};
}
 const Hoge=def({
    getHoge(this:Top):number {
        return this.x;
    },
    setHoge(this:Top, x:number) {
        this.x=x;
    }
},(m)=>({
    get: m.getHoge,
    set: m.setHoge,
}));
console.log(Hoge.main, Hoge.mod);
type Top={x:number} & typeof Hoge.main;

export class A{
    set(this:A) {
        
    }
}
*/

