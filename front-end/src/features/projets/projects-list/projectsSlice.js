import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProjectsAPI, fetchProjectsForSelectAPI } from "./projectsService";

// async thunk
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ page, lang, filter }) => {
    const data = await fetchProjectsAPI(page, filter, lang);
    return data;
  },
  {
    condition: ({ page, lang , filter }, { getState }) => {
      const { projects } = getState();
      // 🚫 don't fetch if already loading
      if (projects.loading) return false;

      // 🚫 don't fetch same page + same filter again
      // if (projects.currentPage === page && projects.currentFilter === filter) {
      //   return false;
      // }

      return true;
    },
  },
);



// async thunk
export const fetchProjectsForSelect = createAsyncThunk(
  "projects/fetchProjectsForSelect",
  async ({ lang }) => {
    const data = await fetchProjectsForSelectAPI(lang);
    return data;
  },
  {
    condition: ({lang}, { getState }) => {
      const { projects } = getState();
      // 🚫 don't fetch if already loading
      if (projects.projectsForSelect.loading) return false;

      // 🚫 don't fetch same page + same filter again
      // if (projects.currentPage === page && projects.currentFilter === filter) {
      //   return false;
      // }

      return true;
    },
  },
);




const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    data: [],
    projectsForSelect:{
      data:[],
      loading:false,
      error:null
    },
    loading: false,
    error: null,
    currentFilter: "all",
    currentPage: 1,
    totalPages: null,
    itemsPerPage: 8,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilter: (state, action) => {
      state.currentFilter = action.payload;
      state.currentPage = 1;
      state.data = []
    },
  },
  extraReducers: (builder) => {
    builder
      // loading
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
        console.log(action.payload);
        
        state.currentPage = action.payload?.pagination?.page;
        state.totalPages = action.payload?.pagination?.totalPages;
        state.nextPage = action.payload?.pagination?.hasNext;
        state.prevPage = action.payload?.pagination?.hasNext;
        state.itemsPerPage = action.payload.itemsPerPage;
      })

      // error
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // loading
      .addCase(fetchProjectsForSelect.pending, (state) => {
        state.projectsForSelect.loading = true;
        state.projectsForSelect.error = null;
      })

      // success
      .addCase(fetchProjectsForSelect.fulfilled, (state, action) => {
        state.projectsForSelect.loading = false;
        state.projectsForSelect.data = action.payload?.projects || ""
      })

      // error
      .addCase(fetchProjectsForSelect.rejected, (state, action) => {
        state.projectsForSelect.loading = false;
        state.projectsForSelect.error = action?.error || "";
      });
  },
});

export const { setPage, setFilter } = projectsSlice.actions;
export default projectsSlice.reducer;
