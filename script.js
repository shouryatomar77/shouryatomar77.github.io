const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

function addMessage(message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    messageDiv.innerText = message;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    addMessage(input, "user");
    userInput.value = "";

    try {
        const response = await queryHuggingFace(input);
        const answer = response?.[0]?.generated_text || "🤖 I couldn't find an answer.";
        addMessage(answer, "bot");
    } catch (err) {
        console.error(err);
        addMessage("⚠️ Failed to get a proper reply. Try again.", "bot-error");
    }
}

async function queryHuggingFace(userMessage) {
    const HF_API_KEY = "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"; // Replace this with your real API key

    const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-base",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: `Answer this: ${userMessage}`,
            }),
        }
    );

    if (!response.ok) throw new Error("API response error");
    return await response.json();
}
