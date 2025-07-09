
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

const badWords = ["fuck", "shit", "bitch"];

function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    if (badWords.some(word => text.toLowerCase().includes(word))) {
        appendMessage("⚠️ Please avoid using offensive language.", "bot");
        return;
    }

    fetchWikipedia(text);
}

function fetchWikipedia(query) {
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent("https://en.wikipedia.org/api/rest_v1/page/summary/" + query)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Network response failed");
            return response.json();
        })
        .then(data => {
            const result = JSON.parse(data.contents);
            if (result.extract) {
                appendMessage(result.extract, "bot");
            } else {
                appendMessage("I couldn't find anything useful on that.", "bot");
            }
        })
        .catch(error => {
            appendMessage("Oops! Something went wrong.", "bot");
        });
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
