#!run
//import {showIframe} from '@acepad/widget';
import {sibling} from "@acepad/here";
import {open} from "@acepad/browser";

export function main(){
    const h=sibling(import.meta.url,"ace.html");
    open(h);
//  showIframe(location.href,{fullscreen:true});
  
}main();
