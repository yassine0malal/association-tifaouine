import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedApi } from "../Login/authService";

export const fetchAdminProfile = createAsyncThunk(
  "profileAdmin/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get("/api/auth/profile");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement du profil");
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "profileAdmin/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await protectedApi.put("/api/auth/profile", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour du profil");
    }
  }
);

const profileAdminSlice = createSlice({
  name: "profileAdmin",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileAdminSlice.reducer;
