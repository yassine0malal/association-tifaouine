import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedApi } from "../Login/authService";

export const fetchMembersAdmin = createAsyncThunk(
  "membersAdmin/fetchAll",
  async ({ page, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/membres?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const fetchMemberById = createAsyncThunk(
  "membersAdmin/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await protectedApi.get(`/api/membres/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
    }
  }
);

export const updateMemberStatus = createAsyncThunk(
  "membersAdmin/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.put(`/api/membres/${id}`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
    }
  }
);

export const deleteMember = createAsyncThunk(
  "membersAdmin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await protectedApi.delete(`/api/membres/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur de suppression");
    }
  }
);

export const createMember = createAsyncThunk(
  "membersAdmin/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await protectedApi.post("/api/membres", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la création");
    }
  }
);

const membersAdminSlice = createSlice({
  name: "membersAdmin",
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
      .addCase(fetchMembersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
        state.totalPages = action.payload?.pagination?.totalPages || 1;
        state.total = action.payload?.pagination?.total || 0;
      })
      .addCase(fetchMembersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMemberById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentDetail = action.payload;
      })
      .addCase(fetchMemberById.rejected, (state) => {
        state.detailLoading = false;
      })
      .addCase(updateMemberStatus.fulfilled, (state, action) => {
        const updatedIndex = state.data.findIndex((m) => m.id === action.payload.id);
        if (updatedIndex !== -1) {
          state.data[updatedIndex] = action.payload;
        }
        if (state.currentDetail && state.currentDetail.id === action.payload.id) {
          state.currentDetail = action.payload;
        }
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.data = state.data.filter((m) => m.id !== action.payload);
        if (state.total > 0) state.total -= 1;
      })
      .addCase(createMember.fulfilled, (state) => {
        if (state.total !== null) state.total += 1;
      });
  },
});

export const { setPage, clearCurrentDetail } = membersAdminSlice.actions;
export default membersAdminSlice.reducer;
