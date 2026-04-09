import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projets/projects-list/projectsSlice'
import projectReducer from '../features/projets/project-page/projectSlice'
import projectImagesReducer from '../features/projets/project-gallery/projectImagesSlice'

export const store = configureStore({
    reducer: {
        projects:projectsReducer,
        project:projectReducer,
        projectImages:projectImagesReducer
    },
})