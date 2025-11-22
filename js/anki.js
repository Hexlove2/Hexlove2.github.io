// anki.js

// --- 获取牌组名称 ---
const currentScript = document.currentScript || document.querySelector('#ankicards');
const deckName = currentScript.getAttribute('cardpile') || 'default';
console.log('当前牌组:', deckName);
const savedToken = localStorage.getItem("ankiToken");
const today = new Date();
const dateInt = parseInt(
  `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`
);
const token = localStorage.getItem("ankiToken"); // 你保存 token 的地方
let q;
// --- create review panel (右下角) ---
const reviewPanel = document.createElement("div");
reviewPanel.style.position = "fixed";
reviewPanel.style.bottom = "13vh";
reviewPanel.style.right = "10px";
reviewPanel.style.width = "30vw";
reviewPanel.style.height = "50vh";
reviewPanel.style.background = "rgba(250, 235, 241, 0.95)";
reviewPanel.style.padding = "15px";
reviewPanel.style.borderRadius = "12px";
reviewPanel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
reviewPanel.style.fontSize = "16px";
reviewPanel.style.overflowY = "auto";
reviewPanel.style.zIndex = "9998";
reviewPanel.style.opacity = 0;
reviewPanel.style.transition = "opacity 0.5s ease";
document.body.appendChild(reviewPanel);

// --- create toggle button (右下角) ---
const reviewBtn = document.createElement("button");
reviewBtn.textContent = "Anki";
reviewBtn.style.position = "fixed";
reviewBtn.style.bottom = "7vh";
reviewBtn.style.right = "10px";
reviewBtn.style.width = "50px";
reviewBtn.style.height = "50px";
reviewBtn.style.borderRadius = "12px";
reviewBtn.style.border = "none";
reviewBtn.style.background = "#fc8ec9ff";
reviewBtn.style.color = "white";
reviewBtn.style.cursor = "pointer";
reviewBtn.style.zIndex = "9999";
document.body.appendChild(reviewBtn);

// --- card display area ---
const cardFront = document.createElement("div");
cardFront.style.position = "absolute";
cardFront.style.fontWeight = "bold";
cardFront.style.fontSize = "2em";                // 字体更大
cardFront.style.marginBottom = "12px";
cardFront.style.bottom = "75%";   // 
cardFront.style.left = "20%";
cardFront.style.color = "#ff1493";              // 鲜艳的粉色，可改
cardFront.style.wordWrap = "break-word";        // 长文字换行
cardFront.style.lineHeight = "1.4em";           // 增加行高
reviewPanel.appendChild(cardFront);

const cardBack = document.createElement("div");
cardBack.style.position = "absolute";
cardBack.style.fontSize = "2em";              // 字体稍小但仍醒目
cardBack.style.marginBottom = "12px";
cardBack.style.display = "none"; 
cardBack.style.bottom = "75%";   
cardBack.style.left = "20%";
cardBack.style.color = "#4b0082";               // 深紫色，可改
cardBack.style.wordWrap = "break-word";         // 长文字换行
cardBack.style.lineHeight = "1.4em";            // 增加行高
reviewPanel.appendChild(cardBack);

// --- control buttons (center before start) ---
const centerBtns = document.createElement("div");
centerBtns.style.display = "flex";
centerBtns.style.justifyContent = "center";
centerBtns.style.alignItems = "center";
centerBtns.style.height = "80%";
centerBtns.style.gap = "10px";
reviewPanel.appendChild(centerBtns);

const startBtn = document.createElement("button");
startBtn.textContent = "▶ Start";
startBtn.style.padding = "6px 12px";
startBtn.style.borderRadius = "8px";
startBtn.style.border = "none";
startBtn.style.background = "#0b93f4ff";
startBtn.style.color = "white";
startBtn.style.cursor = "pointer";

const addBtn = document.createElement("button");
addBtn.textContent = "➕ Add Card";
addBtn.style.padding = "6px 12px";
addBtn.style.borderRadius = "8px";
addBtn.style.border = "none";
addBtn.style.background = "#0b93f4ff";
addBtn.style.color = "white";
addBtn.style.cursor = "pointer";

centerBtns.appendChild(startBtn);
centerBtns.appendChild(addBtn);

// --- buttons for show and rating ---
const showBtn = document.createElement("button");
showBtn.textContent = "Show";
showBtn.style.marginRight = "10px";
showBtn.style.display = "none"; 
showBtn.style.position = "absolute";
showBtn.style.bottom = "10px";   // 离父容器底部10px
showBtn.style.left = "50%";
showBtn.style.transform = "translateX(-50%)";
// 视觉效果
showBtn.style.fontSize = "18px";          // 字体大一点
showBtn.style.padding = "12px 24px";      // 按钮盒子大一点
showBtn.style.borderRadius = "20px";      // 圆润
showBtn.style.backgroundColor = "#ff69b4"; // 粉色背景，可换颜色
showBtn.style.color = "white";            // 字体颜色
showBtn.style.border = "none";            // 去掉边框
showBtn.style.cursor = "pointer";         // 鼠标变手型
showBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)"; // 阴影
showBtn.style.zIndex = "10000";           // 保证在最上层
reviewPanel.appendChild(showBtn);

const ratings = ["Again", "Hard", "Good", "Easy"];
const ratingBtns = ratings.map(r => {
    const btn = document.createElement("button");
    btn.textContent = r;
    btn.style.marginRight = "6px";
    btn.style.display = "none"; 
    reviewPanel.appendChild(btn);
    return btn;
});

