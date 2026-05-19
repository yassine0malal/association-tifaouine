

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { membresAPI } from "./membresService";

export const fetchMembres = createAsyncThunk(
    "membres/fetchMembres",
    async ({ lang }, { rejectWithValue }) => {
        try {
            const data = await membresAPI(lang);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

const membresSlice = createSlice({
    name: "membres",
    initialState: {
        membres: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetMembres: (state) => {
            state.membres = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMembres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembres.fulfilled, (state, action) => {
                console.log("payload ",action.payload.data)
                state.loading = false;
                state.membres = action.payload?.data || [];
            })
            .addCase(fetchMembres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetMembres } = membresSlice.actions;
export default membresSlice.reducer;