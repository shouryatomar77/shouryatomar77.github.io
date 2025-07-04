const OPENAI_API_KEY = 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";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  displayMessage(message, "user-msg");
  userInput.value = "";
  displayMessage("AIVA is typing...", "aiva-msg", true);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    removeTyping();
    displayMessage(reply, "aiva-msg");

  } catch (error) {
    removeTyping();
    displayMessage("Sorry, there was an error.", "aiva-msg");
  }
}

function displayMessage(message, className, isTyping = false) {
  const msg = document.createElement("div");
  msg.className = className;
  msg.textContent = message;
  msg.dataset.typing = isTyping;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typingMsgs = chatBox.querySelectorAll('[data-typing="true"]');
  typingMsgs.forEach(el => el.remove());
}

userInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") sendMessage();
});