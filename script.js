const OPENAI_API_KEY = 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"; // Replace with your API key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  displayMessage(message, "user-msg");
  userInput.value = "";
  displayMessage("AIVA is typing...", "aiva-msg");
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
    const reply = data.choices[0].message.content;
    document.querySelector(".aiva-msg:last-of-type").textContent = reply;
  } catch (error) {
    document.querySelector(".aiva-msg:last-of-type").textContent = "Error connecting to AI.";
  }
}

function displayMessage(msg, className) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.className = className;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
