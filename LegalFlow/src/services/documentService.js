import api from "./api";

const getDocuments = async () => {
    const resp = await api.get("/documents");
    return resp.data.data;
}

const uploadDocument = async (formData) => {
    const resp = await api.post("/documents/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return resp.data;
}

const downloadDocument = async (id) => {
    const token = localStorage.getItem("token");

    const response = await api.get(`/documents/${id}/download`, {
        responseType: "blob",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const url = window.URL.createObjectURL(response.data);

    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
}

const viewDocument = async (id) => {
    const token = localStorage.getItem("token");

    const response = await api.get(`/documents/${id}/view`, {
        responseType: "blob",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const url = window.URL.createObjectURL(response.data);
    window.open(url, "_blank");
}

const summarizeDocument = async (id) => {
    console.log("frontend document service called")
    const response = await api.post(`/documents/${id}/summarize`);
    return response.data;
}

const documentService = { getDocuments, uploadDocument, downloadDocument, viewDocument, summarizeDocument };

export default documentService;