import api from "./api";

// const list = () => api.get("/cases");

const list = async (params = {}) => {
    const resp = await api.get("/cases", { params });
    return resp.data.data;
};

const update = (id, payload) => api.patch(`/cases/${id}`, payload);

const remove = (id) => api.delete(`/cases/${id}`);

const create = async (data) => {
    const resp = await api.post("/cases", data)
    return resp.data;
}

export default { list, create, update, remove };