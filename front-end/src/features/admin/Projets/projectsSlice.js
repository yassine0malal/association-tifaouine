import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProjectsAdminAPI } from "./projectsService";

// async thunk
export const fetchProjectsAdmin = createAsyncThunk(
  "projects/fetchProjectsAdminAdmin",
  async ({ page, lang, filter }) => {
    const data = await fetchProjectsAdminAPI(page, filter, lang);
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
  name: "projectsAdmin",
  initialState: {
    data: [],
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
      .addCase(fetchProjectsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success
      .addCase(fetchProjectsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
console.log(action.payload)
// debugger;
        // state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.nextPage = action.payload.pagination.nextPage;
        state.prevPage = action.payload.pagination.prevPage;
        state.itemsPerPage = action.payload.pagination.itemsPerPage;
      })

      // error
      .addCase(fetchProjectsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage, setFilter } = projectsSlice.actions;
export default projectsSlice.reducer;
