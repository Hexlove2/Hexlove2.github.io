// anki.js
//计算due date
function calcDueDate(dateInt, interval) {
  // 解析整数日期
  const str = dateInt.toString();
  const year = parseInt(str.slice(0, 4));
  const month = parseInt(str.slice(4, 6)) - 1; // JS 月份从 0 开始
  const day = parseInt(str.slice(6, 8));

  // 构造 Date 对象
  const date = new Date(year, month, day);

  // 加上间隔天数
  date.setDate(date.getDate() + interval);

  // 转回 YYYYMMDD 格式整数
  const dueDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return dueDate;
}

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
reviewPanel.style.zIndex = "10000";
reviewPanel.style.display = "none";
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
// --- card display area ---

// 正面
const cardFront = document.createElement("div");
cardFront.style.position = "absolute";
cardFront.style.top = "30%";                 // 父容器正中
cardFront.style.left = "50%";
cardFront.style.transform = "translate(-50%, -50%)"; // 完全居中
cardFront.style.fontWeight = "bold";
cardFront.style.fontSize = "2em";            // 字体大
cardFront.style.color = "#ff1493";           // 鲜艳粉色
cardFront.style.textAlign = "center";        // 多行文字居中
cardFront.style.wordWrap = "break-word";     // 长文字换行
cardFront.style.lineHeight = "1.4em";        // 行高
cardFront.style.maxWidth = "80%";            // 限制宽度避免溢出
reviewPanel.appendChild(cardFront);

// 背面
const cardBack = document.createElement("div");
cardBack.style.position = "absolute";
cardBack.style.top = "30%";
cardBack.style.left = "50%";
cardBack.style.transform = "translate(-50%, -50%)";
cardBack.style.fontSize = "2em";             // 字体大
cardBack.style.color = "#4b0082";           // 深紫色
cardBack.style.textAlign = "center";
cardBack.style.wordWrap = "break-word";
cardBack.style.lineHeight = "1.4em";
cardBack.style.maxWidth = "80%";
cardBack.style.display = "none";             // 默认隐藏背面
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


// 先设置按钮容器，让它在底部水平居中
const ratingContainer = document.createElement("div");
ratingContainer.style.position = "absolute";
ratingContainer.style.bottom = "20px";         // 距离底部 20px
ratingContainer.style.left = "50%";
ratingContainer.style.transform = "translateX(-50%)"; // 完全水平居中
ratingContainer.style.display = "flex";
ratingContainer.style.justifyContent = "center";
ratingContainer.style.gap = "10px";            // 按钮间距
reviewPanel.appendChild(ratingContainer);

const ratings = ["Again", "Hard", "Good", "Easy"];
const ratingBtns = ratings.map(r => {
    const btn = document.createElement("button");
    btn.textContent = r;
    btn.style.display = "none"; 
    ratingContainer.appendChild(btn);
    return btn;
});

ratingBtns.forEach(btn => {
    btn.style.width = "80px";
    btn.style.height = "40px";
    btn.style.borderRadius = "12px";
    btn.style.border = "none";
    btn.style.backgroundColor = "#fc8ec9";
    btn.style.color = "white";
    btn.style.fontSize = "1em";
    btn.style.fontWeight = "bold";
    btn.style.cursor = "pointer";
    btn.style.margin = "0";  // 间距交给容器的 gap 控制
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
    if (reviewPanel.style.display == "none") {
        reviewPanel.style.display = "block";

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
        reviewPanel.style.display = "none";
    }
};

// =========== Create Add Card Modal ===========
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100vw";
overlay.style.height = "100vh";
overlay.style.background = "rgba(0,0,0,0.5)";
overlay.style.display = "none";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = "1000";
document.body.appendChild(overlay);

// modal box
const modal = document.createElement("div");
modal.style.background = "white";
modal.style.padding = "20px";
modal.style.borderRadius = "12px";
modal.style.width = "300px";
modal.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
modal.style.display = "flex";
modal.style.flexDirection = "column";
modal.style.gap = "12px";
overlay.appendChild(modal);

// title
const title = document.createElement("h3");
title.textContent = "Add New Card";
title.style.textAlign = "center";
modal.appendChild(title);

// input: front
const frontInput = document.createElement("textarea");
frontInput.placeholder = "Front (正面)";
frontInput.style.height = "60px";
frontInput.style.padding = "8px";
frontInput.style.borderRadius = "8px";
frontInput.style.border = "1px solid #ccc";
modal.appendChild(frontInput);

// input: back
const backInput = document.createElement("textarea");
backInput.placeholder = "Back (背面)";
backInput.style.height = "60px";
backInput.style.padding = "8px";
backInput.style.borderRadius = "8px";
backInput.style.border = "1px solid #ccc";
modal.appendChild(backInput);

// buttons container
const btnRow = document.createElement("div");
btnRow.style.display = "flex";
btnRow.style.justifyContent = "space-between";
modal.appendChild(btnRow);

// cancel button
const cancelBtn = document.createElement("button");
cancelBtn.textContent = "Cancel";
cancelBtn.style.padding = "8px 16px";
cancelBtn.style.borderRadius = "8px";
cancelBtn.style.border = "none";
cancelBtn.style.background = "#ccc";
cancelBtn.style.cursor = "pointer";
btnRow.appendChild(cancelBtn);

// add button
const confirmBtn = document.createElement("button");
confirmBtn.textContent = "Add";
confirmBtn.style.padding = "8px 16px";
confirmBtn.style.borderRadius = "8px";
confirmBtn.style.border = "none";
confirmBtn.style.background = "#ff86c7";
confirmBtn.style.color = "white";
confirmBtn.style.cursor = "pointer";
btnRow.appendChild(confirmBtn);

// =========== Button Behaviors ===========

// 点击“添加卡片”按钮
addBtn.onclick = () => {
    overlay.style.display = "flex";
};

// 点击 Cancel
cancelBtn.onclick = () => {
    overlay.style.display = "none";
};

// 点击 Add 提交 API
confirmBtn.onclick = async () => {
    const front = frontInput.value.trim();
    const back = backInput.value.trim();
    const today = new Date();
    const dateInt =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

    if (!front || !back) {
        alert("卡片内容不能为空");
        return;
    }

    try {
        const res = await fetch("https://englishai.hexlove12.workers.dev/api/addcard", {
            method: "POST",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify({
                front,
                back,
                deck: deckName,
                due_date: dateInt,
                interval: 1,
                ease: 2.5,
                repetitions: 0
            })
        });
        
        if (res.ok) {  // 状态码 200~299 都算成功
            alert("添加成功！");
            overlay.style.display = "none";
            frontInput.value = "";
            backInput.value = "";
        } else {
            // 如果服务器返回错误状态码
            const text = await res.text(); // 或者 res.json() 看接口返回格式
            alert(`添加失败，服务器返回状态码 ${res.status}，信息: ${text}`);
            console.error("服务器返回:", res.status, text);
        }
        overlay.style.display = "none";
        frontInput.value = "";
        backInput.value = "";
    } catch (e) {
        alert("添加失败，请检查网络或服务器。");
        console.error(e);
    }
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
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: calcDueDate(dateInt, card.interval), repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
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
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: calcDueDate(dateInt, card.interval), repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
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
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: calcDueDate(dateInt, card.interval), repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
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
        body: JSON.stringify({ cardId: card.id, deck: deckName, nextDate: calcDueDate(dateInt, card.interval), repUpdate: card.repetitions, easeUpdate: card.ease, intervalUpdate: card.interval })
    });
    currentIndex++;
    showCard();
};