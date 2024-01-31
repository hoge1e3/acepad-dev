export const state={};
export function getEditor(){
    return state.editor;
}
export function setEditor(e){
    state.editor=e;
}
export function getHome(){
    return state.home;
}
export function setHome(h){
    state.home=h;
}
export function setConfig(c){
    state.config=c;
}
export function getConfig(){
    return state.config;
}
export function getMenuPos(){
    state.menus=state.menus||{};
    return state.menus;
}