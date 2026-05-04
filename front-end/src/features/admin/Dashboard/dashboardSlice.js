import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStatsAPI } from "./dashboardService";

// ─── Thunk ─────────────────────────────────────────────────

export const fetchDashboardStats = createAsyncThunk(
    "dashboard/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchDashboardStatsAPI();
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Erreur de chargement du dashboard"
            );
        }
    }
);

// ─── Slice ─────────────────────────────────────────────────

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        stats: {
            total_projets:         0,
            total_evenements:      0,
            total_domaines:        0,
            total_dons_financiers: 0,
            total_beneficiaires:   0,
            total_budget_projets:  0,
            recent_users:          [],
        },
        loading: false,
        error:   null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                // API returns { success: true, data: { total_projets, ... } }
                state.stats   = action.payload?.data ?? action.payload ?? state.stats;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error   = typeof action.payload === "string"
                    ? action.payload
                    : "Erreur de chargement";
            });
    },
});

export default dashboardSlice.reducer;