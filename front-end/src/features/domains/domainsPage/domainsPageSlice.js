import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDomainsPageApi } from "./domainsPageService";


export const fetchDomainsPage = createAsyncThunk(
    "domainsPage/fetchDomainsPage",
    async (lang) => {
        const data = await fetchDomainsPageApi(lang);
        return data;
    },
);

const domainsPageSlice = createSlice({
    name: "domainsPage",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (buider) => {
        buider.
            addCase(fetchDomainsPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDomainsPage.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload?.domainsList || [];
            })
            .addCase(fetchDomainsPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error is !!!=========" + state.error.message);
            });
    },
});

export default domainsPageSlice.reducer;