"""
category.py - 文字列がどのカテゴリに属するかを判定するプログラム

使い方:
    python category.py "調べたい文字列"
    python category.py  # インタラクティブモード
"""

import sys
import io
import math
import re
from collections import defaultdict

# Windows環境でのUTF-8出力設定
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stdin  = io.TextIOWrapper(sys.stdin.buffer,  encoding='utf-8', errors='replace')


# ========================
# カテゴリとキーワード定義
# ========================
CATEGORIES = {
    "技術・IT": [
        "プログラム", "コード", "ソフトウェア", "アルゴリズム", "データベース",
        "API", "クラウド", "AI", "機械学習", "ディープラーニング", "ネットワーク",
        "サーバー", "セキュリティ", "開発", "エンジニア", "システム", "コンピュータ",
        "Python", "Java", "JavaScript", "HTML", "CSS", "SQL", "Linux", "Docker",
        "GitHub", "フレームワーク", "ライブラリ", "デバッグ", "テスト", "デプロイ",
        "hardware", "software", "network", "database", "programming", "algorithm",
    ],
    "医療・健康": [
        "病気", "症状", "治療", "薬", "病院", "医師", "医療", "健康", "診断",
        "手術", "ウイルス", "感染", "予防", "ワクチン", "患者", "看護", "検査",
        "血圧", "糖尿病", "がん", "骨折", "発熱", "頭痛", "アレルギー", "薬剤",
        "クリニック", "処方", "リハビリ", "医学", "生理", "臓器",
    ],
    "法律・法務": [
        "法律", "条例", "契約", "裁判", "判決", "弁護士", "訴訟", "規制", "違法",
        "権利", "義務", "罰則", "法廷", "民法", "刑法", "憲法", "条約", "規約",
        "法人", "著作権", "特許", "商標", "コンプライアンス", "免責", "賠償",
        "法的", "告訴", "検察", "起訴", "判例",
    ],
    "経済・金融": [
        "経済", "金融", "株式", "投資", "為替", "銀行", "利息", "融資", "財政",
        "GDP", "インフレ", "デフレ", "景気", "市場", "証券", "債券", "ファンド",
        "税金", "予算", "赤字", "黒字", "貿易", "輸出", "輸入", "価格", "コスト",
        "利益", "損益", "資産", "負債", "保険", "年金", "仮想通貨", "ビットコイン",
    ],
    "政治・社会": [
        "政府", "政治", "選挙", "国会", "政策", "法案", "大臣", "首相", "議員",
        "与党", "野党", "外交", "条約", "国際", "社会", "人権", "デモ", "運動",
        "行政", "地方", "自治体", "公共", "福祉", "改革", "党", "憲法改正",
    ],
    "科学・学術": [
        "研究", "実験", "論文", "科学", "物理", "化学", "生物", "数学", "統計",
        "理論", "仮説", "観察", "分析", "データ", "結果", "考察", "学術", "大学",
        "博士", "教授", "学会", "量子", "宇宙", "素粒子", "遺伝子", "DNA",
        "環境", "気候", "生態系", "進化", "地質",
    ],
    "教育": [
        "教育", "学習", "授業", "教師", "生徒", "学校", "大学", "入試", "試験",
        "カリキュラム", "教科書", "勉強", "成績", "卒業", "資格", "検定", "塾",
        "講義", "スキル", "研修", "自己啓発", "習得", "理解", "知識", "学び",
    ],
    "エンタメ・文化": [
        "映画", "音楽", "ゲーム", "アニメ", "漫画", "小説", "芸術", "アート",
        "俳優", "歌手", "アーティスト", "公演", "コンサート", "ライブ", "舞台",
        "エンタメ", "娯楽", "趣味", "ファン", "ドラマ", "テレビ", "配信",
        "YouTube", "SNS", "コンテンツ", "クリエイター", "デザイン", "文化",
    ],
    "スポーツ": [
        "スポーツ", "試合", "競技", "選手", "監督", "チーム", "優勝", "得点",
        "サッカー", "野球", "バスケ", "テニス", "ゴルフ", "水泳", "陸上",
        "オリンピック", "ワールドカップ", "リーグ", "トーナメント", "練習",
        "トレーニング", "記録", "勝利", "敗北", "引き分け", "スコア",
    ],
    "ビジネス・経営": [
        "ビジネス", "経営", "マーケティング", "営業", "売上", "戦略", "組織",
        "マネジメント", "リーダーシップ", "プロジェクト", "スタートアップ",
        "起業", "会社", "企業", "社員", "採用", "人事", "ブランド", "商品",
        "サービス", "顧客", "顧客満足", "KPI", "DX", "デジタル変革", "BtoB",
    ],
    "料理・食": [
        "料理", "食事", "レシピ", "食材", "調理", "味", "食べ物", "料理人",
        "レストラン", "栄養", "カロリー", "食品", "旬", "調味料", "鍋", "炒め",
        "焼く", "煮る", "揚げる", "野菜", "肉", "魚", "スイーツ", "デザート",
    ],
    "旅行・観光": [
        "旅行", "観光", "ホテル", "宿泊", "航空", "フライト", "観光地", "名所",
        "グルメ", "温泉", "ツアー", "トラベル", "海外", "国内", "旅程", "パスポート",
        "ビザ", "予約", "アクティビティ", "リゾート", "景色", "文化体験",
    ],
    "ニュース・時事": [
        "事件", "事故", "災害", "火災", "地震", "台風", "速報", "報道", "記者",
        "ニュース", "時事", "最新", "発表", "声明", "記者会見", "調査", "取材",
    ],
}


