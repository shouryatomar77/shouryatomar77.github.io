window.onload = () => {
  setTimeout(() => {
    document.querySelector('.splash').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'flex';
  }, 3500);
};

const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatbox");
const micBtn = document.getElementById("micBtn");
const notifySound = document.getElementById("notify");

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-msg" : "bot-msg";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  notifySound.play();
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = speechSynthesis.getVoices().find(v => v.lang === 'en-US');
  speechSynthesis.speak(utterance);
}

// ✅ Wikipedia API via CORS Proxy
async function fetchWikipediaSummary(query) {
  const wikiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  const proxyURL = `https://api.allorigins.win/raw?url=${encodeURIComponent(wikiURL)}`;
  try {
    const res = await fetch(proxyURL);
    if (!res.ok) throw new Error("Wikipedia request failed");
    const data = await res.json();
    return data.extract || null;
  } catch {
    return null;
  }
}

// 🧠 Ask AIVA
async function askAIVA(question) {
  appendMessage(question, "user");
  let reply = "Thinking...";

  try {
    const res = await fetch("https://huggingface.co/spaces/yuntian-deng/ChatGPT/raw/main/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: question })
    });

    const data = await res.json();
    reply = data?.generated?.trim();

    // Fallback to Wikipedia
    if (!reply || reply.toLowerCase().includes("i don't")) {
      const wikiReply = await fetchWikipediaSummary(question);
      reply = wikiReply || "Sorry, I didn’t get that.";
    }
  } catch (e) {
    reply = "Sorry, I didn’t get that.";
  }

  appendMessage(reply, "bot");
  speak(reply);
}

// ✉️ Send button click
sendBtn.onclick = () => {
  const msg = input.value.trim();
  if (msg) {
    askAIVA(msg);
    input.value = "";
  }
};

// ⌨️ Enter key support
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// 🎤 Voice input (mic)
micBtn.onclick = () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = (e) => {
    input.value = e.results[0][0].transcript;
    sendBtn.click();
  };
  recognition.start();
};
