import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projets/projectsSlice'
import domainsReducer from '../features/domains/domainsSlice'

export const store = configureStore({
    reducer: {
        projects:projectsReducer,
        domains:domainsReducer
    },
})