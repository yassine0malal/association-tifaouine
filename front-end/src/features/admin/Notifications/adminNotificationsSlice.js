import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchNotificationsAPI,
    getUnreadCountAPI,
    markAsReadAPI,
} from "./adminNotificationService";

// ─── Thunks ────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
    "adminNotifications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchNotificationsAPI();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Erreur de chargement");
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    "adminNotifications/unreadCount",
    async (_, { rejectWithValue }) => {
        try {
            return await getUnreadCountAPI();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Erreur");
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    "adminNotifications/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            await markAsReadAPI(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Erreur de mise à jour");
        }
    }
);

// Mark ALL unread notifications as read by dispatching one request per notification
export const markAllAsRead = createAsyncThunk(
    "adminNotifications/markAllAsRead",
    async (_, { getState, dispatch }) => {
        const { notifications } = getState().adminNotifications;
        const unread = notifications.filter((n) => !n.status);
        await Promise.all(unread.map((n) => dispatch(markNotificationAsRead(n.id))));
    }
);

// ─── Helpers ───────────────────────────────────────────────

const extractNotifications = (payload) => {
    if (Array.isArray(payload?.data))  return payload.data;
    if (Array.isArray(payload))        return payload;
    return [];
};

const extractCount = (payload) => {
    return payload?.data?.unreadCount ?? payload?.unreadCount ?? 0;
};

// ─── Slice ─────────────────────────────────────────────────

const adminNotificationsSlice = createSlice({
    name: "adminNotifications",
    initialState: {
        notifications: [],
        unreadCount:   0,
        loading:       false,
        error:         null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ── FETCH ALL ────────────────────────────────────
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading       = false;
                state.notifications = extractNotifications(action.payload);
                state.unreadCount   = state.notifications.filter((n) => !n.status).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error   = typeof action.payload === "string"
                    ? action.payload
                    : "Erreur de chargement";
            })

            // ── UNREAD COUNT ─────────────────────────────────
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = extractCount(action.payload);
            })

            // ── MARK ONE AS READ ─────────────────────────────
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const n = state.notifications.find((n) => n.id === action.payload);
                if (n) {
                    n.status      = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })

            // ── MARK ALL AS READ (updates handled per markNotificationAsRead) ──
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach((n) => { n.status = true; });
                state.unreadCount = 0;
            });
    },
});

export default adminNotificationsSlice.reducer;