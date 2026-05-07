import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchAbonnesAPI,
    fetchAbonnementStatsAPI,
    deleteAbonneAPI,
} from "./SubscriptionAdminService";

// ─── Thunks ────────────────────────────────────────────────

export const fetchAbonnes = createAsyncThunk(
    "adminAbonnement/fetchAll",
    async (_, { rejectWithValue }) => {           // ← fix: was `({ rejectWithValue })`
        try {
            return await fetchAbonnesAPI();
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de chargement");
        }
    }
);

export const fetchAbonnementStats = createAsyncThunk(
    "adminAbonnement/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAbonnementStatsAPI();
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de chargement des statistiques");
        }
    }
);

export const deleteAbonne = createAsyncThunk(
    "adminAbonnement/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteAbonneAPI(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de suppression");
        }
    }
);

// ─── Helpers ───────────────────────────────────────────────

/**
 * The API returns: { success: true, data: toAbonnesListDTO(...) }
 * toAbonnesListDTO likely returns { abonnes: [...], pagination: {...} }
 * This function safely extracts the array regardless of the shape.
 */
const extractAbonnes = (payload) => {
    // { success, data: { abonnes: [...] } }
    if (Array.isArray(payload?.data?.abonnes)) return payload.data.abonnes;
    // { success, data: [...] }
    if (Array.isArray(payload?.data)) return payload.data;
    // { abonnes: [...] }
    if (Array.isArray(payload?.abonnes)) return payload.abonnes;
    // Direct array fallback
    if (Array.isArray(payload)) return payload;
    return [];
};

const extractStats = (payload) => {
    if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        return payload.data;
    }
    return payload ?? {};
};

// ─── Slice ─────────────────────────────────────────────────

const adminAbonnementSlice = createSlice({
    name: "adminAbonnement",
    initialState: {
        abonnes: [],
        stats: {
            totalAbonnes: 0,
            abonnesCeMois: 0,
            croissanceMensuelle: 0,
        },
        loading: false,
        loadingStats: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // ── FETCH LIST ───────────────────────────────────
            .addCase(fetchAbonnes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAbonnes.fulfilled, (state, action) => {
                console.log("fetched the data ", action.payload)

                state.loading = false;
                state.abonnes = extractAbonnes(action.payload);
            })
            .addCase(fetchAbonnes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // ── FETCH STATS ──────────────────────────────────
            .addCase(fetchAbonnementStats.pending, (state) => {
                state.loadingStats = true;
            })
            .addCase(fetchAbonnementStats.fulfilled, (state, action) => {
                state.loadingStats = false;
                state.stats = extractStats(action.payload);
            })
            .addCase(fetchAbonnementStats.rejected, (state) => {
                state.loadingStats = false;
            })

            // ── DELETE ───────────────────────────────────────
            .addCase(deleteAbonne.fulfilled, (state, action) => {
                state.abonnes = state.abonnes.filter((a) => a.id !== action.payload);
                state.stats.totalAbonnes = Math.max(0, state.stats.totalAbonnes - 1);
            })
            .addCase(deleteAbonne.rejected, (state, action) => {
                console.error("Échec de la suppression de l'abonné:", action.payload);
            });
    },
});

export default adminAbonnementSlice.reducer;