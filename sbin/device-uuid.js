#!run
import {loadScriptTag} from "@hoge1e3/loadScript";
await loadScriptTag("https://cdn.jsdelivr.net/npm/device-uuid/lib/device-uuid.js");

export async function main(){
    var uuid = new DeviceUUID().get();
    this.echo(uuid);
}