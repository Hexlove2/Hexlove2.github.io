// --- create container ---
const widget = document.createElement("div");
widget.style.position = "fixed";
widget.style.bottom = "48vh";
widget.style.right = "5vw";
widget.style.width = "60px";
widget.style.background = "rgba(255,255,255,0.9)";
widget.style.padding = "10px";
widget.style.borderRadius = "12px";
widget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
widget.style.fontSize = "14px";
widget.style.zIndex = "9999";
widget.style.transition = "all 0.5s ease";
document.body.appendChild(widget);

// --- create button ---
const btn = document.createElement("button");
btn.textContent = "🎤";
btn.style.width = "40px";
btn.style.height = "40px";
btn.style.borderRadius = "50%";
btn.style.border = "none";
btn.style.background = "#f40b87ff";
btn.style.color = "white";
btn.style.fontSize = "18px";
btn.style.cursor = "pointer";
widget.appendChild(btn);


// --- create container ---
const widget2 = document.createElement("div");
widget2.style.position = "fixed";
widget2.style.bottom = "calc(48vh + 80px)";
widget2.style.right = "5vw";
widget2.style.width = "60px";
widget2.style.background = "rgba(255,255,255,0.9)";
widget2.style.padding = "10px";
widget2.style.borderRadius = "12px";
widget2.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
widget2.style.fontSize = "14px";
widget2.style.zIndex = "9999";
widget2.style.transition = "all 0.5s ease";
document.body.appendChild(widget2);

// --- create button ---
const btn2 = document.createElement("button");
btn2.textContent = "🗣️";
btn2.style.width = "40px";
btn2.style.height = "40px";
btn2.style.borderRadius = "50%";
btn2.style.border = "none";
btn2.style.background = "#f40b87ff";
btn2.style.color = "white";
btn2.style.fontSize = "18px";
btn2.style.cursor = "pointer";
widget2.appendChild(btn2);


// --- text area ---
const textBox = document.createElement("div");
textBox.textContent = "";
textBox.style.position = "fixed";  // ✅ 必须
textBox.style.bottom = "20vh";     // 距底部 10% 高
textBox.style.right = "1vw";       // 距右边 5% 宽
textBox.style.width = "24vw";
textBox.style.height = "50vh";
textBox.style.background = "rgba(250, 235, 241, 1)";
textBox.style.fontSize = "2vh";
textBox.style.fontWeight = "bold";
textBox.style.color = "rgba(18, 9, 97, 1)";
textBox.style.padding = "10px";
textBox.style.overflowY = "auto";
textBox.style.borderRadius = "8px";
textBox.style.opacity = 0;
textBox.style.display = "none";
textBox.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
textBox.style.zIndex = "9998";

document.body.appendChild(textBox);

// --- speech recognition ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recog = new SpeechRecognition();
recog.lang = "en-US";
recog.interimResults = true;


recog.onresult = (event) => {
  const text = event.results[0][0].transcript;
  textBox.style.opacity = 1;
  textBox.textContent = text;
  if (textBox.hideTimeout) clearTimeout(textBox.hideTimeout);
  // 设置定时器，duration 后清空文字
  textBox.hideTimeout = setTimeout(() => {
      textBox.textContent = "";
      textBox.style.opacity = 0;
      btn.style.background = "#f40b87ff";
      widget.style.bottom = "48vh";
      widget2.style.bottom = "calc(48vh + 80px)";
      widget2.style.right = "20vw";
      widget.style.right = "20vw";
      textBox.style.display = "none";
      //console.log("timeout!!!");        
  }, 5000);  
};

btn.onclick = () => {
    recog.start();
    textBox.style.display = "block";
    widget.style.bottom = "8vh";
    widget2.style.bottom = "calc(8vh + 0px)";
    widget2.style.right = "calc(20vw - 80px)";
    widget.style.right = "20vw";
    btn.style.background = "#0b93f4ff";
};


// 鼠标悬停朗读
let lastUtterance = null;
let speakTimer = null;
let speakEnabled = false;

function speak(text) {
    if (!text || text.trim() === '') return;
    if (lastUtterance) {
        speechSynthesis.cancel(); // 停掉上一个
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';       // 英文，可改 zh-CN
    utterance.rate = 1;             // 语速
    utterance.pitch = 1;          // 音调
    utterance.voice = speechSynthesis.getVoices().find(v => v.lang.startsWith("en") && v.name.includes("Samantha")) || speechSynthesis.getVoices()[0];

    lastUtterance = utterance;
    speechSynthesis.speak(utterance);
}

// 防抖，避免频繁触发
function debounceSpeak(text, delay = 300) {
    clearTimeout(speakTimer);
    speakTimer = setTimeout(() => speak(text), delay);
}

// 鼠标悬停监听
function handleMouseOver(e) {
    if (!speakEnabled) return;
    debounceSpeak(e.target.textContent);
}

// 按钮控制
btn2.onclick = () => {
    speakEnabled = !speakEnabled;  // 切换状态
    if (speakEnabled) {
        document.body.addEventListener('mouseover', handleMouseOver);
        btn2.style.background = "#0b93f4ff";
    } else {
        document.body.removeEventListener('mouseover', handleMouseOver);
        speechSynthesis.cancel();  // 停掉当前朗读
        btn2.style.background = "#f40b87ff";
    }
};