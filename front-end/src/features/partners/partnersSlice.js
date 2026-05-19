import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { partnersAPI } from "./partnerService";


export const fetchPartners = createAsyncThunk(
    "partners/fetchPartners",
    async ({ lang }) => {
        const data = await partnersAPI(lang)
        return data;
    }
);

const partnersSlice = createSlice({
    name: "partners",
    initialState: {
        partners: [],
        loading: false,
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPartners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPartners.fulfilled, (state, action) => {
                // console.log("------", action.payload);
                state.loading = false;
                state.partners = action.payload.rows;
            })
            .addCase(fetchPartners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { } = partnersSlice.actions;
export default partnersSlice.reducer;

