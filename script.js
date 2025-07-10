
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

function appendMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  const lowered = text.toLowerCase();

  // Respond to greetings
  if (["hi", "hello", "hey", "good morning", "good evening", "what's up"].includes(lowered)) {
    appendMessage("Hello! I'm AIVA, your AI assistant. How can I help you today?", "bot");
    return;
  }

  // Respond to insults
  if (lowered.includes("fuck you")) {
    appendMessage("Fuck you too 😎", "bot");
    return;
  }

  // Respond to "who is..." or "what is..." questions more smartly
  let topic = lowered;
  if (lowered.startsWith("who is") || lowered.startsWith("what is") || lowered.startsWith("tell me about")) {
    const words = text.split(" ");
    const whoIndex = words.indexOf("who");
    const whatIndex = words.indexOf("what");
    const tellIndex = words.indexOf("tell");

    if (whoIndex !== -1) topic = words.slice(whoIndex + 2).join(" ");
    else if (whatIndex !== -1) topic = words.slice(whatIndex + 2).join(" ");
    else if (tellIndex !== -1) topic = words.slice(tellIndex + 3).join(" ");
  }

  fetchWikipedia(topic);
}

function fetchWikipedia(query) {
  const apiUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent("https://en.wikipedia.org/api/rest_v1/page/summary/" + query);

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const result = JSON.parse(data.contents);
      if (result.extract) {
        appendMessage(result.extract, "bot");
      } else {
        appendMessage("I couldn't find anything useful.", "bot");
      }
    })
    .catch(() => appendMessage("Oops! Something went wrong.", "bot"));
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
