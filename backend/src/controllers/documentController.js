const { Document } = require("../models");
const documentService = require("../services/documentService");
const fs = require("fs");
const path = require("path");

const list = async (req, resp) => {
    const documents = await documentService.list(req.user);
    return resp.send({
        success: true,
        data: documents,
    });
};

const viewDocument = async (req, resp) => {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
        return resp.code(404).send({
            success: false,
            message: "Document not found"
        });
    }

    const fullPath = path.join(process.cwd(), document.filePath);

    if (!fs.existsSync(fullPath)) {
        return resp.code(404).send({
            success: false,
            message: "File not found on disk"
        });
    }

    resp.type(document.fileType);

    return resp.send(fs.createReadStream(fullPath));
};

const downloadDocument = async (req, resp) => {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
        return resp.code(404).send({
            success: false,
            message: "Document not found"
        });
    }

    const fullPath = path.join(process.cwd(), document.filePath);

    if (!fs.existsSync(fullPath)) {
        return resp.code(404).send({
            success: false,
            message: "File not found on disk"
        });
    }

    resp.header(
        "Content-Disposition",
        `attachment; filename="${document.originalName}"`
    );

    resp.type(document.fileType);

    return resp.send(fs.createReadStream(fullPath));
};

module.exports = { list, downloadDocument, viewDocument };