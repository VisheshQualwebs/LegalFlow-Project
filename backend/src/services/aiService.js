const axios = require("axios");

// const ollama_url = "http://localhost:11434/api/generate"
const ollama_url = "http://host.docker.internal:11434/api/generate";
async function summarizeDocument(text) {
    try {
        const prompt = `summarize the following legal document in 5-7 points. Document: ${text}`;

        const response = await axios.post(ollama_url, {
            model: "llama3.2",
            prompt,
            stream: false
        }, {
            timeout: 300000,
        });

        return response.data.response;
    } catch (error) {
        console.log("Summary Error: ", error.message);
        if (error.response) {
            console.error(error.response.data);
        }
        return `Summary generation failed`;
    }
}

module.exports = { summarizeDocument };

