  function bindAiButton() {
    const btn = document.getElementById("send-ai");
    if (!btn) return;

    btn.onclick = async () => {
      const text = document.getElementById("eng-input").value.trim();
      const output = document.getElementById("ai-result");
      if (!text) {
        output.innerHTML = "❌ Please enter a sentence.";
        return;
      }

      output.innerHTML = "⏳ AI is evaluating...";

      try {
        const res = await fetch("https://englishai.hexlove12.workers.dev/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sentence: text })
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        // 修改后的写法
        output.innerHTML = marked.parse(data.response);
      } catch (err) {
        console.error(err);
        output.innerHTML = `❌ Error: ${err.message}`;
      }
    };
  }

  document.addEventListener("DOMContentLoaded", bindAiButton);
  document.addEventListener("pjax:complete", bindAiButton);