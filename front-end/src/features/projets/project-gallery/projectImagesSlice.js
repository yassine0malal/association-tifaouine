import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectImagesAPI } from "./projectImagesService";

export const fetchProjectImages = createAsyncThunk(
  "projectImages/fetchProjectImages",
  async ({ project, page , lang }) => {
    const data = await projectImagesAPI(project, page , lang);
    return data;
  },
  {
    condition:({ project, page , lang } , {getState}) => {
      const { projectImages } = getState();
      if(projectImages.loading) return false;
    }
  }
);

const projectImagesSlice = createSlice({
  name: "projectImages",
  initialState: {
    images: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    nextPage: 2,
    prevPage: 0,
    itemsPerPage: 0,
  },
  reducers: {
    setImagesPage: (state, action) => {
      state.currentPage = action.payload.page;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProjectImages.fulfilled, (state, action) => {

        state.loading = false;
        const newImages = action.payload?.images || [];
        console.log("new images--->",action.payload);
        

        // Remove duplicates based on id
        const existingIds = new Set(state.images.map((img) => img.id));

        const filteredImages = newImages.filter(
          (img) => !existingIds.has(img.id),
        );
        state.images.push(...filteredImages);
        state.totalPages = action.payload.totalPages;
        state.nextPage = action.payload.nextPage;
        state.prevPage = action.payload.prevPage;
        state.itemsPerPage = action.payload.itemsPerPage;
      })

      .addCase(fetchProjectImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { setImagesPage } = projectImagesSlice.actions;
export default projectImagesSlice.reducer;
