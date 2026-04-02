#!runts
import "http://cdnjs.com/libraries/stacktrace.js";
export async function main() {
    const srcm = await this.run("../js/setsrcmap.js", "../js/setsrcmap.js");
    const url = URL.createObjectURL(new Blob([srcm], { type: "text/javascript" }));
    const i = await import(url);
    try {
        await i.main.call(this, "foo");
    }
    catch (e) {
        const t = StackTrace.fromError(e);
        console.log(t);
    }
    //return this.resolve("foo").text();
}
//# sourceMappingURL=errtest.js.map