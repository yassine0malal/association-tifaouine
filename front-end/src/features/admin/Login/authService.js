import axios from "axios";

const BASE_BACK_END_URL = import.meta.env.VITE_BASE_BACK_END_URL;

// apiAxios → protected routes
// authAxios → refresh/login

// Create a normal instance for auth endpoints (no token needed)

const authAxios = axios.create({
    baseURL: BASE_BACK_END_URL,
    withCredentials: true,
});

// This instance will be used for all protected requests
const apiAxios = axios.create({
    baseURL: BASE_BACK_END_URL,
    withCredentials: true
})


apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {

                await authAxios.post('/api/auth/refresh-token');
                return apiAxios(originalRequest);

            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error)
    }
)








export const loginAdminApi = async (creadentials) => {
    const res = await authAxios.post("/api/auth/login", creadentials)
    console.log("nicce-------------", res.data, '\n..................', res.headers['x-access-token'])
    return res.data;
}

export const refreshTokenApi = async () => {
    try {
        const res = await authAxios.post("/api/auth/refresh-token");
        console.log("Refressssh ******** ", res.data);
        return res.data;
    } catch (error) {
        console.log("error hapedning", err);
        throw error;
    }
}
export const logoutAdminApi = async () => {
    try {
        await apiAxios.post("/api/auth/logout");
    } catch (error) {
        // Ignore any errors – we still consider the user logged out
        console.warn("Logout API error (ignored):", error);
    }
};

export const getProfileApi = async () => {
    const res = await apiAxios.get("/api/auth/profile");
    return res.data;
}


export const protectedApi = apiAxios;