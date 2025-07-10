export function equal(a,b,e){
    if(a===b)return true;
    e=e||new Error("actual: \n"+a+
    "\nexpected: \n"+b);
    if(typeof e==="string")e=new Error(e);
    throw e;
}
export function ok(value,message){
    return equal(!!value, true, message);
}