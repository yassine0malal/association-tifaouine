import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedApi } from "../Login/authService";

export const fetchDonsAdmin = createAsyncThunk(
  "donsAdmin/fetchAll",
  async ({ page, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/dons?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const updateDonStatus = createAsyncThunk(
  "donsAdmin/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.patch(`/api/dons/${id}/statut`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
    }
  }
);

export const deleteDon = createAsyncThunk(
  "donsAdmin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await protectedApi.delete(`/api/dons/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de suppression");
    }
  }
);

const donsAdminSlice = createSlice({
  name: "donsAdmin",
  initialState: {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: null,
    total: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
        state.totalPages = action.payload?.pagination?.totalPages || 1;
        state.total = action.payload?.pagination?.total || 0;
      })
      .addCase(fetchDonsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDonStatus.fulfilled, (state, action) => {
        const updatedIndex = state.data.findIndex((d) => d.id === action.payload.id);
        if (updatedIndex !== -1) {
          state.data[updatedIndex] = action.payload;
        }
      })
      .addCase(deleteDon.fulfilled, (state, action) => {
        state.data = state.data.filter((d) => d.id !== action.payload);
        if (state.total > 0) state.total -= 1;
      });
  },
});

export const { setPage } = donsAdminSlice.actions;
export default donsAdminSlice.reducer;
