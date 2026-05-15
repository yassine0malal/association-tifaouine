import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedApi } from "../Login/authService";

export const fetchDomainesAdmin = createAsyncThunk(
  "domainesAdmin/fetchAll",
  async ({ page, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/domaines/admin/all?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const createDomaineAdmin = createAsyncThunk(
  "domainesAdmin/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await protectedApi.post("/api/domaines/admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de création");
    }
  }
);

export const updateDomaineAdmin = createAsyncThunk(
  "domainesAdmin/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.put(`/api/domaines/admin/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
    }
  }
);

export const deleteDomaineAdmin = createAsyncThunk(
  "domainesAdmin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await protectedApi.delete(`/api/domaines/admin/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de suppression");
    }
  }
);

const domainesAdminSlice = createSlice({
  name: "domainesAdmin",
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
      .addCase(fetchDomainesAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomainesAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
        state.totalPages = action.payload?.pagination?.totalPages || 1;
        state.total = action.payload?.pagination?.total || 0;
      })
      .addCase(fetchDomainesAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDomaineAdmin.fulfilled, (state, action) => {
        state.data = state.data.filter((d) => d.id !== action.payload);
        if (state.total > 0) state.total -= 1;
      });
  },
});

export const { setPage } = domainesAdminSlice.actions;
export default domainesAdminSlice.reducer;
