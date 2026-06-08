import { romajiToKatakana } from "../src/index.js";

function testRomajiToKatakana() {
  const testCases = [
    { input: "konnichiwa", expected: "コンニチハ" },
    { input: "sayonara", expected: "サヨナラ" },
    { input: "arigatou", expected: "アリガトウ" },
    { input: "ohayou", expected: "オハヨウ" },
    { input: "konbanwa", expected: "コンバンワ" },
    { input: "sukiyaki", expected: "スキヤキ" },
  ];

  testCases.forEach(({ input, expected }) => {
    const result = romajiToKatakana(input);
    console.log(result);
    console.assert(result === expected, `Expected ${expected}, but got ${result}`);
  });
}
testRomajiToKatakana();