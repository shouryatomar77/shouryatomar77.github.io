const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    displayMessage(message, "user");
    userInput.value = "";

    fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: {
                text: message
            }
        })
    })
    .then((res) => res.json())
    .then((data) => {
        const reply = data.generated_text || "⚠️ Failed to get a proper reply. Try again.";
        displayMessage(reply, "bot");
    })
    .catch((error) => {
        displayMessage("❌ Failed to get response. Please try again.", "bot");
        console.error(error);
    });
}

function displayMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
