// 日本語検定N3 文法問題 CAIシステム
// 1問15秒、全10問、得点記録あり

const TOTAL_QUESTIONS = 10;
const TIME_LIMIT = 15;
const HISTORY_KEY = "n3_grammar_history";

let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer = null;
let timeLeft = TIME_LIMIT;
let answers = [];
let audioCtx = null;

// DOM要素
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const retryBtn = document.getElementById("retry-btn");
const homeBtn = document.getElementById("home-btn");
const clearHistoryBtn = document.getElementById("clear-history-btn");

const questionNumberEl = document.getElementById("question-number");
const currentScoreEl = document.getElementById("current-score");
const timerEl = document.getElementById("timer");
const timerBox = document.querySelector(".timer-box");
const progressFill = document.getElementById("progress-fill");
const questionTextEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const finalScoreEl = document.getElementById("final-score");
const resultCommentEl = document.getElementById("result-comment");
const answerListEl = document.getElementById("answer-list");
const historyListEl = document.getElementById("history-list");

// AudioContext初期化
function initAudio() {
    if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtx = new AudioCtx();
    }
}

// チック音(ストップウォッチ風)
function playTick(highPitch = false) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = highPitch ? 1200 : 800;
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

// 正解音
function playCorrect() {
    if (!audioCtx) return;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
    });
}

// 不正解音
function playIncorrect() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
}

// 画面切替
function showScreen(screen) {
    [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

// クイズ開始
function startQuiz() {
    initAudio();
    currentQuestions = pickRandomQuestions(TOTAL_QUESTIONS);
    currentIndex = 0;
    score = 0;
    answers = [];
    currentScoreEl.textContent = "0";
    showScreen(quizScreen);
    showQuestion();
}

// 問題表示
function showQuestion() {
    if (currentIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }

    const q = currentQuestions[currentIndex];
    questionNumberEl.textContent = currentIndex + 1;
    questionTextEl.textContent = q.question;
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";

    choicesEl.innerHTML = "";
    q.choices.forEach((choice, idx) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerHTML = `<span class="choice-number">${idx + 1}</span>${choice}`;
        btn.addEventListener("click", () => selectAnswer(idx));
        choicesEl.appendChild(btn);
    });

    startTimer();
}

// タイマー開始
function startTimer() {
    timeLeft = TIME_LIMIT;
    timerEl.textContent = timeLeft;
    timerBox.classList.remove("warning", "danger");
    updateProgress();

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        updateProgress();

        if (timeLeft <= 5 && timeLeft > 2) {
            timerBox.classList.add("warning");
            playTick(false);
        } else if (timeLeft <= 2 && timeLeft > 0) {
            timerBox.classList.remove("warning");
            timerBox.classList.add("danger");
            playTick(true);
        } else if (timeLeft > 5) {
            playTick(false);
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

// 進捗バー
function updateProgress() {
    const percent = (timeLeft / TIME_LIMIT) * 100;
    progressFill.style.width = percent + "%";
}

// 解答選択
function selectAnswer(selectedIdx) {
    clearInterval(timer);
    const q = currentQuestions[currentIndex];
    const correct = selectedIdx === q.answer;

    const buttons = choicesEl.querySelectorAll(".choice-btn");
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add("correct");
        else if (idx === selectedIdx) btn.classList.add("incorrect");
    });

    if (correct) {
        score++;
        currentScoreEl.textContent = score;
        feedbackEl.textContent = "○ 正解！ " + q.explanation;
        feedbackEl.classList.add("correct");
        playCorrect();
    } else {
        feedbackEl.textContent = "× 不正解。正解は " + (q.answer + 1) + "番。" + q.explanation;
        feedbackEl.classList.add("incorrect");
        playIncorrect();
    }

    answers.push({
        question: q.question,
        choices: q.choices,
        userAnswer: selectedIdx,
        correctAnswer: q.answer,
        isCorrect: correct,
        explanation: q.explanation
    });

    setTimeout(() => {
        currentIndex++;
        showQuestion();
    }, 2200);
}

// 時間切れ
function timeUp() {
    const q = currentQuestions[currentIndex];
    const buttons = choicesEl.querySelectorAll(".choice-btn");
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add("correct");
    });

    feedbackEl.textContent = "× 時間切れ。正解は " + (q.answer + 1) + "番。" + q.explanation;
    feedbackEl.classList.add("incorrect");
    playIncorrect();

    answers.push({
        question: q.question,
        choices: q.choices,
        userAnswer: -1,
        correctAnswer: q.answer,
        isCorrect: false,
        explanation: q.explanation
    });

    setTimeout(() => {
        currentIndex++;
        showQuestion();
    }, 2200);
}

// クイズ終了
function endQuiz() {
    showScreen(resultScreen);
    finalScoreEl.textContent = score;

    let comment = "";
    if (score === 10) comment = "完璧です！素晴らしい！";
    else if (score >= 8) comment = "とてもよくできました！";
    else if (score >= 6) comment = "合格レベル。もう少しで満点です！";
    else if (score >= 4) comment = "もう少し頑張りましょう。";
    else comment = "復習が必要です。もう一度挑戦してみましょう。";
    resultCommentEl.textContent = comment;

    answerListEl.innerHTML = "";
    answers.forEach((a, i) => {
        const div = document.createElement("div");
        div.className = "answer-item";
        const userText = a.userAnswer === -1 ? "(時間切れ)" : (a.userAnswer + 1) + "番:" + a.choices[a.userAnswer];
        const mark = a.isCorrect ? '<span class="mark-correct">○</span>' : '<span class="mark-incorrect">×</span>';
        div.innerHTML = `
            <div class="q-text">${mark} 問${i + 1}: ${a.question}</div>
            <div class="a-text">あなたの回答: ${userText}</div>
            <div class="a-text">正解: ${a.correctAnswer + 1}番:${a.choices[a.correctAnswer]}</div>
            <div class="a-text" style="color:#718096;">${a.explanation}</div>
        `;
        answerListEl.appendChild(div);
    });

    saveHistory(score);
}

// 履歴保存
function saveHistory(s) {
    const history = loadHistory();
    history.unshift({
        score: s,
        date: new Date().toLocaleString("ja-JP")
    });
    if (history.length > 10) history.length = 10;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// 履歴読込
function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
        return [];
    }
}

// 履歴表示
function renderHistory() {
    const history = loadHistory();
    if (history.length === 0) {
        historyListEl.innerHTML = '<p class="empty">記録はまだありません</p>';
        return;
    }
    historyListEl.innerHTML = history.map(h => `
        <div class="history-item">
            <span class="h-date">${h.date}</span>
            <span class="h-score">${h.score} / 10</span>
        </div>
    `).join("");
}

// 履歴消去
function clearHistory() {
    if (confirm("記録をすべて消去しますか？")) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    }
}

// イベント設定
startBtn.addEventListener("click", startQuiz);
retryBtn.addEventListener("click", startQuiz);
homeBtn.addEventListener("click", () => {
    renderHistory();
    showScreen(startScreen);
});
clearHistoryBtn.addEventListener("click", clearHistory);

// 初期表示
renderHistory();
