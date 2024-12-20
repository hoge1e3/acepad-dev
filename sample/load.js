async function main(){
const ap = fA();
const bp = fB();
const cp = fC();
const dp = fD(await ap, await bp);
const ep = fE(await bp, await cp);
const fp = fF(await dp, await ep);
const [a,b,c,d,e,f]=[await ap, await bp, await cp, await dp, await ep, await fp];
}