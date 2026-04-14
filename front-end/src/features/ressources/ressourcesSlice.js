import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ressourcesAPI } from "./ressourcesService";

export const fetchRessources = createAsyncThunk(
    "ressources/fetchRessources",
    async ({ src, page, lang }) => {
        const data = await ressourcesAPI(src, page, lang);
        return data;
    }
);

const ressourcesSlice = createSlice({
    name: "ressources",
    initialState: {
        resources: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        nextPage: 2,
        prevPage: 0,
        itemsPerPage: 4,
        totalItems: 0,
        featuredInsight: null
    },
    reducers: {
        setRessourcesPage: (state, action) => {
            state.currentPage = action.payload.page;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchRessources.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchRessources.fulfilled, (state, action) => {

                state.loading = false;
                const newRessources = action.payload.resourceLibrary?.resources || [];
                console.log("new data resources--->", action.payload.totalPages);
                // console.log("*****new Ressources--->", newRessources);
                console.log("****************--->");
                if (action.payload.featuredInsight) {
                    state.featuredInsight = action.payload.featuredInsight;
                }

                // Remove duplicates based on id
                const existingIds = new Set(state.resources.map((src) => src.id));

                const filteredRessources = newRessources.filter(
                    (src) => !existingIds.has(src.id),
                );
                state.resources.push(...filteredRessources);

                state.totalPages = action.payload.resourceLibrary?.totalPages || 1;
                state.nextPage = action.payload.resourceLibrary?.nextPage || null;
                state.prevPage = action.payload.resourceLibrary?.prevPage || null;
                state.itemsPerPage = action.payload.resourceLibrary?.itemsPerPage || 6;
                state.totalItems = action.payload.resourceLibrary?.totalItems || 0;
            })

            .addCase(fetchRessources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    },
});

export const { setRessourcesPage } = ressourcesSlice.actions;
export default ressourcesSlice.reducer;
