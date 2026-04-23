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

                console.log("----------------------------------new data resources--->", action.payload.resources);
                state.loading = false;
                const newRessources = action.payload?.resources || [];
                
                if (action.payload.featuredInsight) {
                    state.featuredInsight = action.payload.featuredInsight;
                }

                // Remove duplicates based on id
                const existingIds = new Set(state.resources.map((src) => src.id));

                const filteredRessources = newRessources.filter(
                    (src) => !existingIds.has(src.id),
                );
                state.resources.push(...filteredRessources);

                state.totalPages = action.payload.resources?.totalPages;
                state.nextPage = action.payload.resources?.nextPage;
                state.prevPage = action.payload.resources?.prevPage;
                state.itemsPerPage = action.payload.resources?.itemsPerPage;
                state.totalItems = action.payload.resources?.totalItems;
            })

            .addCase(fetchRessources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setRessourcesPage, resetRessources } = ressourcesSlice.actions;
export default ressourcesSlice.reducer;
