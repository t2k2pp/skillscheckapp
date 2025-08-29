# 画像最適化ツール

スキルチェッカーライブラリの画像を Web 表示用に最適化するツールです。

## 🎯 目的

- 大きな原画像をWeb用サイズに縮小（256x256px）
- ファイルサイズを圧縮してページ読み込み速度を向上
- 原本は `assets/originals/` に安全に保管
- 最適化後の画像を `public/question-sets/` に配置

## 📦 セットアップ

```bash
# 依存関係をインストール
pip install -r requirements.txt
```

## 🚀 使用方法

### 1. 既存画像を原本として保存

```bash
python optimize_images.py --move-originals
```

### 2. 画像を最適化

```bash
# PNG形式で最適化（推奨）
python optimize_images.py

# WebP形式で最適化（より高圧縮）
python optimize_images.py --format WEBP

# PNG + WebP両方作成
python optimize_images.py --webp
```

## 📁 ディレクトリ構造

```
project/
├── assets/
│   └── originals/          # 原本画像（高解像度）
│       ├── nodejs-logo.png
│       ├── python-logo.png
│       └── ...
├── public/
│   └── question-sets/      # 最適化済み画像（Web用）
│       ├── nodejs-logo.png
│       ├── python-logo.png
│       └── ...
└── scripts/
    ├── optimize_images.py  # このツール
    └── requirements.txt
```

## ⚙️ 最適化設定

- **Web用サイズ**: 256x256px
- **PNG品質**: 最適化あり
- **WebP品質**: 80%
- **JPEG品質**: 85%

## 📊 効果

一般的に以下の効果が期待できます：

- **ファイルサイズ**: 70-90% 削減
- **読み込み速度**: 大幅改善
- **原本保持**: 将来の再利用が可能

## 🔧 カスタマイズ

`optimize_images.py` 内の以下の設定を変更可能：

```python
self.web_size = (256, 256)    # Web表示サイズ
self.webp_quality = 80        # WebP圧縮品質
self.jpeg_quality = 85        # JPEG圧縮品質
```