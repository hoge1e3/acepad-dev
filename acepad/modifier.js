import {events} from './events.js';
export var shiftState={},shiftLock={
    sym:1
};
export var modifierKeys={"shift":1,"ctrl":1,"edit":1,"sym":1,"select":1};
export function currentModifierState(){
    return shiftState;
}
export function modifierStateToInt(s){
    s=s||shiftState;
    return ssToInt(s);
}
export function setModifier(k,v){
    switch(v){
        case 0:
            shiftState[k]=0;
            shiftLock[k]=0;
            break;
        case 1:
            shiftState[k]=1;
            shiftLock[k]=0;
            break;
        case 2:
            shiftState[k]=1;
            shiftLock[k]=1;
            break;
    }
}
export function getModifier(k){
    return shiftState[k];
}
export function modifierLocked(k){
    return shiftLock[k];
}
export function clearUnlockedShifts(){
    for(let k in shiftState){
        if(modifierLocked(k))continue;
        shiftState[k]=0;
    }
}
export function ssToInt(e){
    return 0 | 
    (e.ctrl ? 1 : 0) | 
    (e.alt ? 2 : 0) | 
    (e.shift ? 4 : 0) | 
    (e.meta ? 8 : 0);
}
export function renderModifierState() {
    for(let m in modifierKeys){
        if(getModifier(m)){
            $("#keypad").addClass(m);
        }else{
            $("#keypad").removeClass(m);
        }
        if(modifierLocked(m)){
            $("#keypad").addClass(`lock-${m}`);
        }else{
            $("#keypad").removeClass(`lock-${m}`);
        }
    }
    events.fire("renderModifierState",{});
    
}
export function modifierButtonPressed(d){
        let mod=d.modifier;

    let lock=d.lock||"double";
    if(!shiftState[mod]){
        shiftState[mod]=1;
        if(lock=="single"){
            shiftLock[mod]=1;
        }
    }else if(lock!="none"&&
    !shiftLock[mod]){
        shiftLock[mod]=1;
    }else{
        shiftState[mod]=
        shiftLock[mod]=0;
    }
    if(d["modifier-off"]){
        shiftState[d["modifier-off"]]=0;
    }
    return;
}
export function addModifierStyle(){
  const styleEl = document.createElement("style");
  styleEl.setAttribute("id","sutairu");
  // Append <style> element to <head>
  document.head.appendChild(styleEl);
  // Grab style element's sheet
  const styleSheet = styleEl.sheet;
  //styleSheet.insertRule("button{color:blue;}");
  for(let k in modifierKeys){
    styleSheet.insertRule(`#keypad.${k} .mask.no-${k}{
        display: none;
    }`);
    styleSheet.insertRule(`#keypad:not(.${k}) .mask.${k}{
        display: none;
    }`);
  }
}
