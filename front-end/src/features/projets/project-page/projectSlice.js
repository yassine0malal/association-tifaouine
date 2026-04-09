import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProjectAPI } from "./projectService";

export const fetchProject = createAsyncThunk(
  "project/fetchProject",
  async (project) => {
    const data = await fetchProjectAPI(project);
    return data;
  },
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: {},
    loading: true,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // loading
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      // error
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
