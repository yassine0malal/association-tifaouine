import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedApi } from "../Login/authService";

export const fetchEventsAdmin = createAsyncThunk(
  "eventsAdmin/fetchAll",
  async ({ page, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/evenements/admin/all?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const fetchEventComplet = createAsyncThunk(
  "eventsAdmin/fetchComplet",
  async (id, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/evenements/admin/complet/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const createEventComplet = createAsyncThunk(
  "eventsAdmin/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await protectedApi.post("/api/evenements/complet", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de création");
    }
  }
);

export const updateEventComplet = createAsyncThunk(
  "eventsAdmin/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.put(`/api/evenements/complet/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "eventsAdmin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await protectedApi.delete(`/api/evenements/complet/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de suppression");
    }
  }
);

const eventsAdminSlice = createSlice({
  name: "eventsAdmin",
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
      .addCase(fetchEventsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
        state.totalPages = action.payload?.pagination?.totalPages || 1;
        state.total = action.payload?.pagination?.total || 0;
      })
      .addCase(fetchEventsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventComplet.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchEventComplet.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDetail = action.payload;
      })
      .addCase(fetchEventComplet.rejected, (state) => {
        state.detailLoading = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.data = state.data.filter((e) => e.id !== action.payload);
        if (state.total > 0) state.total -= 1;
      });
  },
});

export const { setPage, clearCurrentDetail } = eventsAdminSlice.actions;
export default eventsAdminSlice.reducer;
