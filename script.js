const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

const HF_API_KEY = "hf_your_actual_key_here"; // Replace with your Hugging Face API key
const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small";

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";
  appendMessage("bot", "Thinking...", true);

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const result = await response.json();
    document.querySelector(".bot-message.typing").remove();

    if (result && result.length > 0 && result[0].generated_text) {
      appendMessage("bot", result[0].generated_text);
    } else if (result && result.generated_text) {
      appendMessage("bot", result.generated_text);
    } else {
      appendMessage("bot", "⚠️ Could not get a response.", true);
    }
  } catch (error) {
    document.querySelector(".bot-message.typing").remove();
    appendMessage("bot", "❌ Error reaching Hugging Face API. Try again later.", true);
  }
}

function appendMessage(sender, text, isTyping = false) {
  const message = document.createElement("div");
  message.classList.add("message", `${sender}-message`);
  if (isTyping) message.classList.add("typing");
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});