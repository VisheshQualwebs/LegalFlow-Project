const caseService = require("../services/caseService");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Document = require("../models/Document");
const { getIO } = require("../utils/socket");

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
    const io = getIO();
    io.emit("dashboardUpdate");
    return resp.code(201).send({
        success: true,
        message: "Case Created Successfully",
        data
    });
};

const list = async (req, resp) => {
    const cases = await caseService.list(req.user, req.query);
    if(cases.pagination) {
        return resp.send({
            success: true,
            data: cases,
            pagination: cases.pagination,
        })
    }
    return resp.send({
        success: true,
        data: cases,
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
    const updatedCase = await caseService.update(
        req.params.id,
        req.user,
        req.body
    );
    const io = getIO();
    io.to(`case:${req.params.id}`).emit("case:updated", updatedCase);
    io.emit("dashboardUpdate")
    return resp.send({
        success: true,
        message: "Case Updated Successfully",
        data: updatedCase
    });
};

const destroy = async (req, resp) => {
    const id = req.params.id;
    await caseService.destroy(id, req.user);
    const io = getIO();
    io.to(`case:${id}`).emit("case:deleted", { id });
    io.emit("dashboardUpdate");
    return resp.send({
        success: true,
        message: "Case Deleted Successfully"
    });
}

module.exports = { create, list, read, update, destroy };