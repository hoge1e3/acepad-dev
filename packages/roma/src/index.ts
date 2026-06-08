// src/index.ts
/**
 * ローマ字からカタカナへの変換マッピング
 */
const romaToKana: Record<string, string> = {
    // 基本的な母音
    'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',
    
    // カ行
    'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',
    'ga': 'ガ', 'gi': 'ギ', 'gu': 'グ', 'ge': 'ゲ', 'go': 'ゴ',
    
    // サ行
    'sa': 'サ', 'shi': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',
    'za': 'ザ', 'ji': 'ジ', 'zi': 'ジ', 'zu': 'ズ', 'ze': 'ゼ', 'zo': 'ゾ',
    
    // タ行
    'ta': 'タ', 'ti': 'チ', 'chi': 'チ', 'tsu': 'ツ', 'tu': 'ツ', 'te': 'テ', 'to': 'ト',
    'da': 'ダ', 'di': 'ディ', 'du': 'ドゥ', 'de': 'デ', 'do': 'ド',
    
    // ナ行
    'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',
    
    // ハ行
    'ha': 'ハ', 'hi': 'ヒ', 'hu': 'フ','fu': 'フ', 'he': 'ヘ', 'ho': 'ホ',
    'ba': 'バ', 'bi': 'ビ', 'bu': 'ブ', 'be': 'ベ', 'bo': 'ボ',
    'pa': 'パ', 'pi': 'ピ', 'pu': 'プ', 'pe': 'ペ', 'po': 'ポ',
    
    // マ行
    'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',
    
    // ヤ行
    'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',
    
    // ラ行
    'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',
    
    // ワ行
    'wa': 'ワ', 'wo': 'ヲ', 'n': 'ン',
    
    // 拗音
    'kya': 'キャ', 'kyu': 'キュ', 'kyo': 'キョ',
    'gya': 'ギャ', 'gyu': 'ギュ', 'gyo': 'ギョ',
    'sha': 'シャ', 'shu': 'シュ', 'sho': 'ショ',
    'ja': 'ジャ', 'ju': 'ジュ', 'jo': 'ジョ',
    'cha': 'チャ', 'chu': 'チュ', 'cho': 'チョ',
    'nya': 'ニャ', 'nyu': 'ニュ', 'nyo': 'ニョ',
    'hya': 'ヒャ', 'hyu': 'ヒュ', 'hyo': 'ヒョ',
    'bya': 'ビャ', 'byu': 'ビュ', 'byo': 'ビョ',
    'pya': 'ピャ', 'pyu': 'ピュ', 'pyo': 'ピョ',
    'mya': 'ミャ', 'myu': 'ミュ', 'myo': 'ミョ',
    'rya': 'リャ', 'ryu': 'リュ', 'ryo': 'リョ',
    
    // 小さい文字
    'la': 'ァ', 'li': 'ィ', 'lu': 'ゥ', 'le': 'ェ', 'lo': 'ォ',
    'lya': 'ャ', 'lyu': 'ュ', 'lyo': 'ョ',
    'ltsu': 'ッ',
    
    // 特殊な組み合わせ
    'nn': 'ン',
    'tchi': 'ッチ',
    'xtsu': 'ッ',
    'xn': 'ン',
    
    // 外来語用
    'fa': 'ファ', 'fi': 'フィ', 'fe': 'フェ', 'fo': 'フォ',
    'va': 'ヴァ', 'vi': 'ヴィ', 'vu': 'ヴ', 've': 'ヴェ', 'vo': 'ヴォ',
    'wi': 'ウィ', 'we': 'ウェ',
    'kwa': 'クァ', 'kwi': 'クィ', 'kwe': 'クェ', 'kwo': 'クォ'
  };
  
  /**
   * ローマ字の文字列をカタカナに変換する
   * @param romaji - 変換するローマ字の文字列
   * @returns カタカナの文字列
   */
  export function romajiToKatakana(romaji: string): string {
    if (!romaji) return '';
    
    // 小文字に変換して処理を簡単にする
    romaji = romaji.toLowerCase();
    
    let result = '';
    let i = 0;
    
    while (i < romaji.length) {
      // 最長一致を試みる
      let matched = false;
      
      // 3文字のパターン
      if (i + 3 <= romaji.length) {
        const pattern3 = romaji.substring(i, i + 3);
        if (romaToKana[pattern3]) {
          result += romaToKana[pattern3];
          i += 3;
          matched = true;
          continue;
        }
      }
      
      // 2文字のパターン
      if (i + 2 <= romaji.length) {
        const pattern2 = romaji.substring(i, i + 2);
        if (romaToKana[pattern2]) {
          result += romaToKana[pattern2];
          i += 2;
          matched = true;
          continue;
        }
      }
      
      // 1文字のパターン
      const pattern1 = romaji.substring(i, i + 1);
      if (romaToKana[pattern1]) {
        result += romaToKana[pattern1];
        i += 1;
        matched = true;
        continue;
      }
      
      // マッチしない場合、そのまま追加
      if (!matched) {
        result += pattern1;
        i += 1;
      }
    }
    
    return result;
  }
  
  /**
   * ローマ字の文字列をカタカナに変換する（より高度なバージョン）
   * 「っ」の扱いやその他の特殊ケースを含む
   * @param romaji - 変換するローマ字の文字列
   * @returns カタカナの文字列
   */
  export function romajiToKatakanaAdvanced(romaji: string): string {
    if (!romaji) return '';
    
    // 小文字に変換して処理を簡単にする
    romaji = romaji.toLowerCase();
    
    // 重複子音を「っ」に変換する準備
    romaji = romaji.replace(/([kstcgzjdbfphmyrw])\1/g, "xtsu$1");
    
    let result = '';
    let i = 0;
    
    while (i < romaji.length) {
      // 最長一致を試みる
      let matched = false;
      
      // 4文字のパターン (一部の拗音用)
      if (i + 4 <= romaji.length) {
        const pattern4 = romaji.substring(i, i + 4);
        if (romaToKana[pattern4]) {
          result += romaToKana[pattern4];
          i += 4;
          matched = true;
          continue;
        }
      }
      
      // 3文字のパターン
      if (i + 3 <= romaji.length) {
        const pattern3 = romaji.substring(i, i + 3);
        if (romaToKana[pattern3]) {
          result += romaToKana[pattern3];
          i += 3;
          matched = true;
          continue;
        }
      }
      
      // 2文字のパターン
      if (i + 2 <= romaji.length) {
        const pattern2 = romaji.substring(i, i + 2);
        if (romaToKana[pattern2]) {
          result += romaToKana[pattern2];
          i += 2;
          matched = true;
          continue;
        }
      }
      
      // 1文字のパターン
      const pattern1 = romaji.substring(i, i + 1);
      if (romaToKana[pattern1]) {
        result += romaToKana[pattern1];
        i += 1;
        matched = true;
        continue;
      }
      
      // マッチしない場合、そのまま追加
      if (!matched) {
        result += pattern1;
        i += 1;
      }
    }
    
    return result;
  }
  
  // エクスポートするAPI
  export default {
    romajiToKatakana,
    romajiToKatakanaAdvanced
  };