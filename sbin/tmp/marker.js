#!run
/*global ace*/
import css from "@acepad/css";
export async function main(){
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