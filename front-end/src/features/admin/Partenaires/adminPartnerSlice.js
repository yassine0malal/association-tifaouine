import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    createPartnerAPI, 
    fetchAdminPartnersAPI, 
    deletePartnerAPI ,
    fetchPartnerByIdAPI,
    updatePartnerAPI
} from "./adminPartnerService";

// ASYNC THUNKS

export const createPartner = createAsyncThunk(
    "adminPartner/create",
    async (formData, { rejectWithValue }) => {
        try {
            return await createPartnerAPI(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur lors de la création");
        }
    }
);

export const fetchPartnerById = createAsyncThunk(
    "adminPartner/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchPartnerByIdAPI(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération");
        }
    }
);

export const updatePartner = createAsyncThunk(
    "adminPartner/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updatePartnerAPI(id, data);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur lors de la modification");
        }
    }
);

export const fetchPartners = createAsyncThunk(
    "adminPartner/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAdminPartnersAPI();
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de chargement");
        }
    }
);

export const deletePartner = createAsyncThunk(
    "adminPartner/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deletePartnerAPI(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de suppression");
        }
    }
);

const adminPartnerSlice = createSlice({
    name: "AdminPartner",
    initialState: {
        partners: [],
        currentPartner: null, // Pour stocker le partenaire en cours d'édition
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetStatus: (state) => {
            resetStatus: (state) => {
            state.success = false;
            state.error = null;
            state.currentPartner = null; // Optionnel : nettoyer aussi le partenaire
        }
        }
    },
    extraReducers: (builder) => {
        builder
            // FETCH ALL
            .addCase(fetchPartners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPartners.fulfilled, (state, action) => {
                state.loading = false;
                state.partners = action.payload.data || action.payload || [];
            })
            .addCase(fetchPartners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE
            .addCase(createPartner.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPartner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.partners.push(action.payload);
            })
            .addCase(createPartner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // DELETE
            .addCase(deletePartner.fulfilled, (state, action) => {
                state.partners = state.partners.filter(p => p.id !== action.payload);
            })
            .addCase(fetchPartnerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPartnerById.fulfilled, (state, action) => {
                state.loading = false;
                // Ajustez selon si votre API retourne { data: {...} } ou juste {...}
                state.currentPartner = action.payload.data || action.payload;
            })
            .addCase(fetchPartnerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updatePartner.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePartner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Mise à jour de la liste locale (optionnel si vous redirigez)
                const index = state.partners.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.partners[index] = action.payload;
            })
            .addCase(updatePartner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetStatus } = adminPartnerSlice.actions;
export default adminPartnerSlice.reducer;