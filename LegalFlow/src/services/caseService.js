import api from "./api";

const list = () => api.get("/cases");

const lists = (params) => api.get("/cases", { params })

// const create = (payload) => api.post("/cases", payload);

const update = (id, payload) => api.patch(`/cases/${id}`, payload);

const remove = (id) => api.delete(`/cases/${id}`);

const create = async (data) => {
    const resp = await api.post("/cases", data)
    return resp.data;
}
export default { list, create, update, lists, remove };