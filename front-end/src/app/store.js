import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projets/projects-list/projectsSlice'
import projectReducer from '../features/projets/project-page/projectSlice'
import projectImagesReducer from '../features/projets/project-gallery/projectImagesSlice'
import ressourceReducer from '../features/ressources/ressourcesSlice'
import eventsReducer from '../features/evenements/event-list/eventsSlice'
import eventReducer from '../features/evenements/event-page/eventSlice'
import domainsReducer from '../features/domains/domainsSlice'
import domainsPageReducer from '../features/domains/domainsPage/domainsPageSlice'
import partnersReducer from '../features/partners/partnersSlice'
import authAdmin from '../features/admin/Login/authSlice'

export const store = configureStore({
    reducer: {
        projects: projectsReducer,
        project: projectReducer,
        projectImages: projectImagesReducer,
        ressources: ressourceReducer,
        events: eventsReducer,
        event: eventReducer,
        domains: domainsReducer,
        domainsPage: domainsPageReducer,
        partners: partnersReducer,
        auth: authAdmin,
    },
})