import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projets/projects-list/projectsSlice'
import projectsAdminReducer from '../features/admin/Projets/projectsSlice'
import projectSliceSingleAdminReducer from '../features/admin/Projets/SingleProject/projectSliceAdmin'
import contactsReducer from '../features/admin/Contact/adminContactSlice'
import projectReducer from '../features/projets/project-page/projectSlice'
import projectImagesReducer from '../features/projets/project-gallery/projectImagesSlice'
import ressourceReducer from '../features/ressources/ressourcesSlice'
import membres from '../features/public/about/membresSlice'
import partenaires from '../features/public/about/partnerSlice'
import adminPartnerSlice from '../features/admin/Partenaires/adminPartnerSlice'
import adminResourceSlice from '../features/admin/Ressources/adminResourceSlice'
import adminAbonnementReducer from '../features/admin/subscription/SubscriptionAdminSlice'
import adminNotificationsReducer from '../features/admin/Notifications/adminNotificationsSlice'
import dashboardReducer from '../features/admin/Dashboard/dashboardSlice'

import eventsReducer from '../features/evenements/event-list/eventsSlice'
import eventReducer from '../features/evenements/event-page/eventSlice'
import domainsReducer from '../features/domains/domainsSlice'
import domainsPageReducer from '../features/domains/domainsPage/domainsPageSlice'
import partnersReducer from '../features/partners/partnersSlice'
import authAdmin from '../features/admin/Login/authSlice'

export const store = configureStore({
    reducer: {
        projects: projectsReducer,
        projectsAdmin: projectsAdminReducer,
        project: projectReducer,
        projectImages: projectImagesReducer,
        ressources: ressourceReducer,
        events: eventsReducer,
        event: eventReducer,
        domains: domainsReducer,
        domainsPage: domainsPageReducer,
        partners: partnersReducer,
        auth: authAdmin,
        membres: membres,
        partenaires: partenaires,
        singleProject: projectSliceSingleAdminReducer,
        contacts: contactsReducer,
        adminPartner: adminPartnerSlice,
        adminResources: adminResourceSlice,
        adminSubscription: adminAbonnementReducer,
        adminNotifications: adminNotificationsReducer,
        dashboard: dashboardReducer
    },
})