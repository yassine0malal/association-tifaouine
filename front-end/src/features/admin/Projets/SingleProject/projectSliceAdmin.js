import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProjectSingleAdminAPI } from "./projectServiceAdmin";

export const fetchProject = createAsyncThunk(
  "project/fetchProjectSingleAdminAPI",
  async ({ id, lang }) => {
    const data = await fetchProjectSingleAdminAPI(id, lang);
    return data;
  }
);

const projectSliceSingleAdmin = createSlice({
  name: "projectSingleAdmin",
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
        console.log("from slice single ==> ", action.payload);
        state.loading = false;
        state.data = action.payload.data;
      })

      // error
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default projectSliceSingleAdmin.reducer;
