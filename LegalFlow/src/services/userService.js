import api from "./api";

const list = async (params = {}) => {
    try {
        return await api.get("/users", { params });
    } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 401) {
            return { data: [] };
        }
        throw error;
    }
};

const update = (id, payload) => api.patch(`/users/${id}`, payload);

const remove = (id) => api.delete(`/users/${id}`);

const read = (id) => {
    return api.get(`/users/${id}`);
};

export default { list, update, remove, read, };