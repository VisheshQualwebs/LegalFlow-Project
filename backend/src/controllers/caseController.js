const caseService = require("../services/caseService");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Document = require("../models/Document");

const create = async (req, resp) => {
    const file = await req.file();
    const uploadDir = path.join(process.cwd(), "uploads/documents");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
            recursive: true
        });
    }

    const uniqueName = crypto.randomUUID() + "-" + file.filename;
    const filePath = path.join(uploadDir, uniqueName);
    const buffer = await file.toBuffer();

    fs.writeFileSync(filePath, buffer);

    const fields = file.fields;

    const data = await caseService.create(req.user, {
        title: fields.title.value,
        description: fields.description.value,
        caseType: fields.caseType.value
    });

    const document = await Document.create({
        caseId: data.id,
        uploadedBy: req.user.id,
        fileName: uniqueName,
        originalName: file.filename,
        filePath: `uploads/documents/${uniqueName}`,
        fileType: file.mimetype,
        fileSize: file.file.bytesRead
    });

    return resp.code(201).send({
        success: true,
        message: "Case Created Successfully",
        data
    });
};

const list = async (req, resp) => {
    const cases = await caseService.list(req.user, req.query);
    return resp.send({
        success: true,
        data: cases
    });
};

const read = async (req, resp) => {
    const data = await caseService.read(
        req.user,
        req.params.id,
    );
    return resp.send({
        success: true,
        data
    });
};

const update = async (req, resp) => {
    await caseService.update(
        req.params.id,
        req.user,
        req.body
    );
    return resp.send({
        success: true,
        message: "Case Updated Successfully"
    });
};

const destroy = async (req, resp) => {
    await caseService.destroy(req.params.id, req.user);
    return resp.send({
        success: true,
        message: "Case Deleted Successfully"
    });
}

module.exports = { create, list, read, update, destroy };