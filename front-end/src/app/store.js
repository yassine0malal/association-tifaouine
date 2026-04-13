import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projets/projects-list/projectsSlice'
import projectReducer from '../features/projets/project-page/projectSlice'
import projectImagesReducer from '../features/projets/project-gallery/projectImagesSlice'
import eventsReducer from '../features/evenements/event-list/eventsSlice'
import eventReducer from '../features/evenements/event-page/eventSlice'
import domainsReducer from '../features/domains/domainsSlice'

export const store = configureStore({
    reducer: {
        projects:projectsReducer,
        project:projectReducer,
        projectImages:projectImagesReducer,
        events:eventsReducer,
        event:eventReducer,
        domains:domainsReducer
    },
})