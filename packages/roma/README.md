/**
# @hoge1e3/roma

英文字（ローマ字）で書かれた文字列をカタカナに変換する関数を提供するnpmパッケージです。

## インストール

```bash
npm install @hoge1e3/roma
```

または

```bash
yarn add @hoge1e3/roma
```

## 使い方

### 基本的な使い方

```typescript
import { romajiToKatakana } from '@hoge1e3/roma';

// 基本的な変換
const result = romajiToKatakana('konnichiwa'); // 'コンニチワ'
```

### 高度な変換

```typescript
import { romajiToKatakanaAdvanced } from '@hoge1e3/roma';

// 「っ」の自動処理などを含む高度な変換
const result = romajiToKatakanaAdvanced('konnnichiwa'); // 'コッンニチワ'
```

### デフォルトエクスポートを使用

```typescript
import roma from '@hoge1e3/roma';

const result1 = roma.romajiToKatakana('konnichiwa');
const result2 = roma.romajiToKatakanaAdvanced('konnnichiwa');
```

## サポートしている変換規則

パッケージは以下のような変換をサポートしています：

- 基本的な母音: a→ア, i→イ, u→ウ, e→エ, o→オ
- 子音と母音の組み合わせ: ka→カ, sa→サ, ta→タ など
- 拗音: kya→キャ, sha→シャ, cho→チョ など
- 促音: ttsuchi→ッツチ など
- 外来語用の特殊な組み合わせ: fa→ファ, va→ヴァ など

## ライセンス

MIT
*/