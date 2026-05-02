import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminContactAPI, deleteContactAPI } from "./adminContactService";

export const fetchContacts = createAsyncThunk(
  "adminContact/fetchAll",
  async () => {
    return await fetchAdminContactAPI();
  }
);

export const deleteContact = createAsyncThunk(
  "adminContact/delete",
  async (id) => {
    await deleteContactAPI(id);
    return id;
  }
);

const adminContactSlice = createSlice({
  name: "AdminContact",
  initialState: {
    contacts: [], // Changed from {} to [] for listing
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        // Adjust based on your API response structure
        state.contacts = action.payload.contacts || action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete logic
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c.id !== action.payload);
      });
  },
});

export default adminContactSlice.reducer;