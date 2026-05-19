import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ressourcesAPI } from "./ressourcesService";
export const fetchRessources = createAsyncThunk(
    "ressources/fetchRessources",
    async ({page,lang, limit }) => {
        const data = await ressourcesAPI(page, lang, limit);
        return data;
    }
);

const ressourcesSlice = createSlice({
    name: "ressources",
    initialState: {
        resources: [],
        loading: false,
        error: null,
        totalPages: 0,
        currentPage: 1,
        nextPage: false,
        prevPage: false,
        itemsPerPage: 4,
        totalItems: 0,
        featuredInsight: null,
        currentLang: null
    },
    reducers: {
        setRessourcesPage: (state, action) => {
            state.currentPage = action.payload.page;
        },
        resetRessources: (state, action) => {
            state.resources = [];
            state.currentPage = 1;
            state.featuredInsight = null;
            state.totalPages = 0;
            state.totalItems = 0;
            state.nextPage = false;
            state.prevPage = false;
            state.itemsPerPage = 4;
            state.currentLang = action.payload;
            // console.log("----------------", state.resources, state.currentPage, state.currentLang, action.payload?.resources, "-------------")
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchRessources.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        
        .addCase(fetchRessources.fulfilled, (state, action) => {
            
            
            console.log("----------------------------------new data ress--->", action.payload);
                if (action.meta.arg.lang !== state.currentLang) {
                    state.loading = false;
                    return;
                }

                state.loading = false;
                const newRessources = action.payload?.resources || [];

                if (action.payload.featuredInsight) {
                    state.featuredInsight = action.payload.featuredInsight;
                }

                const existingIds = new Set(state.resources.map((src) => src.id));
                const filteredRessources = newRessources.filter(
                    (src) => !existingIds.has(src.id),
                );
                state.resources.push(...filteredRessources);

                state.totalPages = action.payload.pagination?.totalPages;
                state.nextPage = action.payload.pagination?.hasNext;
                state.prevPage = action.payload.pagination?.hasPrev;
                state.itemsPerPage = action.payload.pagination?.limit;
                state.totalItems = action.payload.pagination?.total;
            })


            .addCase(fetchRessources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setRessourcesPage, resetRessources } = ressourcesSlice.actions;
export default ressourcesSlice.reducer;
