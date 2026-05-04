import { protectedApi } from "../Login/authService";

export const fetchDashboardStatsAPI = async () => {
    const res = await protectedApi.get(`/api/admin/dashboard`);
    return res.data;
};