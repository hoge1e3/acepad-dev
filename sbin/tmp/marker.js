#!run
/*global ace*/
import css from "@acepad/css";
export async function main2(){
    css(import.meta.url,
  "marker.css");

  ace.define(
  "ace/mode/todo_highlight_rules",
  ["require", "exports", "ace/lib/oop", "ace/mode/text_highlight_rules"],
  function (require, exports) {
    const oop = require("ace/lib/oop");
    const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    const TodoHighlightRules = function () {
      this.$rules = {
        start: [
          {
            token: "todo.red",     // ← CSS クラス名になる
            regex: /TODO:.*/       // ← 赤くしたい正規表現
          }
        ]
      };
    };

    oop.inherits(TodoHighlightRules, TextHighlightRules);
    exports.TodoHighlightRules = TodoHighlightRules;
  }
);
ace.define(
  "ace/mode/todo",
  ["require", "exports", "ace/lib/oop", "ace/mode/text", "ace/mode/todo_highlight_rules"],
  function (require, exports) {
    const oop = require("ace/lib/oop");
    const TextMode = require("ace/mode/text").Mode;
    const TodoHighlightRules =
      require("ace/mode/todo_highlight_rules").TodoHighlightRules;

    const Mode = function () {
      this.HighlightRules = TodoHighlightRules;
    };

    oop.inherits(Mode, TextMode);
    exports.Mode = Mode;
  }
);
const session=
this.$acepad.getMainEditor().
  session.setMode("ace/mode/todo");
  return ;
}
//TODO:hige
export function main(){
  createRegexColorMode("todo", [
  {
    regex: /TODO:/,
    css: "color: red; font-weight: bold;"
  },
  {
    regex: /FIXME:/,
    css: "color: orange;"
  }
]);

//(editor.session.setMode("ace/mode/alert");
  const session=
this.$acepad.getMainEditor().
  session.setMode("ace/mode/todo");
  return ;

} 
function createRegexColorMode(modeName, rules) {
  const aceDefine = ace.define;

  // ユニークな HighlightRules 名
  const rulesName = `ace/mode/${modeName}_highlight_rules`;

  // ① HighlightRules
  aceDefine(
    rulesName,
    ["require", "exports", "ace/lib/oop", "ace/mode/text_highlight_rules"],
    function (require, exports) {
      const oop = require("ace/lib/oop");
      const TextHighlightRules =
        require("ace/mode/text_highlight_rules").TextHighlightRules;

      const HighlightRules = function () {
        this.$rules = {
          start: rules.map((r, i) => ({
            token: `r${i}`,   // 内部用トークン名
            regex: r.regex
          }))
        };
      };

      oop.inherits(HighlightRules, TextHighlightRules);
      exports.HighlightRules = HighlightRules;
    }
  );

  // ② Mode
  aceDefine(
    `ace/mode/${modeName}`,
    ["require", "exports", "ace/lib/oop", "ace/mode/text", rulesName],
    function (require, exports) {
      const oop = require("ace/lib/oop");
      const TextMode = require("ace/mode/text").Mode;
      const HighlightRules = require(rulesName).HighlightRules;

      const Mode = function () {
        this.HighlightRules = HighlightRules;
      };

      oop.inherits(Mode, TextMode);
      exports.Mode = Mode;
    }
  );

  // ③ CSS を動的注入
  const style = document.createElement("style");
  style.type = "text/css";

  style.textContent = rules
    .map((r, i) => `.ace_r${i} { ${r.css} }`)
    .join("\n");

  document.head.appendChild(style);
}