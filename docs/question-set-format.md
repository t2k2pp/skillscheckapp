# 問題集JSONファイル 定義書

## 📋 概要

このドキュメントは、スキルチェッカーライブラリで使用する問題集JSONファイルの正式な定義書です。新しい問題集を作成する際は、必ずこの定義に従ってください。

## 🚨 重要な注意事項

### 難易度レベル（level）の制限

**⚠️ 必須：以下の3つの値のみ使用可能**

```typescript
enum QuestionLevel {
  Beginner = '基礎',      // 基礎レベル
  Intermediate = '中級',   // 中級レベル  
  Advanced = '上級',      // 上級レベル
}
```

**❌ 使用禁止の値（例）：**
- `"Beginner"`, `"Intermediate"`, `"Advanced"` （英語）
- `"beginner"`, `"intermediate"`, `"advanced"` （英語小文字）
- `"エキスパート"`, `"マスター"`, `"アーキテクト"`
- `"至高"`, `"宇宙"`, `"イノベーター"`
- `"Expert"`, `"Master"`, `"Professional"`
- その他、上記3つ以外のすべての値

## 📄 JSONファイル構造

### ファイル全体の構造

```json
{
  "id": "example-test",
  "title": "テスト名",
  "description": "テストの説明文",
  "difficulty": "LEVEL_NAME",
  "version": "1.0.0",
  "author": "作成者名",
  "lastUpdated": "YYYY-MM-DD",
  "language": "ja",
  "passingScore": 65,
  "questions": [
    // 問題配列（詳細は後述）
  ]
}
```

### メタデータフィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|------|
| `id` | string | ✅ | 問題集の一意識別子（英数字とハイフン） |
| `title` | string | ✅ | 問題集のタイトル |
| `description` | string | ✅ | 問題集の説明文 |
| `difficulty` | string | ✅ | 問題集全体の難易度（BRONZE, SILVER, GOLD等） |
| `version` | string | ✅ | バージョン番号（セマンティックバージョニング） |
| `author` | string | ✅ | 作成者名またはチーム名 |
| `lastUpdated` | string | ✅ | 最終更新日（YYYY-MM-DD形式） |
| `language` | string | ✅ | 言語コード（"ja"、"en"等） |
| `passingScore` | number | ✅ | 合格点（パーセンテージ） |

### 問題（questions）の構造

```json
{
  "id": 1,
  "level": "基礎",
  "text": "問題文",
  "options": [
    "選択肢1",
    "選択肢2", 
    "選択肢3",
    "選択肢4"
  ],
  "correctAnswerIndex": 0,
  "explanation": "解説文"
}
```

### 問題フィールドの詳細

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|------|
| `id` | number | ✅ | 問題番号（連続した整数） |
| `level` | string | ✅ | **"基礎" / "中級" / "上級"のみ** |
| `text` | string | ✅ | 問題文 |
| `options` | string[] | ✅ | 選択肢の配列（通常4つ） |
| `correctAnswerIndex` | number | ✅ | 正解の選択肢インデックス（0から開始） |
| `explanation` | string | ✅ | 解説文 |

## 📊 難易度分布の推奨例

### 基礎レベル中心（BRONZE等）
- Beginner: 50-60%（約45問）
- Intermediate: 30-35%（約25問）  
- Advanced: 10-15%（約5問）

### 中級レベル中心（SILVER等）
- Beginner: 20-30%（約20問）
- Intermediate: 60-70%（約50問）
- Advanced: 10-20%（約5問）

### 上級レベル中心（GOLD等）
- Beginner: 5-10%（約5問）
- Intermediate: 30-40%（約25問）
- Advanced: 50-65%（約45問）

### 最上級レベル（PLATINUM, DIAMOND, SAPPHIRE等）
- Advanced: 100%（全75問）

## 🎯 ベストプラクティス

### 1. 問題作成時のチェックリスト

- [ ] `level`フィールドは`"基礎"`, `"中級"`, `"上級"`のみ使用
- [ ] 問題番号（id）は1から連続した整数
- [ ] 選択肢は4つ用意
- [ ] `correctAnswerIndex`は選択肢配列の有効なインデックス（0-3）
- [ ] 解説文は簡潔で分かりやすい内容
- [ ] 全フィールドが必須項目を満たしている

### 2. 品質確保

- 問題文は明確で曖昧性がない
- 選択肢は重複や矛盾がない
- 解説は正解の根拠を含む
- 文体は統一されている

### 3. ファイル管理

- ファイル名は`{id}.json`形式
- UTF-8エンコーディング使用
- インデント2スペースでフォーマット

## 🔍 検証方法

新しい問題集作成後は以下をチェック：

1. **JSONバリデーション**: 有効なJSON形式か確認
2. **必須フィールド**: すべてのフィールドが存在するか
3. **level値検証**: `"基礎"`, `"中級"`, `"上級"`のみ使用
4. **アプリケーションテスト**: 出題パターン選択が正常動作するか

## 📝 テンプレート

新しい問題集作成時のテンプレート：

```json
{
  "id": "new-test",
  "title": "新しいスキルテスト",
  "description": "説明文",
  "difficulty": "BRONZE",
  "version": "1.0.0", 
  "author": "作成者名",
  "lastUpdated": "2025-08-31",
  "language": "ja",
  "passingScore": 65,
  "questions": [
    {
      "id": 1,
      "level": "基礎",
      "text": "問題文",
      "options": [
        "選択肢1",
        "選択肢2",
        "選択肢3", 
        "選択肢4"
      ],
      "correctAnswerIndex": 0,
      "explanation": "解説文"
    }
    // ... 続く問題
  ]
}
```

---

**重要**: この定義書に従わない問題集は、アプリケーションで正常に動作しない可能性があります。特に`level`フィールドの値は厳密に守ってください。