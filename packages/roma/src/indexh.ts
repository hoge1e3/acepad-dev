
/*
fixit:
子音2個でっ
例
yappari　→ やっぱり
*/
/**
 * ローマ字からひらがなへの変換mapping
 */
const romaToKana: Record<string, string> = {
    // 基本的な母音
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    
    // か行
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    
    // さ行
    'sa': 'さ', 'si': 'し','shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'za': 'ざ', 'ji': 'じ', 'zi': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    
    // た行
    'ta': 'た', 'ti': 'ち', 'chi': 'ち', 'tsu': 'つ', 'tu': 'つ', 'te': 'て', 'to': 'と',
    'da': 'だ', 'di': 'でぃ', 'du': 'どぅ', 'de': 'で', 'do': 'ど',
    
    // な行
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    
    // は行
    'ha': 'は', 'hi': 'ひ', 'hu': 'ふ','fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
    
    // ま行
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    
    // や行
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    
    // ら行
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    
    // わ行
    'wa': 'わ', 'wo': 'を', 'n': 'ん',
    
    // 拗音
    'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
    'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
    'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
    'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
    'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
    'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
    'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
    'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
    'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
    'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
    'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
    
    // 小さい文字
    'la': 'ぁ', 'li': 'ぃ', 'lu': 'ぅ', 'le': 'ぇ', 'lo': 'ぉ',
    'lya': 'ゃ', 'lyu': 'ゅ', 'lyo': 'ょ',
    'ltsu': 'っ',
    
    // 特殊な組み合わせ
    'nn': 'ん',
    'tchi': 'っち',
    'xtsu': 'っ',
    'xn': 'ん',
    "-":"ー",
    // 外来語用
    'fa': 'ふぁ', 'fi': 'ふぃ', 'fe': 'ふぇ', 'fo': 'ふぉ',
    'va': 'ゔぁ', 'vi': 'ゔぃ', 'vu': 'ゔ', 've': 'ゔぇ', 'vo': 'ゔぉ',
    'wi': 'うぃ', 'we': 'うぇ',
    'kwa': 'くぁ', 'kwi': 'くぃ', 'kwe': 'くぇ', 'kwo': 'くぉ'
  };
  
  /**
   * ローマ字の文字列をひらがなに変換する
   * @param romaji - 変換するローマ字の文字列
   * @returns ひらがなの文字列
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
      
      // matchしない場合、そのまま追加
      if (!matched) {
        result += pattern1;
        i += 1;
      }
    }
    
    return result;
  }
  
  /**
   * ローマ字の文字列をひらがなに変換する（より高度なばーじょん）
   * 「っ」の扱いやその他の特殊caseを含む
   * @param romaji - 変換するローマ字の文字列
   * @returns ひらがなの文字列
   */
  export function romajiToKatakanaAdvanced(romaji: string): {
      i:number,
      s:string,
    }[] {
    //if (!romaji) return '';
    
    // 小文字に変換して処理を簡単にする
    romaji = romaji.toLowerCase();
    
    // 重複子音を「っ」に変換する準備
    //romaji = romaji.replace(/([kstcgzjdbfphmyrw])\1/g, "xtsu$1");
    
    let result = '';
    let i = 0;
    let resulta=[] as {
      i:number,
      s:string,
    }[];
    function add(s:string){
      result+=s;
      resulta.push({
        i,s
      })
    }
    while (i < romaji.length) {
      // 最長一致を試みる
      let matched = false;
      if(romaji.substring(i,i+2).match(
        /^([kstcgzjdbfphmyrw])\1/)){
        add("っ");
        i++;
        continue
      }
      // 4文字のパターン (一部の拗音用)
      if (i + 4 <= romaji.length) {
        const pattern4 = romaji.substring(i, i + 4);
        if (romaToKana[pattern4]) {
          add(romaToKana[pattern4]);
          i += 4;
          matched = true;
          continue;
        }
      }
      
      // 3文字のパターン
      if (i + 3 <= romaji.length) {
        const pattern3 = romaji.substring(i, i + 3);
        if (romaToKana[pattern3]) {
          add(romaToKana[pattern3]);
          i += 3;
          matched = true;
          continue;
        }
      }
      
      // 2文字のパターン
      if (i + 2 <= romaji.length) {
        const pattern2 = romaji.substring(i, i + 2);
        if (romaToKana[pattern2]) {
          add(romaToKana[pattern2]);
          i += 2;
          matched = true;
          continue;
        }
      }
      
      // 1文字のパターン
      const pattern1 = romaji.substring(i, i + 1);
      if (romaToKana[pattern1]) {
        add(romaToKana[pattern1]);
        i += 1;
        matched = true;
        continue;
      }
      
      // matchしない場合、そのまま追加
      if (!matched) {
        add(pattern1);
        i += 1;
      }
    }
    
    return resulta;
  }
  
  // えくすぽーとするAPI
  export default {
    romajiToKatakana,
    romajiToKatakanaAdvanced
  };
export function katakanaToHiragana(str: string) {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}