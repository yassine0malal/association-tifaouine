// partenairesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { partenairesAPI } from "./partnerService";

export const fetchPartenaires = createAsyncThunk(
    "partenaires/fetchPartenaires",
    async ({ lang }, { rejectWithValue }) => {
        try {
            const data = await partenairesAPI(lang);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

const partenairesSlice = createSlice({
    name: "partenaires",
    initialState: {
        partenaires: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetPartenaires: (state) => {
            state.partenaires = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartenaires.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPartenaires.fulfilled, (state, action) => {
                state.loading = false;
                state.partenaires = action.payload?.rows || [];
            })
            .addCase(fetchPartenaires.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetPartenaires } = partenairesSlice.actions;
export default partenairesSlice.reducer;