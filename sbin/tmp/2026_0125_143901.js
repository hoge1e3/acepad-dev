#!run
export async function main(){ 
    const sh=this;
    // Set variable
    sh.set("myvar", "hello");
    sh.$myvar = "hello";  // Alternative syntax

    // Get variable
    const value = sh.get("myvar");
    const value2 = sh.$myvar;  // Alternative syntax

    // Use in commands
    sh.echo(sh.$myvar);  // Outputs: hello
    process.env.envvar="good";
    sh.echo(sh.$envvar);  // Outputs: good
}
