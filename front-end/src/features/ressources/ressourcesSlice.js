import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ressourcesAPI } from "./ressourcesService";

export const fetchRessources = createAsyncThunk(
    "ressources/fetchRessources",
    async ({page, lang }) => {
        const data = await ressourcesAPI(page, lang);
        return data;
    }
);

const ressourcesSlice = createSlice({
    name: "ressources",
    initialState: {
        resources: [],
        loading: false,
        error: null,
        totalPages: 4,
        currentPage: 2,
        nextPage: 3,
        prevPage: 1,
        itemsPerPage: 4,
        totalItems: 0,
        featuredInsight: null
    },
    reducers: {
        setRessourcesPage: (state, action) => {
            state.currentPage = action.payload.page;
        },
        resetRessources:(state)=>{
            state.resources=[];
            state.currentPage=1;
            state.featuredInsight=null;
        }
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
                console.log("new data resources--->", action.payload.resourceLibrary);
                if (action.payload.featuredInsight) {
                    state.featuredInsight = action.payload.featuredInsight;
                }

                // Remove duplicates based on id
                const existingIds = new Set(state.resources.map((src) => src.id));

                const filteredRessources = newRessources.filter(
                    (src) => !existingIds.has(src.id),
                );
                state.resources.push(...filteredRessources);

                state.totalPages = action.payload.resourceLibrary?.totalPages;
                state.nextPage = action.payload.resourceLibrary?.nextPage;
                state.prevPage = action.payload.resourceLibrary?.prevPage;
                state.itemsPerPage = action.payload.resourceLibrary?.itemsPerPage;
                state.totalItems = action.payload.resourceLibrary?.totalItems;
            })

            .addCase(fetchRessources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    },
});

export const { setRessourcesPage, resetRessources } = ressourcesSlice.actions;
export default ressourcesSlice.reducer;
