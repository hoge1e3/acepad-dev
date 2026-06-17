# For agents

Do not run any commands, only modify files.

# Making apps and commands in this project

Acepad is a browser-based, Node-like programming environment. Programs in this
folder are usually command modules that can also create UI. Prefer the local
patterns in `bin/`, `sbin/`, and `samples/` over a separate web-app scaffold.

## Command module shape

- Put runnable commands in `bin/` or `sbin/`. Use `bin/` for regular user-facing
  commands and `sbin/` for experiments, tools, demos, and system/debug helpers.
- Start runnable JavaScript files with `#!run` or `//!run`.
- Export `main`; it may be sync or async. Command arguments are passed as
  positional parameters.
- Inside `main`, `this` is the shell object from `@acepad/shell`.
- Do not add a dev server for ordinary apps in this folder. Apps are launched by
  running the command, pressing F5 on a `#!run` file, or using Acepad shell
  commands.

```js
#!run
export async function main(file = ".") {
  const f = this.resolve(file, true);
  this.echo(f.path());
}
```

Common shell-object APIs used by local commands:

- `this.echo(...)` prints command output.
- `this.getcwd()` returns the current directory file object.
- `this.resolve(path, true)` resolves a path; pass `true` when the path may be a
  directory or should use Acepad's path behavior.
- `this.directorify(path)` resolves a directory destination.
- File objects commonly use `.path()`, `.name()`, `.exists()`, `.isDir()`,
  `.isLink()`, `.rel(name)`, `.ls()`, `.listFiles()`, `.text()`, `.setBytes()`,
  `.copyTo(dst)`, `.moveTo(dst)`, `.rm(options)`, `.mkdir()`, `.link(target)`,
  and `.lastUpdate()`.
- `this.collectOptions(args)` parses command options; local commands usually pop
  the returned options object from the end of the array.
- `this.edit(file, options)` opens a file in Acepad.
- `this.which(name)` resolves a command by name.
- `this.sleep(seconds)` is used for short async delays.
- `this.$acepad` gives access to the current Acepad editor/session when a tool
  needs editor integration.

## Creating new commands

- Use the existing `newcmd` command pattern for quick command scripts. It
  creates a `#!run` template with `export async function main()`.
- Keep command modules small and direct. Most commands in `bin/` and `sbin/`
  are single-file modules.
- For npm-style packages, use the local `npm-init` pattern: create the package
  under the nearest `node_modules/`, set `"type": "module"`, and make
  `scripts.test` run a `#!run` test file.
- npm-related commands live in `node_modules/.bin`.

## Widget apps

Use `@acepad/widget` for UI launched from a command.

- `showWidget(elementOrHtml)` opens a widget and returns an object with
  `.element` and `.close()`.
- `show()` opens a printable widget; call `.print(domOrText)` to render content.
- `showIframe(fileOrUrl, options)` opens an iframe for HTML files or external
  pages.
- `this.widget(component)` is used with `@hoge1e3/dom-ref` style reactive
  components.
- Use `@hoge1e3/dom` or its `generator()`/`t` helpers for DOM construction
  instead of hand-concatenating HTML when the UI has behavior.

Canvas/widget example:

```js
#!run
import {showWidget} from "@acepad/widget";
import {t} from "@hoge1e3/dom";

const raf = () => new Promise(requestAnimationFrame);

export async function main() {
  const wid = showWidget(t.canvas());
  const cv = wid.element;
  const ctx = cv.getContext("2d");
  const w = cv.width;
  const h = cv.height;

  while (true) {
    let y = h / 2;
    for (let i = 0; i < w; i++) {
      ctx.fillRect(i, y, 1, 1);
      y += Math.random() * h < y ? 1 : -1;
      if (y > h) y = h;
      if (y < 0) y = 0;
    }
    await raf();
  }
}
```

Reactive widget example:

```js
import {r} from "@hoge1e3/dom-ref";
import {ref} from "@hoge1e3/ref";

export async function main() {
  return this.widget(wmain);
}

function wmain({id: idgen, t}) {
  /*
  `idgen.name` -> "idOfThisWidget-name"
  `idgen()` -> a new id beginning with "idOfThisWidget-"
  `t` is the DOM tag generator.
  `r(refobj, render)` rerenders when `refobj` changes.
  */
  const Item = (count = 0, id = idgen()) => ({
    count,
    id,
    inc: () => Item(count + 1, id),
  });
  const itemRef = () => ref(Item());
  const itemrsr = ref([itemRef()]);
  const b = (c, a) => t.button({onclick: a}, c);

  return t.div(
    t.h1("test"),
    r(itemrsr, (itemrs) =>
      t.div(
        {id: idgen.items},
        ...itemrs.map((itemr) =>
          r(itemr, (item) =>
            t.div(
              {id: idgen[item.id]},
              t.span(item.count),
              b("inc", () => (itemr.value = item.inc())),
              b("del", () =>
                (itemrsr.value = itemrsr.value.filter((e) => e !== itemr))
              )
            )
          )
        )
      )
    ),
    b("add", () => (itemrsr.value = [...itemrsr.value, itemRef()]))
  );
}
```

## Iframe and browser APIs

- Use `showIframe(this.resolve("file.html"), {pNode: 1})` for companion HTML
  files that should run inside the Acepad environment.
- Use `showIframe(url)` or `window.open(url)` for external tools/docs/login
  flows.
- Browser APIs such as `document`, `window`, `FileReader`,
  `requestAnimationFrame`, `setInterval`, and `URLSearchParams` are available in
  widget/browser-side commands.
- If a command creates temporary DOM directly, clean it up or keep a reference
  so repeated runs do not stack duplicate UI.

## File and editor integration

- Use `@acepad/files` helpers such as `openFile`, `current`, `modeMap`, or
  session helpers when working with current files and editor state.
- Before opening a file from a command, local code often calls
  `this.$acepad.setCurrentEditor(this.$acepad.getMainEditor())`.
- Use `this.edit(file, {row, column})` to place the cursor after generating or
  locating a file.

## References

- Shell command APIs: https://www.npmjs.com/package/@acepad/shell
- Widget APIs: https://www.npmjs.com/package/@acepad/widget
- Examples in this folder: `bin/`, `sbin/`, and `samples/`

