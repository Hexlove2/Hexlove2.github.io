const panelHtml = `
<div id="ai-trigger" style="
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 50px;
    height: 50px;
    background: rgba(254, 160, 206, 1);
    border-radius: 12px;
    z-index: 9998;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
">
  AI
</div>
<div id="ai-panel" style="
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 400px;
    max-height: 80vh;
    padding: 15px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    overflow-y: auto;
    opacity: 0;  
    z-index: 9999;
    transition: all 0.3s ease;
    font-family: sans-serif;
">
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <h3 style="margin:0;">Daily AI English Review</h3>
    <button id="toggle-size" style="padding:2px 6px;border:none;background:#ccc;border-radius:4px;cursor:pointer;">⬜</button>
  </div>

  <textarea id="eng-input" style="width:100%;height:100px;padding:8px;border-radius:6px;border:1px solid #ccc;margin-top:8px;"></textarea>

  <button id="send-ai" style="margin-top:8px;padding:6px 14px;border-radius:6px;background:#0078ff;color:white;border:none;cursor:pointer;width:100%;">
    Submit to AI
  </button>

  <div id="ai-result" style="margin-top:10px;padding:8px;border-radius:6px;background:#f3f3f3;max-height:800px;overflow-y:auto;"></div>
</div>
`;

const prompts = [
    "You are an English teacher. Evaluate this sentence and return only the following: 1. Grammar corrections (concise) 2. More natural version (concise) 3. Explanation of errors (brief and simple), use headline like ### in front of every part, there might be mutiple sentences, so make sure check all of them, here are the sentences:",
    "",
    ""
];
// 动态加载 marked
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  script.onload = () => {
    // marked 加载完成后再绑定按钮
    bindAiButton();
  };
  document.head.appendChild(script);

  function bindAiButton() {
    const btn = document.getElementById("send-ai");
    if (!btn) return;

    btn.onclick = async () => {
      const text = document.getElementById("eng-input").value.trim();

      const script = document.getElementById("aipanel");
      const agentStr = script.getAttribute('data-agent'); // "1"
      const agent = Number(agentStr); // 1
      const extra = prompts[agent];
      const final = extra + text;
      const output = document.getElementById("ai-result");
      if (!text) {
        output.innerHTML = "❌ Please enter a sentence.";
        return;
      }

      output.innerHTML = "⏳ AI is evaluating...";

      try {
        const token = localStorage.getItem("ankiToken"); // 你保存 token 的地方

        const res = await fetch("https://englishai.hexlove12.workers.dev/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ sentence: final })
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        output.innerHTML = marked.parse(data.response); // Markdown -> HTML
      } catch (err) {
        console.error(err);
        output.innerHTML = `❌ Error: ${err.message}`;
      }
    };
  }
})();

document.body.insertAdjacentHTML('beforeend', panelHtml);

// 后面放浮窗逻辑
const panel = document.getElementById('ai-panel');
const toggleBtn = document.getElementById('toggle-size');
let isFull = false;

document.getElementById('send-ai').addEventListener('click', () => {
    panel.style.top = '0';
    panel.style.left = '0';
    panel.style.width = '100%';
    panel.style.height = '100%';
    panel.style.maxHeight = '100%';
    panel.style.borderRadius = '0';
    panel.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
    isFull = true;
});

toggleBtn.addEventListener('click', () => {
    if(isFull){
        panel.style.bottom = '10px';
        panel.style.right = '10px';
        panel.style.top = 'auto';
        panel.style.left = 'auto';
        panel.style.width = '400px';
        panel.style.height = 'auto';
        panel.style.maxHeight = '80vh';
        panel.style.borderRadius = '10px';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        //panel.style.opacity = '1';
        isFull = false;
    } else {
        panel.style.top = '0';
        panel.style.left = '0';
        panel.style.width = '100%';
        panel.style.height = '100%';
        panel.style.maxHeight = '100%';
        panel.style.borderRadius = '0';
        panel.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
        isFull = true;
    }
});

const trigger = document.getElementById('ai-trigger');

trigger.addEventListener('mouseenter', () => {
    panel.style.opacity = 1;
    panel.style.pointerEvents = 'auto';
});

trigger.addEventListener('mouseleave', () => {
    setTimeout(() => {
        if (!panel.matches(':hover')&&!isFull) {
            panel.style.opacity = 0;
            panel.style.pointerEvents = 'none';
        }
    }, 100);
});

panel.addEventListener('mouseleave', () => {
    if(!isFull){
        panel.style.opacity = 0;
        panel.style.pointerEvents = 'none';        
    }
});