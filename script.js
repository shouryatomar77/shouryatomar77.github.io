
function sendMessage() {
  const input = document.getElementById("user-input");
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage("user", msg);
  input.value = "";
  getResponse(msg);
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getResponse(msg) {
  const cleaned = msg.toLowerCase().replace(/[^\w\s]/gi, "");
  const rudeWords = ["fuck", "idiot", "stupid"];

  if (["hi", "hello", "hey", "what's up", "how are you"].includes(cleaned)) {
    appendMessage("bot", "Hello! I'm AIVA, your AI assistant. How can I help you?");
  } else if (rudeWords.some(word => cleaned.includes(word))) {
    appendMessage("bot", "Fuck you too 😎");
  } else if (cleaned.includes("who is")) {
    const topic = cleaned.replace("who is", "").trim();
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`)
      .then(res => res.json())
      .then(data => {
        if (data.extract) {
          appendMessage("bot", data.extract);
        } else {
          appendMessage("bot", "I couldn't find anything useful.");
        }
      })
      .catch(() => appendMessage("bot", "Oops! Something went wrong."));
  } else {
    appendMessage("bot", "I'm not sure how to respond to that.");
  }
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;
    sendMessage();
  };
}
