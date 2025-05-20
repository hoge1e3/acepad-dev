#!run

export async function main(){
const d=document.querySelector("#editor-overlay");
const h=(e)=>console.log("ev",e);
d.addEventListener("touchstart",h);
d.addEventListener("touchmove",h);

}






















