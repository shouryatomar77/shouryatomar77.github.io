// ========= CONFIG ========= //
const OPENAI_API_KEY = "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"; // ← Put your OpenAI key here

// ========= ELEMENTS ========= //
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// ========= MAIN FUNCTION ========= //
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  displayMessage(message, "user");
  userInput.value = "";
  displayMessage("AIVA is typing...", "aiva", true);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    // Remove "AIVA is typing..." bubble
    removeTyping();

    displayMessage(reply, "aiva");
  } catch (error) {
    removeTyping();
    displayMessage("❌ Failed to get response. Please try again.", "aiva");
    console.error(error);
  }
}

// ========= DISPLAY MESSAGE ========= //
function displayMessage(message, sender, isTyping = false) {
  const msgBubble = document.createElement("div");
  msgBubble.className = `bubble ${sender}`;
  msgBubble.textContent = message;
  msgBubble.dataset.typing = isTyping;
  chatBox.appendChild(msgBubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ========= REMOVE TYPING BUBBLE ========= //
function removeTyping() {
  const typingBubble = [...chatBox.querySelectorAll(".bubble")].find(
    (b) => b.dataset.typing === "true"
  );
  if (typingBubble) typingBubble.remove();
}

// ========= EVENT LISTENERS ========= //
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});
