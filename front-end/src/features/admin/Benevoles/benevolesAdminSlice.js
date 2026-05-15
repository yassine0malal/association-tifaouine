import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedApi } from "../Login/authService";

export const fetchBenevolesAdmin = createAsyncThunk(
  "benevolesAdmin/fetchAll",
  async ({ page, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/benevoles?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const fetchBenevoleById = createAsyncThunk(
  "benevolesAdmin/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/benevoles/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const updateBenevoleStatus = createAsyncThunk(
  "benevolesAdmin/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.put(`/api/benevoles/${id}`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
    }
  }
);

export const deleteBenevole = createAsyncThunk(
  "benevolesAdmin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await protectedApi.delete(`/api/benevoles/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de suppression");
    }
  }
);

const benevolesAdminSlice = createSlice({
  name: "benevolesAdmin",
  initialState: {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: null,
    total: null,
    currentDetail: null,
    detailLoading: false,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentDetail: (state) => {
      state.currentDetail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBenevolesAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBenevolesAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
        state.totalPages = action.payload?.pagination?.totalPages || 1;
        state.total = action.payload?.pagination?.total || 0;
      })
      .addCase(fetchBenevolesAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBenevoleById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchBenevoleById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDetail = action.payload;
      })
      .addCase(fetchBenevoleById.rejected, (state) => {
        state.detailLoading = false;
      })
      .addCase(updateBenevoleStatus.fulfilled, (state, action) => {
        const updatedIndex = state.data.findIndex((b) => b.id === action.payload.id);
        if (updatedIndex !== -1) {
          state.data[updatedIndex] = action.payload;
        }
        if (state.currentDetail && state.currentDetail.id === action.payload.id) {
          state.currentDetail = action.payload;
        }
      })
      .addCase(deleteBenevole.fulfilled, (state, action) => {
        state.data = state.data.filter((b) => b.id !== action.payload);
        if (state.total > 0) state.total -= 1;
      });
  },
});

export const { setPage, clearCurrentDetail } = benevolesAdminSlice.actions;
export default benevolesAdminSlice.reducer;
