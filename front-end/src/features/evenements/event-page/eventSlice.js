import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchEventAPI } from "./eventService";

export const fetchEvent = createAsyncThunk(
  "event/fetchEvent",
  async ({ id , lang }) => {
    const data = await fetchEventAPI(id , lang);    
    return data
  },
  {
    condition: ({ id , lang }, { getState }) => {
      const { event } = getState();

      // prevent call when loading
      if (event.loading) return false;
      // prevent call if we call the same page and filter again
      // if (events.currentPage === page && events.currentFilter === filter) {
      //     return false;
      // }
    },
  },
);


const eventSlice = createSlice({
    name:"event",
    initialState:{
        data:{},
        loading:false,
        error:null
    },
    reducers:{}
    ,
    extraReducers:(builder) => {
        builder
        .addCase(fetchEvent.pending , (state) => {
            
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEvent.fulfilled , (state , action) => {
            state.loading = false;
            state.data = action.payload?.data || {}
        })
        .addCase(fetchEvent.rejected , (state , action) => {
            state.loading = false;
            state.error = action.error;
        })
    }

})


export default eventSlice.reducer