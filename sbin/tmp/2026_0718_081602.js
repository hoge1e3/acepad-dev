#!run
let i=0;
function gen(){
  let pitch=$distMax/$themes.length
  if($course.x>i*pitch){
    new Theme({
      x:$screenWidth,
    y:$course.ymin-20,
      text:$themes[i],
      size:20,
    });
    i++;
  }
}
function main2(){
  $themes=`水晶
自動販売機
長靴
にんにく
ぬいぐるみ
白黒
船
スナック
ホテル
ひまわり
樽
探偵
体操
56
キラキラ
デカ
桜
TWIN
耳
ゴールデン
新聞
キャンセル
ドーナツ
にわとり
ピース
サラダ
ファッション
X
半分
グリーン
エレベーター
いか
ダイエット
箱
コロッケ
和菓子
トミー
寝る
動物園
はたらくくるま
魚肉ソーセージ
Ne
月
〒
ケーキ
石碑
吉田
旅行
285
オレンジ
アルバトロス`.split("\n").
reverse();

  return $themes;
}