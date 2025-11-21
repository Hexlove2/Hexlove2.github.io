// --- create container ---
const widget = document.createElement("div");
widget.style.position = "fixed";
widget.style.bottom = "48vh";
widget.style.right = "20vw";
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
      widget.style.right = "20vw";
      //console.log("timeout!!!");        
  }, 5000);  
};

btn.onclick = () => {
    recog.start();
    widget.style.bottom = "8vh";
    widget.style.right = "1vw";
    btn.style.background = "#0b93f4ff";
};