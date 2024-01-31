import {initConfig} from './config.js';
import {initCore} from './editorcore.js';
import {setHome,getConfig} from './states.js';
import {sh} from './shell.js';
import {basicSessions} from './basicsessions.js';
import {showMenuButtons} from './menu.js';
import {autoexec} from './boot.js';
import {makeNgram} from './ngram.js';
import {initMarker} from './marker.js';
export function onFileReady(){
    initConfig();
    initCore();
    onFileReady=(x)=>x;
    const home=FS.get(window.homePath);
    setHome(home);
    sh.cd(home);
    basicSessions(home);
    const {menus}=getConfig();
    if(menus)showMenuButtons(menus);
    autoexec();
    makeNgram();
    initWorker();
    initMarker();
}
if(typeof FS==="object")onFileReady();
export function initWorker(){
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('pwa/sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

}
