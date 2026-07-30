const axios = require("axios");

// const ollama_url = "http://localhost:11434/api/generate"
const ollama_url = "http://host.docker.internal:11434/api/generate";
async function summarizeDocument(text) {
    try {
        const prompt = `summarize the following legal document in 5-7 points with important dates. Document: ${text}`;

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


/*
the ollama response in the below format
{
  "model": "llama3.2",
  "created_at": "2026-07-29T16:18:00.000000Z",
  "response": "The sky is blue because of Rayleigh scattering.",
  "done": true,
  "done_reason": "stop",
  "context": [1023, 4032, 839],
  "total_duration": 456789012,
  "load_duration": 123456,
  "prompt_eval_count": 12,
  "prompt_eval_duration": 345678,
  "eval_count": 24,
  "eval_duration": 412345
}
*/

