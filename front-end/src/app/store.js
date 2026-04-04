import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projets/projectsSlice'

export const store = configureStore({
    reducer: {
        projects:projectsReducer
    },
})