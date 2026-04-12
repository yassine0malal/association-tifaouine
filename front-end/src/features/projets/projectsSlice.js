import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProjectsAPI } from "./projectsService";

// async thunk
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ page, lang, filter }) => {
    const data = await fetchProjectsAPI(page, filter, lang);
    return data;
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    data: [],
    loading: false,
    error: null,
    currentfilter: 'All',
    currentPage: 1,
    totalPages: 10,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilter: (state, action) => {
      state.currentfilter = action.payload;
      state.currentPage = 1;
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
        state.data = action.payload.projects;
        state.totalPages = action.payload.totalPages;
        console.log("-----", state.data)
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
