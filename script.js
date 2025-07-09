const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const appendMessage = (sender, message) => {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerText = message;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

const fetchWikipediaSummary = async (query) => {
  try {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.extract) {
      return data.extract;
    } else {
      return "I couldn't find anything useful on Wikipedia.";
    }
  } catch (error) {
    return "Wikipedia lookup failed.";
  }
};

const sendMessage = async () => {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("user", input);
  userInput.value = "";

  try {
    const response = await fetch("https://huggingface.co/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: input })
    });

    const data = await response.json();
    let output = data.generated_text || data.generated_text?.[0] || "";

    if (!output || output.toLowerCase().includes("i don't understand") || output.length < 5) {
      output = await fetchWikipediaSummary(input);
    }

    appendMessage("bot", output);
  } catch (error) {
    appendMessage("bot", "Oops! Something went wrong.");
  }
};

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});