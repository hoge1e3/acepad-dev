
let h=getHome();
let src=h.rel("scripts.js");
let dst=h.rel("mod.html");
export async function test(){
dst.text(`<!DOCTYPE html>
<html>
    <head>
        <script type="module">
${src.text()}
        </script>
    </head>
    <body>
    </body>
</html>`);
await sh.pf(dst);
location.href=dst.relPath(h);
}