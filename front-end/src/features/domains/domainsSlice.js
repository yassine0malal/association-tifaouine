import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDomainsApi } from "./domainsService";

export const fetchDomains = createAsyncThunk(
    "domains/fetchDomains",
    async (lang) => {
        const data = await fetchDomainsApi(lang);
        return data;
    },
);

const domainsSlice = createSlice({
    name: "domains",
    initialState: {
        data: [],
        status: "idle",
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchDomains.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchDomains.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload?.domains || [];
                // console.log("---data---",state.data )
            })
            .addCase(fetchDomains.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                console.log("error is !!!====> " + state.error.message);
            });
    },
});

export default domainsSlice.reducer;