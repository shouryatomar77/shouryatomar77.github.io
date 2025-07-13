
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

function appendMessage(sender, text) {
  const message = document.createElement("div");
  message.className = sender === "user" ? "user-message" : "bot-message";
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage("user", msg);
  input.value = "";
  getAIVAResponse(msg.toLowerCase());
}

function getAIVAResponse(msg) {
  const rudeWords = ["fuck", "shit", "idiot"];
  if (rudeWords.some(word => msg.includes(word))) {
    appendMessage("bot", "Please don’t use offensive language.");
    return;
  }

  const greetings = ["hi", "hello", "hey"];
  if (greetings.some(g => msg.includes(g))) {
    appendMessage("bot", "Hi! How can I help you?");
    return;
  }

  if (msg.startsWith("who is") || msg.startsWith("what is")) {
    const topic = msg.replace(/who is|what is|\?/g, "").trim().replace(/ /g, "_");
    fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + topic)
      .then(res => res.json())
      .then(data => {
        if (data.extract) appendMessage("bot", data.extract);
        else appendMessage("bot", "I couldn’t find anything useful.");
      })
      .catch(() => appendMessage("bot", "Oops! Something went wrong."));
  } else {
    appendMessage("bot", "I’m not sure how to respond. Try asking: Who is Elon Musk?");
  }
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = function(event) {
    input.value = event.results[0][0].transcript;
    sendMessage();
  };
}