// --- state ---
let dueCards = [];
let currentIndex = 0;

// --- fetch due cards ---
async function fetchDueCards() {
    try {
        const res = await fetch("https://englishai.hexlove12.workers.dev/api/getcard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dateInt, user_id: "sunday", deck: deckName })
        });
        return await res.json();
    } catch (e) {
        console.error("获取到期卡片失败:", e);
        return [];
    }
}

// --- show card ---
function showCard() {
    if (currentIndex >= dueCards.length) {
        // 完成状态
        cardFront.textContent = "All done! 🎉";
        cardBack.style.display = "none";
        showBtn.style.display = "none";
        ratingBtns.forEach(b => b.style.display = "none");
        addBtn.style.display = "inline-block";  // 完成后显示 Add Card
        addBtn.style.marginTop = "20px";
        centerBtns.style.display = "flex";      // 显示容器，仅Add Card
        startBtn.style.display = "none";        // 隐藏Start
        cardFront.style.textAlign = "center";
        cardFront.style.marginTop = "20px";
        cardFront.style.display = "inline-block";
        return;
    }
    else{
        // 正常展示卡片
        const card = dueCards[currentIndex];
        cardFront.textContent = card.front;
        cardBack.textContent = card.back;
        cardBack.style.display = "none";

        cardFront.style.display = "inline-block";
        showBtn.style.display = "inline-block";   // 只有正面显示
        ratingBtns.forEach(b => b.style.display = "none");
        cardFront.style.textAlign = "left";
        cardFront.style.marginTop = "0";        
    }

}

// --- toggle panel ---
reviewBtn.onclick = async () => {
    if (reviewPanel.style.opacity == 0) {
        reviewPanel.style.opacity = 1;

        // --- 获取今天到期的卡片 ---
        const cardres = await fetchDueCards();
        dueCards = cardres.cards;
        if (dueCards.length === 0) {
            // 今天全部完成
            cardFront.textContent = "All done! 🎉";
            cardBack.style.display = "none";
            showBtn.style.display = "none";
            ratingBtns.forEach(b => b.style.display = "none");
            
            // 显示 Add Card
            centerBtns.style.display = "flex";
            addBtn.style.display = "inline-block";
            
            cardFront.style.textAlign = "center";
            cardFront.style.marginTop = "20px";
        } else {
            // 有到期卡片，开始复习流程
            startBtn.style.display = "inline-block";
        }
    } else {
        reviewPanel.style.opacity = 0;
    }
};

// --- add card ---
addBtn.onclick = () => {
    alert("这里可以弹出添加卡片面板");
};

// --- start review ---
startBtn.onclick = async () => {
    // 点 Start 后隐藏中间按钮
    centerBtns.style.display = "none";
    currentIndex = 0;
    showCard();
};

// --- show back ---
showBtn.onclick = () => {
    cardFront.style.display = "none";
    cardBack.style.display = "block";
    showBtn.style.display = "none";
    ratingBtns.forEach(b => b.style.display = "inline-block");
};

// Again 按钮
ratingBtns[0].onclick = async () => {
    const card = dueCards[currentIndex];
    q = 0;
    // 你的 Again 逻辑，比如重置 repetitions
    card.repetitions = 0;
    card.interval = 1; // 明天再复习
    await fetch("https://englishai.hexlove12.workers.dev/api/updatecard", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: dateInt+card.interval, repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
    });
    currentIndex++;
    showCard();
};

// Hard 按钮
ratingBtns[1].onclick = async () => {
    const card = dueCards[currentIndex];
    q = 3;
    // Hard 特有逻辑
    card.repetitions += 1;
    if (card.repetitions === 1) {
        card.interval = 1;
    } else if (card.repetitions === 2) {
        card.interval = 6;
    } else {
        card.interval = Math.round(card.interval * card.ease);
    }
    // 调整难度系数
    card.ease = Math.max(1.3, card.ease + 0.1 - (5 - q) * 0.08);
    await fetch("https://englishai.hexlove12.workers.dev/api/updatecard", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: dateInt+card.interval, repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
    });
    currentIndex++;
    showCard();
};

// Good 按钮
ratingBtns[2].onclick = async () => {
    const card = dueCards[currentIndex];
    q = 4;
    // Good 特有逻辑
    card.repetitions += 1;
    if (card.repetitions === 1) {
        card.interval = 1;
    } else if (card.repetitions === 2) {
        card.interval = 6;
    } else {
        card.interval = Math.round(card.interval * card.ease);
    }
    // 调整难度系数
    card.ease = Math.max(1.3, card.ease + 0.1 - (5 - q) * 0.08);
    await fetch("https://englishai.hexlove12.workers.dev/api/updatecard", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: dateInt+card.interval, repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
    });
    currentIndex++;
    showCard();
};

// Easy 按钮
ratingBtns[3].onclick = async () => {
    const card = dueCards[currentIndex];
    q = 5;
    // Easy 特有逻辑
    card.repetitions += 1;
    if (card.repetitions === 1) {
        card.interval = 1;
    } else if (card.repetitions === 2) {
        card.interval = 6;
    } else {
        card.interval = Math.round(card.interval * card.ease);
    }
    // 调整难度系数
    card.ease = Math.max(1.3, card.ease + 0.1 - (5 - q) * 0.08);
    await fetch("https://englishai.hexlove12.workers.dev/api/updatecard", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: dateInt+card.interval, repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
    });
    currentIndex++;
    showCard();
};