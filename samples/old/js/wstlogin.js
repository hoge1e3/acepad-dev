import { WebSocketServer, createWebSocketStream } from 'ws';
import pty from 'node-pty';
//test
const wss = new WebSocketServer({ port: 3000 });
const PASS="hogefuga";// # hogefuga\n
wss.on('connection', (ws) => {
    console.log('new connection!');

    const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

    function openProc() {
        const proc = pty.spawn('login', [], {
            name: 'xterm-color',
        });
        const onData = proc.onData((data) => duplex.write(data));
        const exit = proc.onExit(() => {
            console.log("process exited");
            onData.dispose();
            exit.dispose();
        });
        const kill = ()=>proc.kill(); 
        const write = (s)=>proc.write(s);
        return {proc,onData,exit,kill,write};
    }
    let buf="", procInst;
    duplex.on('data', (data) => {

         let s=data+"";
         if (!procInst) {
             buf+=s;
             if (buf.indexOf(PASS)>=0) {
                procInst=openProc();
                duplex.write("Welcome!!\n");
                //proc.write(buf);
             }
         } else procInst.write(s);
    });
    duplex.write("Enter Password:");
    ws.on('close', function () {
        console.log('stream closed');
        if (procInst) procInst.kill();
        duplex.destroy();
    });

});
