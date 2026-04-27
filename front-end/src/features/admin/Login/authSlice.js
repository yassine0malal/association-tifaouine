import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    loginAdminApi,
    refreshTokenApi,
    logoutAdminApi,
    getProfileApi,
} from './authService';

export const loginAdmin = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await loginAdminApi(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

// Thunk to restore session using refresh token (on app load)
export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, { rejectWithValue }) => {
        try {
            // 1. Get new access token
            const { accessToken } = await refreshTokenApi();
            // 2. Fetch user profile
            const { user } = await getProfileApi();
            return { user };
        } catch (error) {
            return rejectWithValue("Session expired");
        }
    }
);

//logout
export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
    await logoutAdminApi();
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        initialized: false,
        forceLoggedOut: false,
    },
    reducers: {
        resetAuthError: (state) => {
            state.error = null;
        },
        markForceLoggedOut: (state) => {
            state.forceLoggedOut = true;
        },
        // Reset the flag when we start a new login or restore
        resetForceLoggedOut: (state) => {
            state.forceLoggedOut = false;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.forceLoggedOut = false;

            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                // Store token in memory
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.forceLoggedOut = false;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Restore session------------
            .addCase(restoreSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.initialized = true; // Set to true here
            })
            .addCase(restoreSession.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.initialized = true; // Set to true even if it fails
            })
            // Logout------------
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutAdmin.rejected, (state) => {
                // Even if the server call fails, we still log out the user locally
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    },

})

export const { resetAuthError, markForceLoggedOut, resetForceLoggedOut } = authSlice.actions;
export default authSlice.reducer;