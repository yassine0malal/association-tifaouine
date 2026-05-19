import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchAdminResourcesAPI,
    createResourceAPI,
    deleteResourceAPI,
    fetchResourceByIdAPI,
    updateResourceAPI
} from "./adminResourceService";

// ASYNC THUNKS

export const fetchResources = createAsyncThunk(
    "adminResource/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            // params contains { page, search }
            return await fetchAdminResourcesAPI(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de chargement");
        }
    }
);

export const createResource = createAsyncThunk(
    "adminResource/create",
    async (formData, { rejectWithValue }) => {
        try {
            return await createResourceAPI(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur lors de l'ajout");
        }
    }
);

export const fetchResourceById = createAsyncThunk(
    "adminResource/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchResourceByIdAPI(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Ressource introuvable");
        }
    }
);

export const updateResource = createAsyncThunk(
    "adminResource/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updateResourceAPI(id, data);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur lors de la modification");
        }
    }
);

export const deleteResource = createAsyncThunk(
    "adminResource/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteResourceAPI(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de suppression");
        }
    }
);

const adminResourceSlice = createSlice({
    name: "adminResource",
    initialState: {
        resources: [],
        pagination: null, // Added to store metadata from the backend
        currentResource: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetStatus: (state) => {
            state.success = false;
            state.error = null;
            state.currentResource = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // FETCH ALL
            .addCase(fetchResources.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResources.fulfilled, (state, action) => {
                state.loading = false;
                // Capture the full structure from your backend response
                state.resources = action.payload.data || [];
                state.pagination = action.payload.pagination || null;
            })
            .addCase(fetchResources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE
            .addCase(createResource.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createResource.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Optional: handle unshift if you want immediate UI feedback
                const newResource = action.payload.data || action.payload;
                state.resources.unshift(newResource);
            })
            .addCase(createResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FETCH BY ID
            .addCase(fetchResourceById.fulfilled, (state, action) => {
                state.currentResource = action.payload.data || action.payload;
            })

            // UPDATE
            .addCase(updateResource.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                console.log("(----");
                const updated = action.payload.data || action.payload;
                const index = state.resources.findIndex(r => r.id === updated.id);
                if (index !== -1) state.resources[index] = updated;
            })

            // DELETE
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.resources = state.resources.filter(r => r.id !== action.payload);
            });
    },
});

export const { resetStatus } = adminResourceSlice.actions;
export default adminResourceSlice.reducer;