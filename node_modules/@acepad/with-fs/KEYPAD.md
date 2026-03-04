# KEYPAD.md — Building a Keypad with @acepad/keypad

This guide explains how to construct a virtual keyboard layout compatible with `@acepad/keypad`,
using the AcePad screen keyboard (`ace.html` + `acepad.css`) as a concrete reference.
(ace.html/ acepad.css is placed in ~/node_modules/@acepad/with-fs )

---

## Table of Contents

1. [Required DOM Structure](#1-required-dom-structure)
2. [Overall Layout and Positioning](#2-overall-layout-and-positioning)
3. [Row Structure](#3-row-structure)
4. [Button Types](#4-button-types)
5. [Character Buttons (chr)](#5-character-buttons-chr)
6. [The wide Class — Responsive Visibility](#6-the-wide-class--responsive-visibility)
7. [Modifier Buttons](#7-modifier-buttons)
8. [Command Buttons](#8-command-buttons)
9. [Arrow and Named Key Buttons](#9-arrow-and-named-key-buttons)
10. [Auto-repeat Buttons](#10-auto-repeat-buttons)
11. [Mode Switching with edit / no-edit Masks](#11-mode-switching-with-edit--no-edit-masks)
12. [Layout Justification](#12-layout-justification)
13. [Suggest Bar](#13-suggest-bar)
14. [Visual Feedback — Tip and Guide](#14-visual-feedback--tip-and-guide)
15. [CSS Variables and Responsive Breakpoints](#15-css-variables-and-responsive-breakpoints)
16. [Full Reference: data-* Attributes](#16-full-reference-data--attributes)
17. [Initialization](#17-initialization)
18. [Annotated Example Layout](#18-annotated-example-layout)

---

## 1. Required DOM Structure

The keypad must live inside an element with `id="keypad"`. The library uses
`document.getElementById('keypad')` during initialization.

A `#tip` element must also exist in the document — it is used by the long-tap module
to display a visual tooltip while the user holds a key.

```html
<span id="tip" class="tip"></span>

<div id="keypad" class="keypad">
  <!-- rows go here -->
</div>
```

---

## 2. Overall Layout and Positioning

The keypad is positioned absolutely and occupies the **bottom** of the screen by default.

```css
#keypad {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: var(--keypad-height); /* default: 45% */
    z-index: 300000; /* z-index should be greater than that of element for code completion in ace editor. */
}
```

The #editor above it(for ace editor) is sized to leave room for the keypad:

```css
#editor {
    position: absolute;
    top: 0; right: 0; left: 0;
    bottom: var(--keypad-height);
}
```

### Landscape / narrow-height mode

When the screen height is 400px or less (`max-height: 400px`), the layout switches
to a **side-by-side** arrangement: the editor takes the left portion, and the keypad
moves to the right side occupying full height:

```css
@media (max-height: 400px) {
    #editor { right: var(--keypad-width); bottom: 0; }  /* left portion */
    #keypad { top: 0; left: 60%; height: 100%; }         /* right portion */
}
```

You can override the split ratios via CSS variables on `body`:

```css
body {
    --keypad-height: 45%;   /* portrait: keypad height */
    --keypad-width:  40%;   /* landscape: keypad width */
}
```

---

## 3. Row Structure

The keypad is divided into horizontal rows using `class="row"`:

```css
#keypad .row {
    height: calc(100% / 7);  /* 7 rows fill the keypad height */
    width: 100%;
}
```

For a 7-row keyboard, each row gets `100% / 7` of the keypad height. Adjust this
divisor if your layout has a different number of rows.

Rows can contain buttons directly, or nested `div` elements for sub-groups
(e.g., for mode switching — see [Section 11](#11-mode-switching-with-edit--no-edit-masks)).

---

## 4. Button Types

Every interactive key is a `<button>` element. All buttons inside `#keypad` share
this base style — gradient background, no border, full row height:

```css
#keypad button {
    height: 100%;
    background: linear-gradient(to bottom right, #fff, #ddd);
    font-size: 20px;
    white-space: nowrap;
    padding: 0;
    margin: 0;
}
```

Buttons fall into these functional categories:

| Category | Identified by | Purpose |
|---|---|---|
| Character key | `class="chr"` | Types text; supports shift/sym layers |
| Modifier key | `data-modifier="..."` | Toggles a modifier state |
| Command key | `data-command="..."` | Fires an AcePad command |
| Named key | `data-key="..."` | Sends a keyboard key (Enter, Arrow, etc.) |
| Auto-repeat key | `class="autorepeat"` | Fires repeatedly while held |

---

## 5. Character Buttons (chr)

Add `class="chr"` to any button whose label should be split into modifier-aware layers.
The button's `innerText` is parsed by `procChr()` in `keypad.ts` as follows:

### Case A — Single alphabetic character

```html
<button class="chr">a</button>
```

Generates two spans:
- `<span class="mask no-shift">a</span>` — shown when Shift is off
- `<span class="mask shift">A</span>` — shown when Shift is on

### Case B — Two characters, first is alphabetic

```html
<button class="chr">a~</button>
```

Generates three spans:
- `<span class="mask no-shift no-sym">a</span>`
- `<span class="mask shift no-sym">A</span>`
- `<span class="mask sym">~</span>`

The first character provides the normal/shift layer; the second is the sym layer.

This example generate key:
- No Modifier key is set -> 'a'
- With Shift key   -> 'A'
- With Sym key     -> '~'

### Case C — Two characters, both non-alphabetic

```html
<button class="chr">1!</button>
```

Generates two spans:
- `<span class="mask no-sym">1</span>`
- `<span class="mask sym">!</span>`

### Case D — Single non-alphabetic character (no splitting)

```html
<button class="chr wide">(</button>
```

A single non-alphabetic character is rendered as-is without any span splitting.
In the AcePad layout this is always combined with `wide`.

### Summary

| `innerText` | Layers generated |
|---|---|
| `"a"` — single alpha | `no-shift` + `shift` |
| `"a~"` — alpha + extra char | `no-shift no-sym` + `shift no-sym` + `sym` |
| `"1!"` — two non-alpha | `no-sym` + `sym` |
| `"("` — single non-alpha | no splitting |

The modifier CSS injected by `addModifierStyle()` (defined in ~/node_modules/@acepad/keypad/src/modifier.ts) controls span visibility:

```css
/* example for shift — generated automatically */
#keypad.shift       .mask.no-shift { display: none; }
#keypad:not(.shift) .mask.shift    { display: none; }
```

---

## 6. The wide Class — Responsive Visibility

The `wide` and `no-wide` classes implement **responsive key visibility** based on screen size.

```css
/* Narrow screens (width < 500px OR height < 400px): hide wide buttons */
@media screen and ((max-width: 500px) or (max-height: 400px)) {
    .wide { display: none; }
}

/* Large screens (width >= 500px AND height >= 400px): hide no-wide buttons */
@media screen and ((min-width: 500px) and (min-height: 400px)) {
    .no-wide { display: none; }
}
```

In other words:

| Class | Shown on | Hidden on |
|---|---|---|
| `wide` | Large screens (>=500px wide AND >=400px tall) | Small or narrow screens |
| `no-wide` | Small or narrow screens | Large screens |

### How AcePad uses wide

**`wide` buttons** are extra keys that appear only on larger screens where there is
room — typically bracket, punctuation, or shortcut keys placed at the edges of rows:

```html
<button class="chr wide">(</button>   <!-- bracket shortcut, large screens only -->
<button class="chr wide">)</button>
<button class="chr wide">{</button>
```

**`no-wide` buttons** are alternatives shown only on small screens, where the wide
extras are hidden. In AcePad, the SYM toggle button uses this:

```html
<button class="no-wide" data-lock="single" data-modifier="sym">SYM</button>
```

On a large screen the extra sym-layer `chr wide` buttons are visible, so a dedicated
SYM toggle is not needed. On a small screen where those extras are hidden, the `no-wide`
SYM button appears instead.

### Wide buttons get a distinct background

```css
#keypad button.wide {
    background: linear-gradient(to bottom right, #bea, #ad9);
}
```

Wide keys use a green-tinted gradient to visually distinguish them from regular keys.

### Effect on justify

Because `justify` only distributes **visible** children, hiding/showing `wide` and
`no-wide` buttons automatically reflows the row proportions without any extra JavaScript.
(Note: justify features will be deprecated because it may be substitutable with flexbox.)
---

## 7. Modifier Buttons

A modifier button toggles or locks a modifier state when tapped.

```html
<button class="shift"     data-modifier="shift"  data-modifier-off="sym">Shift</button>
<button class="ctrl"      data-modifier="ctrl"   data-modifier-off="sym" data-lock="none">Ctrl</button>
<button class="no-wide"   data-modifier="sym"    data-lock="single">SYM</button>
<button class="selButton" data-modifier="select" data-lock="single">Sel</button>
```

### data-modifier

All modifier keys are (de)activated by tap, no holding is needed.

The modifier key to toggle. Supported values:

| Value | Effect |
|---|---|
| `shift` | Shows uppercase / alt character layer on chr buttons |
| `ctrl` | Activates ctrl-mode; next key fires `data-ctrl` command |
| `sym` | Switches chr buttons to their symbol layer |
| `edit` | Switches rows to edit-mode alternatives |
| `select` | Arrow key presses extend the text selection |

### data-lock

Controls how repeated taps lock/unlock the modifier:

| Value | Behavior |
|---|---|
| `"double"` | Tap 1 -> active(cleared after next key press); tap 2 -> locked; tap 3 -> off. **(default)** |
| `"single"` | Tap 1 -> locked immediately |
| `"none"` | Never locks; always single-shot (cleared after next key press) |

### data-modifier-off

Also clears a second modifier when this button is pressed.
Used for mutual exclusion — pressing Shift or Ctrl in AcePad also clears sym:

```html
<button data-modifier="shift" data-modifier-off="sym">Shift</button>
<button data-modifier="ctrl"  data-modifier-off="sym" data-lock="none">Ctrl</button>
```

### Visual feedback via CSS

The CSS provides built-in active-state styling. Add the matching class to each button
to get the effect:

```css
#keypad.ctrl  button.ctrl      { background: cyan; }   /* ctrl active */
#keypad.shift button.shift     { background: lime; }   /* shift active */
#keypad.lock-shift button      { background: #fd3; }   /* entire keyboard tinted when shift locked */
#keypad.select button.selButton { background: #cc0; }  /* select active */
```

```html
<button class="shift"     data-modifier="shift" ...>Shift</button>
<button class="ctrl"      data-modifier="ctrl"  ...>Ctrl</button>
<button class="selButton" data-modifier="select" ...>Sel</button>
```

---

## 8. Command Buttons

Use `data-command` to trigger named AcePad editor commands.
The value is dispatched as `ace:<command>` into the key stream.

```html
<button data-command="a-cut">Cut</button>
<button data-command="a-copy">Copy</button>
<button data-command="a-paste">Paste</button>
<button data-command="indent">Tab></button>
<button data-command="unindent"><Tab</button>
<button data-command="findFiles">Find</button>
<button data-command="genAi">genAI</button>
<button data-command="fixAi">fixAI</button>
<button data-command="quitEdit">Quit</button>
```

After a command fires, all unlocked modifiers are automatically cleared.

### data-ctrl

An alternative command triggered only when the `ctrl` modifier is active:

```html
<button class="chr" data-ctrl="selectAll">a</button>
```

When ctrl is on, pressing this button dispatches `ace:selectAll` instead of typing `a`.

---

## 9. Arrow and Named Key Buttons

Use `data-key` to send Web standard `KeyboardEvent.key` values:

```html
<button data-key="ArrowLeft">&#8592;</button>
<button data-key="ArrowUp">&#8593;</button>
<button data-key="ArrowDown">&#8595;</button>
<button data-key="ArrowRight">&#8594;</button>
<button data-key="Tab">Tab</button>
<button data-key="Escape">Esc</button>
<button data-key="Enter">Ent</button>
<button data-key="Backspace">BS</button>
<button data-key=" ">SPC</button>
```

**Arrow + `select` modifier:** When `select` is active, arrow key presses are
automatically wrapped with Shift held, extending the text selection.

**Arrow + `shift` modifier:** Pressing an arrow key while Shift is active automatically
activates and locks both `edit` and `select` modifiers.

---

## 10. Auto-repeat Buttons

Add `class="autorepeat"` to any button that should fire continuously while held:

```html
<button class="autorepeat" data-key="ArrowLeft">&#8592;</button>
<button class="autorepeat" data-key="ArrowRight">&#8594;</button>
<button class="autorepeat" data-key="ArrowUp">&#8593;</button>
<button class="autorepeat" data-key="ArrowDown">&#8595;</button>
<button class="autorepeat" data-key="Backspace">BS</button>
```

Behavior:
- After 300ms hold, the button's action starts repeating at ~30ms intervals.
- On release, repetition stops immediately.

---

## 11. Mode Switching with edit / no-edit Masks

Rows or sub-groups can swap their content based on the `edit` modifier state,
by wrapping them in a div with `class="mask edit"` or `class="mask no-edit"`:

```html
<div class="row row1">

  <!-- shown when edit modifier is OFF (normal typing mode) -->
  <div class="justify mask no-edit">
    <button class="chr">1!</button>
    <button class="chr">2@</button>
    ...
  </div>

  <!-- shown when edit modifier is ON -->
  <div class="justify mask edit">
    <button data-command="a-cut">Cut</button>
    <button data-command="a-copy">Copy</button>
    <button data-command="a-paste">Paste</button>
  </div>

</div>
```

The injected CSS (from `addModifierStyle()`) handles visibility:

```css
/* auto-generated */
#keypad.edit       .mask.no-edit { display: none; }
#keypad:not(.edit) .mask.edit    { display: none; }
```

Mask wrappers fill their row exactly:

```css
#keypad .row .mask { height: 100%; }
```

In AcePad this pattern appears across **three rows** simultaneously — the character
rows (number row, QWERTY, home row) each swap out for editor command rows
(Cut/Copy/Paste, indent/dedent/find, AI commands) when edit mode is active.

---

## 12. Layout Justification

Add `class="justify"` to a row or sub-group to automatically distribute all
**visible** children equally across the available width:

```html
<div class="row justify">
  <button>A</button>
  <button>B</button>
  <button>C</button>  <!-- each gets ~33.3% width -->
</div>
```

- A `ResizeObserver` reapplies justification on container resize.
- Hidden buttons (e.g., `wide` buttons on small screens, hidden `mask` groups) are
  excluded from the count — remaining visible buttons always fill the full width.
- Trigger manually: `import { justifyAll } from "@acepad/keypad"; justifyAll();`

`justify` can be applied at multiple levels simultaneously:

```html
<div class="row justify">            <!-- justifies the mask div within the row -->
  <div class="justify mask no-edit"> <!-- justifies buttons within this sub-group -->
    <button>...</button>
  </div>
</div>
```

---

## 13. Suggest Bar

The top of the keypad can include a horizontally scrollable suggestion bar
for word completion candidates:

```html
<div class="suggest-outer row">
  <div class="suggest-inner">
    <!-- suggestion items injected here dynamically -->
  </div>
</div>
```

CSS makes it scroll horizontally without a visible scrollbar:

```css
.suggest-outer {
    width: 100vw;
    overflow-x: scroll;
    scrollbar-width: none;
    white-space: nowrap;
}
.suggest-outer::-webkit-scrollbar { display: none; }
.suggest-inner {
    display: inline-block;
    white-space: nowrap;
}
```

This row counts as one of your total rows, so factor it into the `height: calc(100% / N)`
rule on `.row`.

---

## 14. Visual Feedback — Tip and Guide

### Tip (long-tap feedback)

The `#tip` element pops up when a key is held, showing the key label.
It changes color if the finger drifts far from the key center:

```css
.tip {
    position: absolute;
    display: none;          /* shown programmatically by longtap.ts */
    font-size: 40px;
    background-color: #08f;
    color: white;
    opacity: 60%;
    z-index: 300001;
}
.tip.border {
    background-color: #f08; /* color shifts when finger drifts off-center */
}
```

Place `#tip` anywhere in `body`. The `longtap` module positions it absolutely
over the pressed button.

### Guide (Bigger button overlay for suggestion)

`showGuide(button, size)` creates a temporary floating overlay over a button,

Integrated with [@acepad/suggest](https://www.npmjs.com/package/@acepad/suggest), They display above the buttons likely to be pressed next from the editor's current cursor position.
The guide shrinks and disappears automatically after a short animation.

```css
.guide {
    position: absolute;
    font-size: 40px;
    background-color: #ddd;
    border: solid 2px blue;
    z-index: 300001;
}
```


---

## 15. CSS Variables and Responsive Breakpoints

| Variable | Default | Description |
|---|---|---|
| `--keypad-height` | `45%` | Keypad height in portrait mode |
| `--keypad-width` | `40%` | Keypad width in landscape mode |

Set these on `body` to customize the layout:

```css
body {
    --keypad-height: 45%;
    --keypad-width: 40%;
}
```

| Breakpoint | Condition | Effect |
|---|---|---|
| Narrow/small | `max-width: 500px` **or** `max-height: 400px` | `.wide` hidden |
| Large | `min-width: 500px` **and** `min-height: 400px` | `.no-wide` hidden |
| Landscape | `max-height: 400px` | Editor and keypad switch to side-by-side layout |

---

## 16. Full Reference: data-* Attributes

| Attribute | Type | Description |
|---|---|---|
| `data-text` | string | Text to insert (fallback if no `data-key`) |
| `data-key` | string | `KeyboardEvent.key` value to dispatch |
| `data-command` | string | AcePad command, sent as `ace:<value>` |
| `data-modifier` | `KP_ModifierKeys` | Makes this button a modifier toggle |
| `data-modifier-off` | `KP_ModifierKeys` | Also clears this modifier on press |
| `data-lock` | `"single"` / `"double"` / `"none"` | Lock behavior for modifier buttons |
| `data-ctrl` | string | Command dispatched when `ctrl` modifier is active |
| `data-keycode` | string | Legacy numeric keycode (superseded by `data-key`) |

---

## 17. Initialization

After your HTML is ready, call `initKeypad` once:

```ts
import { initKeypad } from "@acepad/keypad";
import type { EventHandler } from "@hoge1e3/events";

declare const events: EventHandler; // provided by your app

initKeypad({ events });
```

`initKeypad` will:
1. Find `#keypad` in the DOM
2. Strip empty text nodes from the keypad tree
3. Call `initKey()` on every `button` inside `#keypad`, which:
   - Processes `chr` buttons (splits `innerText` into layered spans)
   - Attaches long-tap and auto-repeat handlers via `setLongtap()`
   - Registers any custom modifier keys declared via `data-modifier`
4. Inject modifier visibility CSS via `addModifierStyle()`
5. Run `justifyAll()` for initial button widths

The `events` object receives two events from the keypad:
- `keyclick` — fired on every key press: `{ b: HTMLElement }`
- `renderModifierState` — fired after modifier state is re-rendered: `{}`

---

## 18. Annotated Example Layout

The following is the full AcePad layout with inline annotations:

```html
<div id="keypad" class="keypad">

  <!-- Required by longtap module for press feedback -->
  <span id="tip" class="tip"></span>

  <!-- .one-hand: custom CSS class for one-handed mode (height:100%) -->
  <div class="mask one-hand">

    <!-- Row 1/7: Suggest bar (horizontally scrollable word candidates) -->
    <div class="suggest-outer row">
      <div class="suggest-inner">suggest</div>
    </div>

    <!-- Row 2/7: Arrow keys + punctuation shortcuts + SYM toggle
         - Arrow and Tab: always visible
         - chr wide: extra punctuation, shown only on large screens (>=500x400)
         - no-wide SYM: shown only on small screens (replaces the hidden wide extras) -->
    <div class="row justify">
      <button class="autorepeat" data-key="ArrowLeft">&#8592;</button>
      <button class="autorepeat" data-key="ArrowUp">&#8593;</button>
      <button data-key="Tab">Tab</button>
      <button class="chr wide">!</button>    <!-- large screen only -->
      <button class="chr wide">@</button>
      <button class="chr wide">#</button>
      <button class="chr wide">`</button>
      <button class="chr wide">%</button>
      <button class="chr wide">^</button>
      <button class="chr wide">&amp;</button>
      <button class="autorepeat" data-key="ArrowDown">&#8595;</button>
      <button class="autorepeat" data-key="ArrowRight">&#8594;</button>
      <!-- no-wide: only visible on small screens as a SYM layer toggle -->
      <button class="no-wide" data-lock="single" data-modifier="sym">SYM</button>
    </div>

    <!-- Row 3/7: Number row (normal) / Cut-Copy-Paste (edit mode)
         - no-edit group: number/bracket keys for normal typing
         - edit group: clipboard commands appear instead -->
    <div class="row row1">
      <div class="justify mask no-edit">
        <button class="chr wide">(</button>    <!-- wide: large screen only -->
        <button class="chr">1!</button>         <!-- no-sym:1, sym:! -->
        <button class="chr">2@</button>
        <button class="chr">3#</button>
        <button class="chr">4$</button>
        <button class="chr">5%</button>
        <button class="chr wide">)</button>
        <button class="chr wide">?</button>
        <button class="chr wide">]</button>
        <button class="chr">6^</button>
        <button class="chr">7&amp;</button>
        <button class="chr">8*</button>
        <button class="chr">9(</button>
        <button class="chr">0)</button>
        <button class="chr wide">{</button>
      </div>
      <div class="justify mask edit">
        <button data-command="a-cut">Cut</button>
        <button data-command="a-copy">Copy</button>
        <button data-command="a-paste">Paste</button>
      </div>
    </div>

    <!-- Row 4/7: QWERTY top row (normal) / Sel-Indent-Find (edit mode)
         - chr keys: first char = normal/shift layer, second char = sym layer
         - chr wide extras: bracket shortcuts, large screens only -->
    <div class="row justify">
      <div class="justify mask no-edit">
        <button class="chr wide">[</button>
        <button class="chr">q\</button>    <!-- no-sym:q/Q, sym:\ -->
        <button class="chr">w|</button>
        <button class="chr">e/</button>
        <button class="chr">r[</button>
        <button class="chr">t]</button>
        <button class="chr wide">}</button>
        <button class="chr wide">&lt;</button>
        <button class="chr wide">&gt;</button>
        <button class="chr">y{</button>
        <button class="chr">u}</button>
        <button class="chr">i&lt;</button>
        <button class="chr">o&gt;</button>
        <button class="chr">p=</button>
        <button class="chr wide">=</button>
      </div>
      <div class="justify mask edit">
        <!-- selButton class -> yellow bg when select modifier is active -->
        <button class="selButton" data-modifier="select" data-lock="single">Sel</button>
        <button data-command="unindent">&lt;Tab</button>
        <button data-command="indent">Tab&gt;</button>
        <button data-command="findFiles">Find</button>
      </div>
    </div>

    <!-- Row 5/7: Home row (normal) / AI commands (edit mode) -->
    <div class="row justify">
      <div class="justify mask no-edit">
        <button class="chr wide">+</button>
        <button class="chr">a~</button>    <!-- no-sym:a/A, sym:~ -->
        <button class="chr">s`</button>
        <button class="chr">d'</button>
        <button class="chr">f?</button>
        <button class="chr wide">$</button>
        <button class="chr wide">\</button>
        <button class="chr wide">|</button>
        <button class="chr wide">~</button>
        <button class="chr">g+</button>
        <button class="chr">h-</button>
        <button class="chr">j"</button>
        <button class="chr">k;</button>
        <button class="chr">l:</button>
        <button class="chr wide">;</button>
      </div>
      <div class="justify mask edit">
        <button data-command="genAi">genAI</button>
        <button data-command="fixAi">fixAI</button>
        <button data-command="quitEdit">Quit</button>
      </div>
    </div>

    <!-- Row 6/7: Shift + ZXCV row + Backspace
         - class="shift" -> gets lime background when active
         - data-modifier-off="sym": pressing Shift also clears sym (mutual exclusion)
         - Backspace: autorepeat -->
    <div class="row justify">
      <button class="shift" data-modifier="shift" data-modifier-off="sym">Shift</button>
      <button class="chr">z</button>
      <button class="chr">x</button>
      <button class="chr">c</button>
      <button class="chr">v</button>
      <button class="chr wide">'</button>
      <button class="chr wide">*</button>
      <button class="chr wide">/</button>
      <button class="chr wide">-</button>
      <button class="chr wide">"</button>
      <button class="chr">b_</button>
      <button class="chr">n,</button>
      <button class="chr">m.</button>
      <button class="autorepeat" data-key="Backspace">BS</button>
    </div>

    <!-- Row 7/7: Ctrl + Esc + Space row + Enter
         - class="ctrl" -> gets cyan background when active
         - data-lock="none": Ctrl never locks, always single-shot
         - data-modifier-off="sym": pressing Ctrl also clears sym
         - Two SPC buttons for ergonomic left/right thumb reach
           (right SPC is "wide": only on large screens) -->
    <div class="row justify">
      <button class="ctrl" data-modifier="ctrl" data-modifier-off="sym" data-lock="none">Ctrl</button>
      <button data-key="Escape">Esc</button>
      <button class="chr wide">,</button>
      <button class="chr wide">:</button>
      <button data-key=" ">SPC</button>              <!-- left thumb space -->
      <button class="chr wide">_</button>
      <button data-key=" " class="wide">SPC</button> <!-- right thumb space (large screen only) -->
      <button class="chr wide">.</button>
      <button data-key="Enter">Ent</button>
    </div>

  </div><!-- .mask.one-hand -->
</div><!-- #keypad -->
```

---

## Design Tips

**Use `wide` for extras, not essentials.** The keyboard must be fully usable on small
screens without any `wide` buttons. Reserve `wide` for convenience shortcuts (brackets,
extra punctuation) that enhance the experience on larger screens.

**Provide `no-wide` alternatives when needed.** If a feature covered by a `wide` button
is also needed on small screens, add a `no-wide` counterpart. AcePad does this with
the SYM toggle: on large screens the sym-layer `chr wide` keys are visible and sufficient;
on small screens the `no-wide` SYM button fills the gap.

**Mutual exclusion between modifiers.** Use `data-modifier-off` to clear conflicting
modifiers. AcePad keeps Shift, Ctrl, and Sym mutually exclusive this way.

**Ctrl as single-shot only.** Setting `data-lock="none"` on the Ctrl button means it
never locks — it always clears after the next key press, matching standard keyboard behavior.

**Multiple Space buttons.** AcePad includes two SPC buttons (one plain, one `wide`)
for ergonomic thumb access. Both send `data-key=" "` and are functionally identical.

**Row count and height.** The `.row` height is `calc(100% / 7)` in AcePad's CSS,
matching its 7 rows (suggest bar + 6 key rows). If you add or remove rows, update
this divisor accordingly.
