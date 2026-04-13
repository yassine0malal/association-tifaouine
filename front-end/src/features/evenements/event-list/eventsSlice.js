import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchEventsAPI } from "./eventsService";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ page, filter, lang }) => {
    const data = await fetchEventsAPI(page, filter, lang);
    return data;
  },
  {
    condition: ({ page, filter, lang }, { getState }) => {
      const { events } = getState();

      // prevent call when loading
      if (events.loading) return false;

      // prevent call if we call the same page and filter again
      // if (events.currentPage === page && events.currentFilter === filter) {
      //     return false;
      // }
    },
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    data: [],
    loading: false,
    error: null,
    currentFilter: 1,
    currentPage: 1,
    totalPages: 10,
    itemsPerPage: 0,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilter: (state, action) => {
      state.currentFilter = action.payload;
      state.currentPage = 1;
      state.data = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.events || [];

        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.nextPage = action.payload.nextPage;
        state.prevPage = action.payload.prevPage;
        state.itemsPerPage = action.payload.itemsPerPage;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage, setFilter } = eventsSlice.actions;
export default eventsSlice.reducer;
