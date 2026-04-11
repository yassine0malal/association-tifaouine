import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProjectsAPI } from "./projectsService";

// async thunk
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ page, filter }) => {
    const data = await fetchProjectsAPI(page, filter);
    return data;
  },
  {
    condition: ({ page, filter }, { getState }) => {
      const { projects } = getState();
      // 🚫 don't fetch if already loading
      if (projects.loading) return false;

      // 🚫 don't fetch same page + same filter again
      // if (projects.currentPage === page && projects.currentFilter === filter) {
      //   return false;
      // }
    },
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    data: [],
    loading: false,
    error: null,
    currentFilter: "All",
    currentPage: null,
    totalPages: null,
    itemsPerPage: 0,
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
        state.data = action.payload.projects || [];

        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.nextPage = action.payload.nextPage;
        state.prevPage = action.payload.prevPage;
        state.itemsPerPage = action.payload.itemsPerPage;
      })

      // error
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage, setFilter } = projectsSlice.actions;
export default projectsSlice.reducer;
