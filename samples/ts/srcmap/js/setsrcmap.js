#!run
export async function main(js) {
    const mapf = this.resolve(js + ".map");
    const jsf = this.resolve(js);
    let jss = jsf.text();
    jss = jss.replace(/(#\s*sourceMappingURL=)(.*)/, (m, h, t) => `${h}${mapf.dataURL()}`);
    //jsf.text(jss);
    return jss;
}
//# sourceMappingURL=setsrcmap.js.map