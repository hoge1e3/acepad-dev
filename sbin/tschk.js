#!run
import * as process from "process";
export async function main() {
    console.log(Object.keys(process));
    const tsurl = "https://unpkg.com/petit-ts/dist/index.js";
    await find.call(this,tsurl);
    this.echo("done");
}
async function find(url) {
    const response = await fetch(url);
    const src = await response.text(); // Convert response to text string

    // Split text into lines
    const lines = src.split("\n");

    // Iterate through lines and find occurrences of "global"
    const occurrences = [];

    lines.forEach((line, index) => {
        //line=line.replace()
        if (line.length<500&&/\bprocess/.test(line) && /typeof/.test(line)) {
            occurrences.push({ line: index + 1, content: line.trim() });
        }
    });

    // Display results
    console.log(`Occurrences of "global": ${occurrences.length}`);
    occurrences.forEach(({ line, content }) => {
        this.echo(`Line ${line}: ${content}`);
    });
}
