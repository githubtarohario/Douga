// 日本語検定 N3 文法問題 (パターン1) 200問
// (    ) に当てはまる正しい日本語を選んでください

const QUESTIONS_POOL = [
    // ===== ～として / ～にとって / ～について / ～に対して / ～に関して =====
    { question: "彼は小説家（    ）有名になったが、普段は小さな病院で働く医者だ。", choices: ["について", "として", "にしたがって", "と比べて"], answer: 1, explanation: "「～として」は資格・立場を表す。" },
    { question: "この問題は子供（    ）難しすぎる。", choices: ["にとって", "について", "に関して", "に対して"], answer: 0, explanation: "「～にとって」は判断の立場を表す。" },
    { question: "私は日本文化（    ）研究しています。", choices: ["について", "にとって", "として", "にしては"], answer: 0, explanation: "「～について」は対象（テーマ）を表す。" },
    { question: "母は私（    ）厳しい。", choices: ["について", "として", "に対して", "にとって"], answer: 2, explanation: "「～に対して」は人・物に向ける態度を表す。" },
    { question: "この映画は若者（    ）人気がある。", choices: ["について", "に対して", "の間で", "にとって"], answer: 2, explanation: "「～の間で」は集団内での意味を表す。" },
    { question: "代表（    ）スピーチをした。", choices: ["について", "として", "に対して", "にとって"], answer: 1, explanation: "「～として」は資格・立場を表す。" },
    { question: "環境問題（    ）話し合った。", choices: ["について", "にとって", "として", "にしては"], answer: 0, explanation: "「～について」はテーマ。" },
    { question: "私（    ）一番大切なのは家族です。", choices: ["について", "に対して", "として", "にとって"], answer: 3, explanation: "「～にとって」は判断の立場。" },
    { question: "学生（    ）勉強は仕事のようなものだ。", choices: ["について", "に対して", "として", "にとって"], answer: 3, explanation: "「～にとって」は判断の立場。" },
    { question: "先生は生徒（    ）優しく接する。", choices: ["について", "に対して", "として", "にとって"], answer: 1, explanation: "「～に対して」は接する相手を示す。" },
    { question: "戦争（    ）の本を読んでいる。", choices: ["について", "として", "に対して", "にとって"], answer: 0, explanation: "「～について」は対象。" },
    { question: "その問題（    ）は専門家に聞いた方がいい。", choices: ["にとって", "に関して", "として", "にしては"], answer: 1, explanation: "「～に関して」はテーマを限定する。" },
    { question: "観光客（    ）京都は人気の街だ。", choices: ["について", "に対して", "として", "にとって"], answer: 3, explanation: "「～にとって」は判断の立場。" },
    { question: "この件（    ）責任を取ります。", choices: ["について", "にとって", "として", "にしては"], answer: 0, explanation: "「～について」は対象。" },
    { question: "彼は日本語教師（    ）働いている。", choices: ["について", "として", "に対して", "にとって"], answer: 1, explanation: "「～として」は資格。" },

    // ===== ～によって / ～によると / ～により =====
    { question: "天気予報（    ）、明日は大雪になるそうだ。", choices: ["によると", "によって", "について", "に対して"], answer: 0, explanation: "「～によると」は情報源。" },
    { question: "国（    ）習慣が違う。", choices: ["について", "によって", "として", "にとって"], answer: 1, explanation: "「～によって」は違いの原因。" },
    { question: "新聞（    ）、来週から値上げらしい。", choices: ["によると", "によって", "について", "として"], answer: 0, explanation: "「～によると」は伝聞の情報源。" },
    { question: "電車の事故（    ）、遅刻した。", choices: ["によると", "によって", "について", "として"], answer: 1, explanation: "「～によって」は原因。" },
    { question: "この曲は有名な作曲家（    ）作られた。", choices: ["によると", "によって", "について", "として"], answer: 1, explanation: "受身文の動作主を「～によって」で表す。" },
    { question: "人（    ）考え方が違う。", choices: ["について", "によって", "として", "にとって"], answer: 1, explanation: "「～によって」は変化の対象。" },
    { question: "友達の話（    ）、その店は安いそうだ。", choices: ["によると", "によって", "について", "として"], answer: 0, explanation: "「～によると」は情報源。" },
    { question: "努力（    ）成功した。", choices: ["によると", "によって", "について", "として"], answer: 1, explanation: "「～によって」は手段。" },
    { question: "天候（    ）、試合は中止になることもある。", choices: ["によると", "により", "について", "として"], answer: 1, explanation: "「～により」は原因（書き言葉）。" },
    { question: "この問題は話し合い（    ）解決された。", choices: ["によって", "について", "として", "にとって"], answer: 0, explanation: "「～によって」は手段。" },

    // ===== ～ために / ～ように / ～ことに / ～ものに =====
    { question: "雨が降っている（    ）、試合は中止になった。", choices: ["ために", "ように", "ところが", "ばかりで"], answer: 0, explanation: "「～ために」は原因・理由。" },
    { question: "風邪を引かない（    ）、暖かい服装をしてください。", choices: ["ように", "ために", "ことに", "ものに"], answer: 0, explanation: "「～ないように」は否定の目的。" },
    { question: "日本語を勉強する（    ）、毎日努力しています。", choices: ["ように", "ために", "ことに", "ものに"], answer: 1, explanation: "「～ために」は積極的な目的。" },
    { question: "健康の（    ）、毎朝走っている。", choices: ["ように", "ために", "ことに", "ものに"], answer: 1, explanation: "「～のために」は目的。" },
    { question: "聞こえる（    ）大きな声で話してください。", choices: ["ように", "ために", "ことに", "ものに"], answer: 0, explanation: "可能・無意志は「～ように」。" },
    { question: "電車に間に合う（    ）走った。", choices: ["ように", "ために", "ことに", "ものに"], answer: 1, explanation: "意志的目的は「～ために」。" },
    { question: "日本語が話せる（    ）毎日練習している。", choices: ["ように", "ために", "ことに", "ものに"], answer: 0, explanation: "可能・無意志動詞には「～ように」。" },
    { question: "事故の（    ）電車が止まった。", choices: ["ように", "ために", "ことに", "ものに"], answer: 1, explanation: "「～のために」は原因。" },
    { question: "忘れない（    ）、メモを取った。", choices: ["ように", "ために", "ことに", "ものに"], answer: 0, explanation: "否定+目的は「～ないように」。" },
    { question: "子供（    ）絵本を買った。", choices: ["のように", "のために", "のことに", "のものに"], answer: 1, explanation: "「～のために」は受益者を示す。" },

    // ===== ～ことにする / ～ことになる / ～ようにする / ～ようになる =====
    { question: "明日は試験だ。今夜は早く寝る（    ）。", choices: ["ことにする", "ことになる", "ようにする", "ようになる"], answer: 0, explanation: "自分の決定は「～ことにする」。" },
    { question: "来月から大阪に転勤する（    ）。", choices: ["ことにする", "ことになった", "ようにした", "ようになった"], answer: 1, explanation: "他者の決定は「～ことになった」。" },
    { question: "毎朝ジョギングする（    ）しています。", choices: ["ことに", "ように", "ものに", "ところに"], answer: 1, explanation: "習慣的努力は「～ようにしている」。" },
    { question: "最近、日本語が話せる（    ）なりました。", choices: ["ことに", "ように", "ものに", "ところに"], answer: 1, explanation: "能力変化は「～ようになる」。" },
    { question: "野菜をたくさん食べる（    ）しています。", choices: ["ことに", "ように", "ものに", "ところに"], answer: 1, explanation: "習慣的努力。" },
    { question: "来年、結婚する（    ）。", choices: ["ことにした", "ことになった", "ようにした", "ようになった"], answer: 0, explanation: "自分の決定。" },
    { question: "最近、彼は遅刻しなく（    ）。", choices: ["ことになった", "ようになった", "ことにした", "ようにした"], answer: 1, explanation: "状態の変化。" },
    { question: "明日から会議が始まる（    ）。", choices: ["ことにした", "ことになった", "ようにした", "ようになった"], answer: 1, explanation: "決定された事実。" },
    { question: "毎日日記を書く（    ）。", choices: ["ことにした", "ことになった", "ようにした", "ようになった"], answer: 0, explanation: "自分の決定。" },
    { question: "ピアノが弾ける（    ）なりたい。", choices: ["ことに", "ように", "ものに", "ところに"], answer: 1, explanation: "可能・状態変化。" },

    // ===== ～ば～ほど =====
    { question: "勉強すれ（    ）するほど、わからないことが増えてくる。", choices: ["ば", "たら", "なら", "と"], answer: 0, explanation: "「～ば～ほど」は比例関係。" },
    { question: "値段が高けれ（    ）高いほど品質がいい。", choices: ["ば", "たら", "なら", "と"], answer: 0, explanation: "比例関係。" },
    { question: "考えれば（    ）ほど混乱する。", choices: ["考える", "考えた", "考え", "考えて"], answer: 0, explanation: "「～ば～ほど」の形。" },
    { question: "練習する（    ）するほど上手になる。", choices: ["ば", "なら", "たら", "と"], answer: 0, explanation: "「すれば～するほど」。" },

    // ===== ～たところ / ～たばかり =====
    { question: "先生に質問した（    ）、丁寧に教えてくれた。", choices: ["ところ", "ものの", "うちに", "ばかりで"], answer: 0, explanation: "「～たところ」は試した結果。" },
    { question: "今、駅に着いた（    ）です。", choices: ["ところ", "ばかり", "ばかりに", "うちに"], answer: 0, explanation: "動作直後は「～たところ」。" },
    { question: "ご飯を食べた（    ）なのにもうお腹が空いた。", choices: ["ところ", "ばかり", "ものの", "あまり"], answer: 1, explanation: "「～たばかり」は時間が経っていない感覚。" },
    { question: "日本に来た（    ）で、まだ日本語が話せない。", choices: ["ところ", "ばかり", "ものの", "あまり"], answer: 1, explanation: "時間経過の少なさ。" },
    { question: "電話した（    ）、留守だった。", choices: ["ところ", "ばかり", "ものの", "あまり"], answer: 0, explanation: "試した結果。" },
    { question: "今ちょうど出かける（    ）です。", choices: ["ところ", "ばかり", "ものの", "あまり"], answer: 0, explanation: "「～るところ」は直前。" },
    { question: "今、宿題をしている（    ）です。", choices: ["ところ", "ばかり", "ものの", "あまり"], answer: 0, explanation: "「～ているところ」は進行中。" },

    // ===== ～以来 / ～以上 / ～以後 =====
    { question: "日本に来て（    ）、もう5年が経った。", choices: ["以来", "以外", "以上", "以後"], answer: 0, explanation: "「～て以来」はずっと。" },
    { question: "彼は約束した（    ）、必ず守る人だ。", choices: ["以上", "以来", "以後", "以前"], answer: 0, explanation: "「～以上」は強い決意。" },
    { question: "卒業して（    ）、会っていない。", choices: ["以来", "以外", "以上", "以後"], answer: 0, explanation: "「～以来」はずっと。" },
    { question: "学生である（    ）、勉強するべきだ。", choices: ["以上", "以来", "以後", "以前"], answer: 0, explanation: "立場+当然。" },
    { question: "引っ越して（    ）、近所の人と話していない。", choices: ["以来", "以外", "以上", "以後"], answer: 0, explanation: "「～て以来」。" },

    // ===== ～せいで / ～おかげで / ～ばかりに / ～あまり =====
    { question: "電車が遅れた（    ）、遅刻してしまった。", choices: ["せいで", "おかげで", "ために", "ようで"], answer: 0, explanation: "悪い結果の原因は「～せいで」。" },
    { question: "先生の（    ）、合格できました。", choices: ["せいで", "おかげで", "ために", "ようで"], answer: 1, explanation: "良い結果の原因は「～おかげで」。" },
    { question: "勉強しすぎた（    ）、頭が痛くなった。", choices: ["せいで", "おかげで", "ばかりに", "あまり"], answer: 3, explanation: "「～あまり」は～しすぎた結果。" },
    { question: "うっかりした（    ）、財布を忘れた。", choices: ["せいで", "おかげで", "ばかりに", "あまり"], answer: 2, explanation: "「～ばかりに」は唯一の悪い原因。" },
    { question: "雨の（    ）、出かけられない。", choices: ["せいで", "おかげで", "ばかりに", "あまり"], answer: 0, explanation: "悪い原因。" },
    { question: "あなたの（    ）助かりました。", choices: ["せいで", "おかげで", "ばかりに", "あまり"], answer: 1, explanation: "感謝の表現。" },
    { question: "驚きの（    ）、声も出なかった。", choices: ["せいで", "おかげで", "ばかりに", "あまり"], answer: 3, explanation: "感情の度合い。" },
    { question: "うそをついた（    ）、信用を失った。", choices: ["せいで", "おかげで", "ばかりに", "あまり"], answer: 2, explanation: "唯一の原因。" },

    // ===== ～わけだ / ～わけがない / ～わけではない / ～わけにはいかない =====
    { question: "彼は10年間日本に住んでいる。日本語が上手な（    ）。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 0, explanation: "「～わけだ」は当然の結論。" },
    { question: "あの真面目な彼が嘘をつく（    ）。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 1, explanation: "「～わけがない」は強い否定。" },
    { question: "嫌いな（    ）が、毎日は食べたくない。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 2, explanation: "「～わけではない」は部分否定。" },
    { question: "明日は試験だから、遊ぶ（    ）。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 3, explanation: "「～わけにはいかない」は不可能。" },
    { question: "彼女は中国出身だ。中国語が話せる（    ）。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 0, explanation: "当然の結論。" },
    { question: "高い（    ）が、安くもない。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 2, explanation: "部分否定。" },
    { question: "まだ仕事中だから、帰る（    ）。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 3, explanation: "「～わけにはいかない」。" },
    { question: "あの人がそんなことをする（    ）。", choices: ["わけだ", "わけがない", "わけではない", "わけにはいかない"], answer: 1, explanation: "強い否定。" },

    // ===== ～はずだ / ～はずがない / ～にちがいない =====
    { question: "彼は朝早く出たから、もう着いている（    ）。", choices: ["はずだ", "はずがない", "わけにはいかない", "にちがいない"], answer: 0, explanation: "「～はずだ」は予想・確信。" },
    { question: "そんなことがある（    ）。", choices: ["はずだ", "はずがない", "わけだ", "ようだ"], answer: 1, explanation: "「～はずがない」は強い否定の確信。" },
    { question: "電気がついている。誰かいる（    ）。", choices: ["はずだ", "ようがない", "わけにはいかない", "にちがいない"], answer: 3, explanation: "「～にちがいない」は強い確信。" },
    { question: "鍵を閉めたから、入れる（    ）。", choices: ["はずだ", "はずがない", "わけだ", "ようだ"], answer: 1, explanation: "可能性ゼロの確信。" },
    { question: "彼が犯人である（    ）。証拠が揃っている。", choices: ["はずだ", "はずがない", "わけだ", "にちがいない"], answer: 3, explanation: "強い確信。" },

    // ===== ～らしい / ～ようだ / ～みたいだ / ～そうだ =====
    { question: "天気予報によると明日は雨だ（    ）。", choices: ["らしい", "ようだ", "みたいだ", "そうだ"], answer: 3, explanation: "「～そうだ」は伝聞。" },
    { question: "空が暗くなってきた。雨が降り（    ）だ。", choices: ["らしい", "そう", "みたい", "よう"], answer: 1, explanation: "「～そうだ」は様態。" },
    { question: "彼はとても疲れている（    ）。", choices: ["らしい", "ようだ", "みたい", "そうだ"], answer: 1, explanation: "「～ようだ」は推量。" },
    { question: "あの子は天使（    ）だ。", choices: ["らしい", "ようだ", "みたい", "そうだ"], answer: 2, explanation: "「～みたいだ」は比喩（口語）。" },
    { question: "彼女は来ない（    ）。連絡がない。", choices: ["らしい", "ようだ", "みたい", "そうだ"], answer: 0, explanation: "「～らしい」は伝聞・推量。" },
    { question: "彼は学生（    ）行動をする。", choices: ["らしい", "ようだ", "みたい", "そうだ"], answer: 0, explanation: "「～らしい」は典型・性質。" },

    // ===== ～かもしれない =====
    { question: "雪が降る（    ）から、暖かくして出かけよう。", choices: ["かもしれない", "にちがいない", "はずがない", "わけがない"], answer: 0, explanation: "「～かもしれない」は可能性。" },
    { question: "彼は来ない（    ）。", choices: ["かもしれない", "わけがない", "はずがない", "ことがない"], answer: 0, explanation: "可能性。" },

    // ===== ～かどうか =====
    { question: "彼が来る（    ）わかりません。", choices: ["かどうか", "かどうかも", "かどう", "ことか"], answer: 0, explanation: "不確かな疑問。" },
    { question: "正しい（    ）確認してください。", choices: ["かどうか", "かどうし", "ことか", "ものか"], answer: 0, explanation: "「～かどうか」。" },

    // ===== ～ながら / ～つつ =====
    { question: "音楽を聞き（    ）勉強する。", choices: ["ながら", "ついで", "うちに", "とともに"], answer: 0, explanation: "同時動作。" },
    { question: "彼は若い（    ）、考え方が古い。", choices: ["ながら", "ついで", "うちに", "とともに"], answer: 0, explanation: "「～ながら」は逆接。" },
    { question: "悪いと知り（    ）、嘘をついた。", choices: ["ながら", "ついで", "うちに", "とともに"], answer: 0, explanation: "知っていながら。" },
    { question: "歩き（    ）話しましょう。", choices: ["ながら", "ついで", "うちに", "とともに"], answer: 0, explanation: "同時動作。" },

    // ===== ～たり～たり =====
    { question: "休日は本を読ん（    ）映画を見（    ）する。", choices: ["で / で", "だり / たり", "たり / たり", "だり / だり"], answer: 3, explanation: "「読む」の音便はだり。" },
    { question: "雨が降っ（    ）止ん（    ）している。", choices: ["て / て", "たり / だり", "たり / たり", "だり / だり"], answer: 1, explanation: "降ったり止んだり。" },

    // ===== ～たびに =====
    { question: "彼に会う（    ）、昔を思い出す。", choices: ["たびに", "ついでに", "うえに", "あいだに"], answer: 0, explanation: "「～たびに」はその度に。" },
    { question: "東京に行く（    ）、必ず友達に会う。", choices: ["たびに", "ついでに", "うえに", "あいだに"], answer: 0, explanation: "毎回。" },

    // ===== ～うちに / ～あいだに =====
    { question: "若い（    ）、いろいろな経験をしたい。", choices: ["うちに", "あいだに", "ばかりに", "ながら"], answer: 0, explanation: "「～うちに」は状態のうちに。" },
    { question: "話している（    ）、日が暮れた。", choices: ["うちに", "あいだに", "ばかりに", "ながら"], answer: 0, explanation: "無意識的変化は「～うちに」。" },
    { question: "母が出かけている（    ）に、ケーキを作った。", choices: ["うち", "あいだ", "ばかり", "なか"], answer: 1, explanation: "明確な期間は「～あいだに」。" },
    { question: "赤ちゃんが寝ている（    ）に、買い物に行った。", choices: ["うち", "あいだ", "ばかり", "なか"], answer: 1, explanation: "限られた時間。" },
    { question: "暖かい（    ）、散歩に行こう。", choices: ["うちに", "あいだに", "ばかりに", "ながら"], answer: 0, explanation: "状態のうちに。" },

    // ===== ～ものの / ～にもかかわらず / ～にかかわらず =====
    { question: "結果（    ）、努力した過程が大切だ。", choices: ["によって", "にかかわらず", "について", "として"], answer: 1, explanation: "「～にかかわらず」は無関係。" },
    { question: "雨にもかかわらず、試合は行われた。", choices: ["雨にもかかわらず、試合は行われた。", "雨だから、試合は中止になった。", "雨のせいで、試合が中止された。", "雨のあとで、試合が始まった。"], answer: 0, explanation: "「～にもかかわらず」は逆接。" },
    { question: "勉強した（    ）、試験に落ちた。", choices: ["ものの", "ものか", "ものを", "ものなら"], answer: 0, explanation: "「～ものの」は逆接。" },
    { question: "高い（    ）、品質はよくない。", choices: ["ものの", "ものか", "ものを", "ものなら"], answer: 0, explanation: "逆接。" },
    { question: "天候（    ）試合は行われる。", choices: ["によって", "にかかわらず", "について", "として"], answer: 1, explanation: "天候に関係なく。" },
    { question: "年齢（    ）応募できる。", choices: ["について", "にかかわらず", "として", "にとって"], answer: 1, explanation: "「～にかかわらず」。" },

    // ===== ～かわりに / ～にかわって =====
    { question: "母（    ）父が学校に来た。", choices: ["のかわりに", "にかわって", "として", "について"], answer: 0, explanation: "「～のかわりに」は代替。" },
    { question: "肉のかわりに豆腐を使った。", choices: ["肉のかわりに豆腐を使った。", "肉だけを使った。", "肉と豆腐を使った。", "豆腐だけを使った。"], answer: 0, explanation: "代替。" },
    { question: "社長（    ）副社長が出席した。", choices: ["のかわりに", "について", "として", "に対して"], answer: 0, explanation: "代理。" },

    // ===== ～とおり / ～どおり =====
    { question: "先生が言う（    ）、やってみた。", choices: ["とおり", "ところ", "うちに", "ばかりに"], answer: 0, explanation: "「～とおり」は同じように。" },
    { question: "予定（    ）会議を進めた。", choices: ["とおり", "どおり", "として", "について"], answer: 1, explanation: "名詞+どおり。" },
    { question: "言われた（    ）にやればいい。", choices: ["とおり", "どおり", "ところ", "ばかり"], answer: 0, explanation: "動詞+とおり。" },

    // ===== ～次第 / ～次第で =====
    { question: "結果が出（    ）連絡します。", choices: ["次第", "ばかり", "ところ", "うちに"], answer: 0, explanation: "「～次第」は～したらすぐ。" },
    { question: "成功するかどうかは努力（    ）だ。", choices: ["次第", "ばかり", "ところ", "うちに"], answer: 0, explanation: "「～次第だ」は～によって決まる。" },
    { question: "天気（    ）で予定が変わる。", choices: ["次第", "ばかり", "ところ", "うちに"], answer: 0, explanation: "「～次第で」は～によって。" },

    // ===== ～を通じて / ～を通して =====
    { question: "インターネット（    ）友達ができた。", choices: ["を通じて", "について", "として", "にとって"], answer: 0, explanation: "「～を通じて」は手段。" },
    { question: "一年（    ）暖かい地域。", choices: ["を通じて", "について", "として", "にとって"], answer: 0, explanation: "「～を通じて」は期間全体。" },
    { question: "本（    ）多くを学んだ。", choices: ["を通して", "について", "として", "にとって"], answer: 0, explanation: "「～を通して」は手段。" },

    // ===== ～たて / ～かけ =====
    { question: "焼き（    ）のパンはおいしい。", choices: ["たて", "かけ", "ぎみ", "がち"], answer: 0, explanation: "「～たて」は直後。" },
    { question: "本を読み（    ）でやめた。", choices: ["たて", "かけ", "ぎみ", "がち"], answer: 1, explanation: "「～かけ」は途中。" },
    { question: "炊き（    )のご飯はおいしい。", choices: ["たて", "かけ", "ぎみ", "がち"], answer: 0, explanation: "直後。" },
    { question: "言い（    ）でやめた。", choices: ["たて", "かけ", "ぎみ", "がち"], answer: 1, explanation: "途中。" },

    // ===== ～ぎみ / ～がち / ～っぽい =====
    { question: "風邪（    ）なので休みます。", choices: ["ぎみ", "がち", "っぽい", "ふう"], answer: 0, explanation: "「～ぎみ」はそういう傾向。" },
    { question: "最近、雨（    ）の天気だ。", choices: ["ぎみ", "がち", "っぽい", "ふう"], answer: 1, explanation: "「～がち」は～が多い。" },
    { question: "彼は子供（    ）性格だ。", choices: ["ぎみ", "がち", "っぽい", "ふう"], answer: 2, explanation: "「～っぽい」は～のような。" },
    { question: "彼は怒り（    ）な人だ。", choices: ["ぎみ", "がち", "っぽい", "ふう"], answer: 2, explanation: "怒りやすい性質。" },
    { question: "疲れ（    ）の声で答えた。", choices: ["ぎみ", "がち", "っぽい", "ふう"], answer: 0, explanation: "傾向。" },
    { question: "最近、忘れ（    )だ。", choices: ["ぎみ", "がち", "っぽい", "ふう"], answer: 1, explanation: "頻度。" },

    // ===== ～ふり / ～まま =====
    { question: "知らない（    ）をしている。", choices: ["ふり", "まま", "うち", "ところ"], answer: 0, explanation: "「～ふり」は装う。" },
    { question: "テレビをつけた（    ）寝てしまった。", choices: ["ふり", "まま", "うち", "ところ"], answer: 1, explanation: "「～まま」は状態継続。" },
    { question: "靴をはいた（    )部屋に入った。", choices: ["ふり", "まま", "うち", "ところ"], answer: 1, explanation: "状態継続。" },
    { question: "聞こえない（    )をした。", choices: ["ふり", "まま", "うち", "ところ"], answer: 0, explanation: "装う。" },

    // ===== ～きり / ～だらけ =====
    { question: "彼とは去年会った（    ）会っていない。", choices: ["きり", "ばかり", "ところ", "うちに"], answer: 0, explanation: "「～きり」はそれ以来。" },
    { question: "服が泥（    ）になった。", choices: ["きり", "だらけ", "まみれ", "ぎみ"], answer: 1, explanation: "「～だらけ」は多い状態。" },
    { question: "間違い（    )の答案。", choices: ["きり", "だらけ", "ぎみ", "がち"], answer: 1, explanation: "多い状態。" },

    // ===== ～ずつ / ～おき =====
    { question: "毎日少し（    ）勉強する。", choices: ["ずつ", "おき", "ごと", "あたり"], answer: 0, explanation: "「～ずつ」は均等分配。" },
    { question: "一日（    ）に薬を飲む。", choices: ["ずつ", "おき", "ごと", "あたり"], answer: 1, explanation: "「～おき」は間隔。" },

    // ===== ～さえ / ～でさえ / ～さえ～ば =====
    { question: "あなた（    ）いれば幸せだ。", choices: ["さえ", "こそ", "ばかり", "だけ"], answer: 0, explanation: "「～さえ～ば」は条件。" },
    { question: "子供（    ）知っている。", choices: ["でさえ", "こそ", "ばかり", "ばかりに"], answer: 0, explanation: "「～でさえ」は極端な例。" },
    { question: "お金（    )あれば何でも買える。", choices: ["さえ", "こそ", "ばかり", "ところ"], answer: 0, explanation: "条件。" },

    // ===== ～にすぎない / ～にちがいない / ～にきまっている =====
    { question: "それはうわさ（    ）。", choices: ["にすぎない", "にちがいない", "にとって", "について"], answer: 0, explanation: "「～にすぎない」はただ～だけ。" },
    { question: "彼が来る（    ）。約束したから。", choices: ["にすぎない", "にきまっている", "にとって", "について"], answer: 1, explanation: "「～にきまっている」は確信。" },
    { question: "うそ（    )。", choices: ["にすぎない", "にきまっている", "にとって", "について"], answer: 1, explanation: "確信。" },

    // ===== ～ものだ / ～べきだ =====
    { question: "子供は遊ぶ（    ）だ。", choices: ["もの", "べき", "わけ", "ところ"], answer: 0, explanation: "「～ものだ」は本来。" },
    { question: "学生は勉強する（    ）だ。", choices: ["もの", "べき", "わけ", "ところ"], answer: 1, explanation: "「～べきだ」は義務。" },
    { question: "昔、よく遊んだ（    )だ。", choices: ["もの", "べき", "わけ", "ところ"], answer: 0, explanation: "「～たものだ」は懐古。" },

    // ===== ～か～ないかのうちに / ～かと思うと =====
    { question: "席に着く（    ）電話が鳴った。", choices: ["か着かないかのうちに", "かと思うと", "ばかりに", "ところで"], answer: 0, explanation: "ほぼ同時。" },
    { question: "泣いた（    ）笑い出した。", choices: ["か泣かないかのうちに", "かと思うと", "ばかりに", "ところで"], answer: 1, explanation: "急変。" },

    // ===== ～しか / ～さえ～ば =====
    { question: "私は日本語（    ）話せない。", choices: ["しか", "だけ", "ばかり", "こそ"], answer: 0, explanation: "「～しか～ない」は限定。" },
    { question: "練習（    ）すれば上手になる。", choices: ["さえ", "しか", "ばかり", "こそ"], answer: 0, explanation: "「～さえ～ば」は条件。" },

    // ===== ～につれて / ～にしたがって =====
    { question: "年をとる（    ）、忘れっぽくなる。", choices: ["につれて", "にとって", "として", "について"], answer: 0, explanation: "「～につれて」は変化に伴う変化。" },
    { question: "山を登る（    ）、寒くなる。", choices: ["にしたがって", "にとって", "として", "について"], answer: 0, explanation: "「～にしたがって」は変化に伴う変化。" },
    { question: "技術が進む（    )、生活が変わる。", choices: ["につれて", "にとって", "として", "について"], answer: 0, explanation: "比例変化。" },

    // ===== ～において / ～における =====
    { question: "会議は本社（    ）行われた。", choices: ["において", "について", "として", "にとって"], answer: 0, explanation: "「～において」は場所。" },
    { question: "現代（    ）問題。", choices: ["における", "について", "として", "にとって"], answer: 0, explanation: "名詞修飾。" },

    // ===== ～に応じて / ～に基づいて / ～に沿って =====
    { question: "収入（    ）税金を払う。", choices: ["に応じて", "について", "として", "にとって"], answer: 0, explanation: "「～に応じて」は対応。" },
    { question: "事実（    ）報告した。", choices: ["に基づいて", "について", "として", "にとって"], answer: 0, explanation: "「～に基づいて」は基準。" },
    { question: "計画（    ）進める。", choices: ["に沿って", "について", "として", "にとって"], answer: 0, explanation: "「～に沿って」は方針通り。" },
    { question: "ニーズ（    )商品を作る。", choices: ["に応じて", "について", "として", "にとって"], answer: 0, explanation: "対応。" },

    // ===== ～たとたん / ～か～ないかのうちに =====
    { question: "ドアを開けた（    ）猫が飛び出した。", choices: ["とたん", "ところで", "ばかりに", "うちに"], answer: 0, explanation: "「～たとたん」は直後の意外。" },
    { question: "立ち上がった（    )めまいがした。", choices: ["とたん", "ところで", "ばかりに", "うちに"], answer: 0, explanation: "直後。" },

    // ===== ～ことから / ～ことだから =====
    { question: "彼の話し方（    ）外国人だとわかる。", choices: ["ことから", "ことだから", "ことに", "ものの"], answer: 0, explanation: "「～ことから」は判断根拠。" },
    { question: "真面目な彼の（    ）、約束を守るだろう。", choices: ["ことから", "ことだから", "ことに", "ものの"], answer: 1, explanation: "「～ことだから」は性格判断。" },

    // ===== ～うえで / ～うえに =====
    { question: "よく考えた（    )決めた。", choices: ["うえで", "うえに", "うちに", "ところで"], answer: 0, explanation: "「～うえで」は手順。" },
    { question: "雨の（    )風も強い。", choices: ["うえで", "うえに", "うちに", "ところで"], answer: 1, explanation: "「～うえに」は追加。" },

    // ===== ～ばかりでなく / ～だけでなく =====
    { question: "彼は英語（    )中国語も話せる。", choices: ["ばかりでなく", "ばかりに", "だけに", "ばかりか"], answer: 0, explanation: "追加。" },
    { question: "勉強（    )スポーツも得意だ。", choices: ["だけでなく", "だけに", "ばかりに", "ばかりか"], answer: 0, explanation: "「～だけでなく」。" },

    // ===== ～やすい / ～にくい =====
    { question: "このペンは書き（    )。", choices: ["やすい", "にくい", "がち", "がてら"], answer: 0, explanation: "「～やすい」は容易。" },
    { question: "この字は読み（    )。", choices: ["やすい", "にくい", "がち", "がてら"], answer: 1, explanation: "「～にくい」は困難。" },
    { question: "この道は歩き（    )。", choices: ["やすい", "にくい", "がち", "がてら"], answer: 0, explanation: "容易。" },
    { question: "この機械は使い（    )。", choices: ["やすい", "にくい", "がち", "がてら"], answer: 1, explanation: "難しい。" },

    // ===== ～すぎる / ～始める / ～続ける / ～出す =====
    { question: "食べ（    )お腹が痛い。", choices: ["すぎて", "始めて", "続けて", "出して"], answer: 0, explanation: "「～すぎる」は度を越す。" },
    { question: "急に雨が降り（    )た。", choices: ["すぎ", "始め", "続け", "出し"], answer: 3, explanation: "「～出す」は突然。" },
    { question: "3時間勉強し（    )た。", choices: ["すぎ", "始め", "続け", "出し"], answer: 2, explanation: "「～続ける」は継続。" },
    { question: "桜が咲き（    )た。", choices: ["すぎ", "始め", "続け", "出し"], answer: 1, explanation: "「～始める」は開始。" },

    // ===== ～させてもらう / ～ていただく =====
    { question: "明日休ま（    )ます。", choices: ["せていただき", "せていただい", "せてくれ", "せてあげ"], answer: 0, explanation: "「～させていただく」は謙譲。" },
    { question: "先生に教え（    )た。", choices: ["ていただい", "てもらっ", "てくれ", "てあげ"], answer: 0, explanation: "目上には「～ていただく」。" },
    { question: "弟に本を読ん（    )た。", choices: ["でいただい", "でもらっ", "でくれ", "であげ"], answer: 3, explanation: "「～てあげる」は与える。" },

    // ===== ～てしまう / ～ておく / ～てある / ～ている =====
    { question: "宿題を忘れて（    )た。", choices: ["しまっ", "おい", "あっ", "い"], answer: 0, explanation: "「～てしまう」は完了・後悔。" },
    { question: "明日の準備をして（    )。", choices: ["しまう", "おく", "ある", "いる"], answer: 1, explanation: "「～ておく」は事前準備。" },
    { question: "壁に絵が掛けて（    )。", choices: ["しまう", "おく", "ある", "いる"], answer: 2, explanation: "「～てある」は意図的状態。" },
    { question: "先生は今、教室で話して（    )。", choices: ["しまう", "おく", "ある", "いる"], answer: 3, explanation: "「～ている」は進行。" },

    // ===== ～たらいい / ～ばいい =====
    { question: "わからなかったら、聞け（    )。", choices: ["ばいい", "たらいい", "といい", "のがいい"], answer: 0, explanation: "「～ばいい」は助言。" },
    { question: "明日、晴れる（    )。", choices: ["といい", "ばいい", "たらいい", "のがいい"], answer: 0, explanation: "「～といい」は願望。" },

    // ===== ～ことがある / ～たことがある =====
    { question: "日本へ行った（    )がある。", choices: ["こと", "もの", "ところ", "わけ"], answer: 0, explanation: "「～たことがある」は経験。" },
    { question: "授業中に寝る（    )がある。", choices: ["こと", "もの", "ところ", "わけ"], answer: 0, explanation: "「～ことがある」は時々。" },

    // ===== ～ても / ～ても=====
    { question: "雨が降っ（    )出かける。", choices: ["ても", "たら", "ば", "と"], answer: 0, explanation: "逆接条件。" },
    { question: "いくら勉強し（    )覚えられない。", choices: ["ても", "たら", "ば", "と"], answer: 0, explanation: "強調逆接。" },

    // ===== ～たら / ～ば / ～と / ～なら =====
    { question: "春になる（    )桜が咲く。", choices: ["と", "ば", "たら", "なら"], answer: 0, explanation: "「～と」は自然現象。" },
    { question: "京都へ行く（    )、清水寺がいい。", choices: ["と", "ば", "たら", "なら"], answer: 3, explanation: "「～なら」は仮定。" },
    { question: "時間があっ（    )来てください。", choices: ["と", "ば", "たら", "なら"], answer: 2, explanation: "「～たら」は条件。" },
    { question: "押せ（    )開きます。", choices: ["と", "ば", "たら", "なら"], answer: 1, explanation: "「～ば」は条件。" },

    // ===== その他 N3 重要文型 =====
    { question: "彼は来る（    )言った。", choices: ["と", "ば", "たら", "なら"], answer: 0, explanation: "引用の「と」。" },
    { question: "勉強し（    )しないで遊んでいる。", choices: ["ないで", "ずに", "なくて", "ないと"], answer: 0, explanation: "「～ないで」は付帯。" },
    { question: "傘を持た（    )出かけた。", choices: ["ないで", "ずに", "なくて", "ないと"], answer: 1, explanation: "「～ずに」は否定の付帯（書き言葉）。" },
    { question: "宿題が終わら（    )困っている。", choices: ["ないで", "ずに", "なくて", "ないと"], answer: 2, explanation: "「～なくて」は原因。" },
    { question: "早くしない（    )間に合わない。", choices: ["ないで", "ずに", "なくて", "と"], answer: 3, explanation: "「～ないと」は条件。" },
    { question: "先生の説明を聞い（    )わかった。", choices: ["て", "から", "たら", "ば"], answer: 0, explanation: "「～て」は順接。" },
    { question: "宿題をして（    )遊ぶ。", choices: ["て", "から", "たら", "ば"], answer: 1, explanation: "「～てから」は順序。" },
    { question: "彼の意見（    )賛成する。", choices: ["に", "を", "が", "で"], answer: 0, explanation: "「～に賛成する」。" },
    { question: "母（    )子供を迎えに行かせた。", choices: ["は", "を", "に", "で"], answer: 1, explanation: "使役の対象。" },
    { question: "弟（    )ピアノを習わせる。", choices: ["は", "を", "に", "で"], answer: 2, explanation: "使役で目的語があるとき「に」。" },

    // ===== さらに追加 =====
    { question: "彼に聞いた（    )、知らなかった。", choices: ["ところ", "ばかり", "ものの", "あまり"], answer: 0, explanation: "結果。" },
    { question: "彼は約束を守る（    )。", choices: ["はずだ", "わけだ", "ものだ", "ところだ"], answer: 0, explanation: "確信。" },
    { question: "新しい言語を学ぶ（    )大変だ。", choices: ["のは", "のが", "のに", "のを"], answer: 0, explanation: "「～のは」主題。" },
    { question: "勉強する（    )時間が足りない。", choices: ["のは", "のが", "のに", "のを"], answer: 2, explanation: "「～のに」逆接。" },
    { question: "本を読む（    )好きだ。", choices: ["のは", "のが", "のに", "のを"], answer: 1, explanation: "「～のが好き」。" },
    { question: "見る（    )忘れた。", choices: ["のは", "のが", "のに", "のを"], answer: 3, explanation: "「～のを忘れる」。" },
    { question: "雨が止む（    )待った。", choices: ["のは", "のが", "のに", "のを"], answer: 3, explanation: "「～のを待つ」。" },
    { question: "彼は走る（    )速い。", choices: ["のは", "のが", "のに", "のを"], answer: 1, explanation: "「～のが速い」。" },
    { question: "出発する（    )先立って確認した。", choices: ["のに", "に", "を", "で"], answer: 1, explanation: "「～に先立って」。" },
    { question: "失敗を恐れ（    )行動できない。", choices: ["て", "ては", "たら", "と"], answer: 1, explanation: "「～ては」は条件。" },

    { question: "本を借りる（    )、図書館へ行った。", choices: ["ために", "ように", "のに", "から"], answer: 0, explanation: "目的。" },
    { question: "歌い（    )踊る。", choices: ["ながら", "ついで", "うちに", "とともに"], answer: 0, explanation: "同時。" },
    { question: "病気の（    )会社を休んだ。", choices: ["ために", "ように", "のに", "から"], answer: 0, explanation: "原因。" },
    { question: "今日中に終わる（    )はない。", choices: ["はず", "わけ", "もの", "ところ"], answer: 0, explanation: "「～はずがない」可能性ゼロ。" },
    { question: "急いだ（    )間に合わなかった。", choices: ["のに", "ので", "から", "ため"], answer: 0, explanation: "逆接。" },
    { question: "雨だった（    )中止になった。", choices: ["のに", "ので", "から", "とき"], answer: 1, explanation: "原因（丁寧）。" },
    { question: "彼は頭がいい。だから合格した（    )。", choices: ["わけだ", "わけがない", "ものだ", "ところだ"], answer: 0, explanation: "結論。" },
    { question: "電気がついた（    )消えた。", choices: ["かと思うと", "ばかりに", "ところで", "うちに"], answer: 0, explanation: "急変。" },
    { question: "音楽を聞きながら勉強する（    )集中できる。", choices: ["と", "ば", "なら", "から"], answer: 0, explanation: "自然な結果。" },
    { question: "10時を過ぎた（    )誰も来ない。", choices: ["のに", "ので", "から", "とき"], answer: 0, explanation: "逆接。" },

    { question: "あの人はすぐ怒る（    )ので付き合いにくい。", choices: ["がち", "ぎみ", "っぽい", "ふう"], answer: 2, explanation: "性質。" },
    { question: "風邪をひき（    )なので気をつけている。", choices: ["がち", "ぎみ", "っぽい", "ふう"], answer: 0, explanation: "頻度。" },
    { question: "やっと宿題が終わった（    )。", choices: ["ところだ", "ばかりだ", "とおりだ", "ようだ"], answer: 0, explanation: "「終わったところ」直後。" },
    { question: "5分前に着いた（    )。", choices: ["ところだ", "ばかりだ", "とおりだ", "ようだ"], answer: 1, explanation: "短時間前。" },
    { question: "試験が近づく（    )緊張する。", choices: ["につれて", "にとって", "として", "について"], answer: 0, explanation: "変化に伴う変化。" },
    { question: "経験（    )判断する。", choices: ["に基づいて", "について", "として", "にとって"], answer: 0, explanation: "根拠。" },
    { question: "天候（    )中止する場合があります。", choices: ["によっては", "について", "として", "にとって"], answer: 0, explanation: "「～によっては」場合により。" },
    { question: "彼は学生（    )しっかりしている。", choices: ["にしては", "として", "について", "にとって"], answer: 0, explanation: "「～にしては」は予想と違う。" },
    { question: "プロ（    )下手だね。", choices: ["にしては", "として", "について", "にとって"], answer: 0, explanation: "予想に反する。" },
    { question: "毎日30分（    )運動する。", choices: ["ずつ", "おき", "ごと", "あたり"], answer: 0, explanation: "均等。" },

    { question: "急に泣き（    )た。", choices: ["出し", "始め", "続け", "終わっ"], answer: 0, explanation: "突然開始。" },
    { question: "雨が降り（    )ている。", choices: ["出し", "始め", "続け", "終わっ"], answer: 2, explanation: "継続。" },
    { question: "話し（    )てください。", choices: ["出し", "始め", "続け", "終わっ"], answer: 2, explanation: "継続して話す。" },
    { question: "歌を歌い（    )た。", choices: ["出し", "始め", "続け", "終わっ"], answer: 3, explanation: "完了。" },
    { question: "彼は英語が話せる（    )なった。", choices: ["ように", "ことに", "もの", "ところ"], answer: 0, explanation: "可能変化。" },
    { question: "毎日早起きする（    )している。", choices: ["ように", "ことに", "もの", "ところ"], answer: 0, explanation: "習慣的努力。" },
    { question: "今日は早く帰る（    )した。", choices: ["ように", "ことに", "もの", "ところ"], answer: 1, explanation: "自分の決定。" },
    { question: "来週から会議が始まる（    )なった。", choices: ["ように", "ことに", "もの", "ところ"], answer: 1, explanation: "他者決定。" },
    { question: "息子は野菜を食べる（    )なった。", choices: ["ように", "ことに", "もの", "ところ"], answer: 0, explanation: "状態変化。" },
    { question: "授業に遅れない（    )早く出る。", choices: ["ように", "ことに", "もの", "ところ"], answer: 0, explanation: "目的（無意志）。" }
];

// 配列をシャッフル(Fisher-Yates)
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// 各問題の選択肢をシャッフルして正解位置もランダムにする
function shuffleChoices(question) {
    // 「A / B」形式(ペア選択肢)はシャッフルしない
    const isPair = question.choices.some(c => c.includes(" / "));
    if (isPair) return { ...question };

    const correctText = question.choices[question.answer];
    const shuffled = shuffleArray(question.choices);
    const newAnswer = shuffled.indexOf(correctText);
    return {
        ...question,
        choices: shuffled,
        answer: newAnswer
    };
}

// ランダムに10問選び、選択肢もシャッフルする
function pickRandomQuestions(count = 10) {
    const shuffled = shuffleArray(QUESTIONS_POOL);
    return shuffled.slice(0, count).map(shuffleChoices);
}