def tokenize(text: str) -> list[str]:
    """テキストを単語リストに変換（日本語・英語対応）"""
    # 英単語を抽出
    english_words = re.findall(r'[a-zA-Z]+', text)
    # 日本語の2〜5文字の部分文字列を抽出
    japanese_ngrams = []
    japanese_text = re.sub(r'[a-zA-Z0-9\s\W]', '', text)
    for n in range(2, 6):
        for i in range(len(japanese_text) - n + 1):
            japanese_ngrams.append(japanese_text[i:i+n])
    return english_words + japanese_ngrams


def score_category(text: str, keywords: list[str]) -> float:
    """テキストとキーワードリストのマッチスコアを計算"""
    text_lower = text.lower()
    score = 0.0
    matched = []
    for kw in keywords:
        if kw.lower() in text_lower:
            # 長いキーワードほど高スコア
            weight = math.log(len(kw) + 1) + 1
            score += weight
            matched.append(kw)
    return score, matched


def classify(text: str, top_n: int = 3) -> list[tuple]:
    """
    テキストを分類してスコア上位のカテゴリを返す

    Returns:
        [(カテゴリ名, スコア, マッチしたキーワード), ...]
    """
    results = []
    for category, keywords in CATEGORIES.items():
        score, matched = score_category(text, keywords)
        results.append((category, score, matched))

    results.sort(key=lambda x: x[1], reverse=True)
    return results[:top_n]


def display_results(text: str, results: list[tuple]) -> None:
    """結果を表示"""
    best_category, best_score, _ = results[0]
    if best_score == 0:
        print(f"{text}, 不明")
    else:
        print(f"{text}, {best_category}")


def interactive_mode() -> None:
    """インタラクティブモード"""
    print("=" * 60)
    print("  文書カテゴリ判定プログラム")
    print("  終了するには 'q' または 'quit' を入力してください")
    print("=" * 60)

    while True:
        print()
        text = input("テキストを入力してください: ").strip()
        if text.lower() in ("q", "quit", "exit", "終了"):
            print("終了します。")
            break
        if not text:
            print("テキストが空です。もう一度入力してください。")
            continue

        results = classify(text)
        display_results(text, results)


def classify_folder(folder_path: str) -> None:
    """フォルダー内のファイル名を読み出してカテゴリ判定し表示"""
    import os
    filenames = sorted(os.listdir(folder_path))
    for name in filenames:
        results = classify(name)
        display_results(name, results)


def main() -> None:
    folder = r"C:\Users\tonko\OneDrive\デスクトップ\動画"
    classify_folder(folder)


if __name__ == "__main__":
    main()
