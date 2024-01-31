export async function readClipboard() {
    try {
        return await navigator.clipboard.readText();
    }catch (e) {
        try{
            return await parent.navigator.clipboard.readText();
        }catch(e){
            alert(e);
        }
    }
}
export async function writeClipboard(t) {
    try {
        await navigator.clipboard.writeText(t);
    } catch (e) {
        try{
            await parent.navigator.clipboard.writeText(t);
        }catch(e){
            alert(e);
        }
    }
}
