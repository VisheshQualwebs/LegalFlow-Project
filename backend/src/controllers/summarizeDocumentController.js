const path = require("path");
const { Document } = require("../models");
const { summarizeDocument } = require("../services/aiService");
const fs = require("fs");
const pdfParse = require("pdf-parse");

async function summarizeDocumentController(req, resp) {
    console.log("Hit backend summarize document controller")
    try {
        const { id } = req.params;

        // console.log("Document ID:", id);
        const document = await Document.findByPk(id);
        // console.log(document);
        if (!document) {
            return resp.status(404).json({ message: "Document not found" });
        }

        // read file
        const fullPath = path.join(process.cwd(), document.filePath);
        // console.log("cwd:", process.cwd());
        // console.log("document.filePath:", document.filePath);
        // console.log("fullPath:", fullPath);
        // console.log("exists:", fs.existsSync(fullPath));
        if (!fs.existsSync(fullPath)) {
            return resp.code(404).send({
                message: "File not found on disk"
            });
        }

        const buffer = fs.readFileSync(fullPath);

        const data = await pdfParse(buffer);
        const text = data.text;
        // console.log("PDF Text Length:", text.length);
        // console.log(text.substring(0, 300));
        // generate summary
        const summary = await summarizeDocument(text.substring(0, 1000));

        // save summary
        document.summary = summary; //for regenerating summary
        await document.save();

        return resp.code(200).send({
            "message": "Response generated",
            summary,
        })
    } catch (error) {
        console.error("Summary Error");
        console.error(error);
        console.error(error.message);
        console.error(error.stack);

        throw error;
        // return resp.code(500).json({ message: "Failed to generate summary" });
    }
}

module.exports = { summarizeDocumentController }

/*
1. extracting document id from the parameters 
2. check document exist
3. document read
4. extract data text using pdfParse
5. call ai class 
6. save response in the document table in summary field 
7. return response
*/