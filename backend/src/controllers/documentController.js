const { Document } = require("../models");
const documentService = require("../services/documentService");
const fs = require("fs");
const path = require("path");
const s3 = require("../config/s3")
const { GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

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

    if (process.env.NODE_ENV === "production") {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: document.filePath,
            ResponseContentType: document.fileType,
            ResponseContentDisposition: "inline"
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 300 });
        return resp.send({
            success: true,
            url
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

    if (process.env.NODE_ENV === "production") {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: document.filePath,
            ResponseContentDisposition: `attachment; filename="${document.originalName}"`,
            ResponseContentType: document.fileType,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
        return resp.send({
            success: true,
            url: signedUrl
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