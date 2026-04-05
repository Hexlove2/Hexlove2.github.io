// --- 配置 ---
const CLOUD_FLARE_LOGIN_URL = "https://englishai.hexlove12.workers.dev/api/login"; // 替换成你实际的 Worker 地址



const loginBtn = document.createElement("button");
loginBtn.textContent = "Log";
loginBtn.style.position = "fixed";
loginBtn.style.bottom = "13vh";
loginBtn.style.right = "10px";
loginBtn.style.width = "50px";
loginBtn.style.height = "50px";
loginBtn.style.borderRadius = "12px";
loginBtn.style.border = "none";
loginBtn.style.background = "#fc8ec9ff";
loginBtn.style.color = "white";
loginBtn.style.cursor = "pointer";
loginBtn.style.zIndex = "9999";
document.body.appendChild(loginBtn);
let loginbox_on = false;

// --- 检查 token ---
async function checkToken() {
    const savedToken = localStorage.getItem("ankiToken");
    if (!savedToken) {
        showLoginBox();
        loginbox_on = true;
    } else {
        try {
            const res = await fetch("https://englishai.hexlove12.workers.dev/api/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${savedToken}`
                }
            });

            if (res.status === 200) {
                loginBtn.style.display = "none";
            } else {
                localStorage.removeItem("ankiToken");
                showLoginBox();
                loginbox_on = true;
            }
        } catch (e) {
            console.error("Token verification failed:", e);
            showLoginBox();
        }
    }
}

checkToken();  // 调用

loginBtn.onclick = () => {
    if(loginbox_on){
        if(loginBox.style.display == "none")
            loginBox.style.display = "block"; 
        else
            loginBox.style.display = "none";
    }
}

// --- 创建登录框 ---
function showLoginBox() {
    const loginBox = document.createElement("div");
    loginBox.id = "loginBox";
    loginBox.style.position = "fixed";
    loginBox.style.bottom = "30vh";
    loginBox.style.right = "20px";
    loginBox.style.width = "260px";
    loginBox.style.padding = "15px";
    loginBox.style.background = "rgba(250,235,241,0.95)";
    loginBox.style.borderRadius = "12px";
    loginBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
    loginBox.style.zIndex = "9999";
    loginBox.style.fontFamily = "sans-serif";

    const title = document.createElement("div");
    title.textContent = "Login";
    title.style.fontWeight = "bold";
    title.style.fontSize = "16px";
    title.style.marginBottom = "10px";
    loginBox.appendChild(title);

    const userInput = document.createElement("input");
    userInput.placeholder = "Username";
    userInput.style.width = "100%";
    userInput.style.marginBottom = "8px";
    userInput.style.padding = "6px";
    userInput.style.borderRadius = "6px";
    userInput.style.border = "1px solid #ccc";
    loginBox.appendChild(userInput);

    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.placeholder = "Password";
    passInput.style.width = "100%";
    passInput.style.marginBottom = "8px";
    passInput.style.padding = "6px";
    passInput.style.borderRadius = "6px";
    passInput.style.border = "1px solid #ccc";
    loginBox.appendChild(passInput);

    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.style.width = "100%";
    loginBtn.style.padding = "8px";
    loginBtn.style.borderRadius = "8px";
    loginBtn.style.border = "none";
    loginBtn.style.background = "#0b93f4ff";
    loginBtn.style.color = "white";
    loginBtn.style.cursor = "pointer";
    loginBox.appendChild(loginBtn);

    document.body.appendChild(loginBox);

    // --- 登录按钮点击事件 ---
    loginBtn.onclick = async () => {
        const username = userInput.value.trim();
        const password = passInput.value.trim();
        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        try {
            const res = await fetch("https://englishai.hexlove12.workers.dev/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem("ankiToken", data.token);
                document.body.removeChild(loginBox); // 登录成功隐藏框
                initAnkiFeatures(data.token);
            } else {
                alert("Login failed");
            }
        } catch (e) {
            console.error("Login error:", e);
            alert("Login error");
        }
    };
}