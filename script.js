const HF_API_KEY = "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"; // 🔁 Replace with your Hugging Face API key

async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const userText = inputField.value.trim();
  if (!userText) return;

  appendMessage(userText, "user");
  appendMessage("Thinking...", "bot", true);

  inputField.value = "";
  inputField.disabled = true;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: userText })
    });

    const data = await response.json();
    removeTemp();

    if (data && data[0] && data[0].generated_text) {
      appendMessage(data[0].generated_text, "bot");
    } else {
      appendMessage("⚠️ Could not get a proper response.", "error");
    }
  } catch (err) {
    removeTemp();
    appendMessage("⚠️ Error connecting to API.", "error");
  } finally {
    inputField.disabled = false;
    inputField.focus();
  }
}

function appendMessage(text, type, isTemp = false) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  if (isTemp) msg.id = "temp-msg";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTemp() {
  const temp = document.getElementById("temp-msg");
  if (temp) temp.remove();
}

document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
