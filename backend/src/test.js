const { summarizeDocument } = require("./services/aiService");

    (async () => {
        const text = `This agreement is entered into between ABC Pvt Ltd and XYZ Pvt Ltd. The contract starts on 1 August 2026. Payment shall be completed before 15 August 2026`;
        const summary = await summarizeDocument(text);
        console.log("Summary: ", summary);
    })();

    