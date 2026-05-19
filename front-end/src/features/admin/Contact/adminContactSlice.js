import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    fetchAdminContactAPI, 
    deleteContactAPI, 
    updateContactStatusAPI 
} from "./adminContactService";

export const fetchContacts = createAsyncThunk(
    "adminContact/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAdminContactAPI();
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de chargement");
        }
    }
);

export const deleteContact = createAsyncThunk(
    "adminContact/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteContactAPI(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de suppression");
        }
    }
);

export const toggleContactStatus = createAsyncThunk(
    "contacts/toggleStatus",
    async ({ id, lu }, { rejectWithValue }) => {
        try {
            // On envoie l'inverse de l'état actuel au serveur
            const newStatus = !lu;
            await updateContactStatusAPI(id, newStatus);
            return { id, lu: newStatus };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur de mise à jour");
        }
    }
);

const adminContactSlice = createSlice({
    name: "AdminContact",
    initialState: {
        contacts: [], 
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                // Sécurité : on prend .rows si Sequelize findAndCountAll est utilisé, 
                // sinon on prend le payload direct, sinon un tableau vide.
                state.contacts = action.payload.data || action.payload || [];
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // DELETE
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.contacts = state.contacts.filter(c => c.id !== action.payload);
            })

            // TOGGLE STATUS (Lu / Non lu)
            .addCase(toggleContactStatus.fulfilled, (state, action) => {
                const index = state.contacts.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.contacts[index].lu = action.payload.lu;
                }
            })
            .addCase(toggleContactStatus.rejected, (state, action) => {
                // Optionnel : On peut stocker l'erreur spécifique ici
                console.error("Échec du changement de statut:", action.payload);
            });
    },
});

export default adminContactSlice.reducer;