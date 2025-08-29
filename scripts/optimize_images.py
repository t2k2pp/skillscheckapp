#!/usr/bin/env python3
"""
画像最適化ツール - スキルチェッカーライブラリ用
Web表示用に画像サイズとファイルサイズを最適化します。
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageOps
import argparse

class ImageOptimizer:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.originals_dir = self.project_root / "assets" / "originals"
        self.optimized_dir = self.project_root / "public" / "question-sets"
        
        # 最適化設定
        self.web_size = (256, 256)  # Web表示用サイズ
        self.thumbnail_size = (128, 128)  # サムネイル用サイズ
        self.jpeg_quality = 85  # JPEG品質
        self.png_optimize = True  # PNG最適化
        self.webp_quality = 80  # WebP品質

    def ensure_directories(self):
        """必要なディレクトリを作成"""
        self.originals_dir.mkdir(parents=True, exist_ok=True)
        self.optimized_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"[ORIGINALS] {self.originals_dir}")
        print(f"[OPTIMIZED] {self.optimized_dir}")

    def move_originals(self):
        """既存の画像を原本フォルダに移動"""
        moved_count = 0
        for image_file in self.optimized_dir.glob("*.png"):
            if image_file.name.endswith("-logo.png"):
                original_path = self.originals_dir / image_file.name
                if not original_path.exists():
                    # 原本として保存
                    image_file.rename(original_path)
                    print(f"[BACKUP] {image_file.name}")
                    moved_count += 1
        
        return moved_count

    def optimize_image(self, input_path: Path, output_path: Path, size: tuple, format: str = "PNG"):
        """単一画像の最適化"""
        try:
            with Image.open(input_path) as img:
                # RGBA対応
                if img.mode != 'RGBA' and format == 'PNG':
                    img = img.convert('RGBA')
                elif img.mode != 'RGB' and format in ['JPEG', 'WEBP']:
                    img = img.convert('RGB')
                
                # リサイズ（アスペクト比を保持）
                img = ImageOps.fit(img, size, Image.Resampling.LANCZOS)
                
                # 保存設定
                save_kwargs = {}
                if format == 'JPEG':
                    save_kwargs = {'quality': self.jpeg_quality, 'optimize': True}
                elif format == 'PNG':
                    save_kwargs = {'optimize': self.png_optimize}
                elif format == 'WEBP':
                    save_kwargs = {'quality': self.webp_quality, 'optimize': True}
                
                img.save(output_path, format=format, **save_kwargs)
                
                # ファイルサイズを取得
                original_size = input_path.stat().st_size
                optimized_size = output_path.stat().st_size
                compression_ratio = (1 - optimized_size / original_size) * 100
                
                return {
                    'success': True,
                    'original_size': original_size,
                    'optimized_size': optimized_size,
                    'compression_ratio': compression_ratio
                }
                
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def optimize_all(self, web_format: str = "PNG", create_webp: bool = False):
        """全画像の最適化"""
        if not self.originals_dir.exists():
            print("[ERROR] 原本フォルダが存在しません。")
            return

        results = []
        original_files = list(self.originals_dir.glob("*-logo.png"))
        
        if not original_files:
            print("[ERROR] 最適化する画像ファイルが見つかりません。")
            return
            
        print(f"\n[INFO] {len(original_files)}個の画像を最適化中...")
        
        for original_file in original_files:
            print(f"\n[PROCESS] {original_file.name}")
            
            # Web用画像を生成
            web_extension = ".webp" if web_format == "WEBP" else ".png"
            web_filename = original_file.stem + web_extension
            web_path = self.optimized_dir / web_filename
            
            web_result = self.optimize_image(
                original_file, 
                web_path, 
                self.web_size, 
                web_format
            )
            
            if web_result['success']:
                print(f"   [OK] Web用: {web_filename}")
                print(f"      サイズ: {web_result['original_size']:,} -> {web_result['optimized_size']:,} bytes")
                print(f"      圧縮率: {web_result['compression_ratio']:.1f}%")
                
                results.append({
                    'filename': web_filename,
                    'type': 'web',
                    **web_result
                })
            else:
                print(f"   [ERROR] {web_result['error']}")
            
            # WebP版も作成する場合
            if create_webp and web_format != "WEBP":
                webp_filename = original_file.stem + ".webp"
                webp_path = self.optimized_dir / webp_filename
                
                webp_result = self.optimize_image(
                    original_file, 
                    webp_path, 
                    self.web_size, 
                    "WEBP"
                )
                
                if webp_result['success']:
                    print(f"   [OK] WebP版: {webp_filename}")
                    print(f"      圧縮率: {webp_result['compression_ratio']:.1f}%")
                    
                    results.append({
                        'filename': webp_filename,
                        'type': 'webp',
                        **webp_result
                    })

        # 結果サマリー
        if results:
            total_original = sum(r['original_size'] for r in results)
            total_optimized = sum(r['optimized_size'] for r in results)
            avg_compression = (1 - total_optimized / total_original) * 100
            
            print(f"\n[SUMMARY] 最適化結果:")
            print(f"   処理ファイル数: {len(results)}")
            print(f"   総容量削減: {total_original:,} -> {total_optimized:,} bytes")
            print(f"   平均圧縮率: {avg_compression:.1f}%")
            print(f"   削減容量: {total_original - total_optimized:,} bytes")

def main():
    parser = argparse.ArgumentParser(description="画像最適化ツール")
    parser.add_argument("--format", choices=["PNG", "WEBP", "JPEG"], default="PNG",
                      help="出力フォーマット (デフォルト: PNG)")
    parser.add_argument("--webp", action="store_true", 
                      help="WebP版も併せて作成")
    parser.add_argument("--move-originals", action="store_true",
                      help="既存画像を原本フォルダに移動")
    
    args = parser.parse_args()
    
    optimizer = ImageOptimizer()
    optimizer.ensure_directories()
    
    if args.move_originals:
        moved = optimizer.move_originals()
        print(f"[BACKUP] {moved}個のファイルを原本として保存しました。")
        
        if moved > 0:
            print("\n原本を保存しました。再度 --move-originals なしで実行して最適化を行ってください。")
            return
    
    optimizer.optimize_all(web_format=args.format, create_webp=args.webp)
    print("\n[DONE] 最適化完了！")

if __name__ == "__main__":
    main()