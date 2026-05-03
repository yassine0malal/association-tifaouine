import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import './styles/globals.css'
import "./styles/variables.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import MemberForm from "./components/forms/MemberForm.jsx";
import Footer from "./components/Layout/Footer/Footer.jsx";
import Projets from "./features/projets/projects-list/ProjetList.jsx";
import AdminLogin from "./features/admin/Login/AdminLogin.jsx";
import ProjectCard from "./components/common/ProjectCard.jsx";
import Pagination from "./components/common/Pagination.jsx";
import ProjectPage from "./features/projets/project-page/ProjetDetail.jsx";
import ProjectCardSkeleton from "./components/common/ProjectCardSkeleton.jsx";
import { Provider } from "react-redux";
import { store } from './app/store.js';
import About from "./features/public/about/About.jsx";
import Contact from "./features/public/contact/Contact.jsx";
import Home from "./features/public/home/Home.jsx";
import EventPage from "./features/evenements/event-page/EventPage.jsx";
import JoinUsPage from "./features/benevolat/JoinUsPage.jsx";
import Partner from "./features/partners/Partner.jsx";
import Domain from "./features/domains/domainsPage/Domain.jsx";
import DonationPage from "./features/dons/DonationPage.jsx";
import RessourcesPage from "./features/ressources/Ressources.jsx";
import EventList from "./features/evenements/event-list/EventList.jsx";

import { ProtectedRoute } from "./components/common/admin/ProtectedRoute.jsx";
import AdminDashboard from "./features/admin/Dashboard/AdminDashboard.jsx";
import { GuestRoute } from "./components/common/admin/GuestRoute.jsx";
import AdminLayout from "./features/admin/AdminLayout/AdminLayout.jsx";
import AdminProjetsList from "./features/admin/Projets/AdminProjetsList.jsx";
import AdminProjetEdit from "./features/admin/Projets/SingleProject/AdminProjetEdit.jsx";
import AdminProjetCreate from "./features/admin/Projets/AdminProjetCreate.jsx";
import AdminMessagesList from "./features/admin/Contact/AdminContactsList.jsx";
import AdminMessageDetail from "./features/admin/Contact/AdminMessagesDetail.jsx";
import AdminEventsList from "./features/admin/Evenements/AdminEventsList.jsx";
import AdminEventCreate from "./features/admin/Evenements/AdminEventCreate.jsx";
import AdminEventEdit from "./features/admin/Evenements/AdminEventEdit.jsx";
import AdminRessourcesList from "./features/admin/Ressources/AdminRessourcesList.jsx";
import AdminResourceAdd from "./features/admin/Ressources/AdminResourceAdd.jsx";
import AdminResourceEdit from "./features/admin/Ressources/AdminResourceEdit.jsx";
import AdminPartenairesList from "./features/admin/Partenaires/AdminPartnerList.jsx";
import AdminPartenaireCreate from "./features/admin/Partenaires/AdminPartnerCreate.jsx";
import AdminPartenaireEdit from "./features/admin/Partenaires/AdminPartnerEdit.jsx";
import AdminDomainesList from "./features/admin/Domaines/AdminDomainesList.jsx";
import AdminDomaineCreate from "./features/admin/Domaines/AdminDomaineCreate.jsx";
import AdminDomaineEdit from "./features/admin/Domaines/AdminDomaineEdit.jsx";
import AdminBenevolesList from "./features/admin/Benevoles/AdminBenevolesList.jsx";
import AdminBenevoleDetail from "./features/admin/Benevoles/AdminBenevoleDetail.jsx";
import AdminDonsList from "./features/admin/Dons/AdminDonsList.jsx";
import AdminDonDetail from "./features/admin/Dons/AdminDonDetail.jsx";
import AdminMembersList from "./features/admin/Members/AdminMembersList.jsx";
import AdminProjetDetail from "./features/admin/Projets/SingleProject/AdminProjetDetail.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Main Route: Home */}
          <Route path="/" element={<App />}>
            {/* Default one  */}
            <Route path="/:lang" index element={<Home />} />

            {/* Redirect / vers /fr par défaut */}
            <Route index element={<Navigate to="/fr" replace />} />

            {/* Main Route: A propos */}
            <Route path="/:lang">
              <Route path="nous" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Main Routes : Activites */}
            <Route path="/:lang">
              <Route path="projets" element={<Projets />} />
              <Route path="evenements" element={<EventList />} />
              <Route path="actualites" element={<Footer />} />
            </Route>

            {/* Main Routes : Participez */}
            <Route path="/:lang">
              <Route path="donate" element={<DonationPage />} />
              <Route path="join-us" element={<JoinUsPage />} />
              <Route path="join-us/:contributor" element={<JoinUsPage />} />
            </Route>

            {/* Main Routes : Domaines */}
            <Route path="/:lang/domains">
              <Route index element={<Domain />} />
              <Route path=":id" element={<Domain />} />
            </Route>

            {/* Main Routes : Ressources */}
            <Route path="/:lang">
              <Route path="rapports" element={<RessourcesPage />} />
              <Route path="partenaires" element={<Partner />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/adminLogin" element={<AdminLogin />} />
          </Route>


          {/* the details of the admin routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>

              {/* Dashboard */}
              <Route index element={<AdminDashboard />} />

              {/* Projets */}
              <Route path="projets" element={<AdminProjetsList />} />
              <Route path="projets/create" element={<AdminProjetCreate />} />
              <Route path="projets/:id" element={<AdminProjetDetail />} />
              <Route path="projets/:id/edit" element={<AdminProjetEdit />} />

              {/* Evenements */}
              <Route path="evenements" element={<AdminEventsList />} />
              <Route path="evenements/create" element={<AdminEventCreate />} />
              <Route path="evenements/:id/edit" element={<AdminEventEdit />} />

              {/* Ressources / Rapports */}
              <Route path="ressources" element={<AdminRessourcesList />} />
              <Route path="ressources/create" element={<AdminResourceAdd />} />
              <Route path="ressources/edit/:id" element={<AdminResourceEdit />} />

              {/* Partenaires */}
              <Route path="partenaires" element={<AdminPartenairesList />} />
              <Route path="partenaires/create" element={<AdminPartenaireCreate />} />
              <Route path="partenaires/edit/:id" element={<AdminPartenaireEdit />} />

              {/* Domaines */}
              <Route path="domaines" element={<AdminDomainesList />} />
              <Route path="domaines/create" element={<AdminDomaineCreate />} />
              <Route path="domaines/:id/edit" element={<AdminDomaineEdit />} />

              {/* Benevolat / Join Us */}
              <Route path="benevoles" element={<AdminBenevolesList />} />
              <Route path="benevoles/:id" element={<AdminBenevoleDetail />} />

              {/* Members*/}
              <Route path="membre" element={<AdminMembersList />} />
              {/* <Route path="membre/:id" element={<AdminBenevoleDetail />} /> */}

              {/* Dons */}
              <Route path="dons" element={<AdminDonsList />} />
              <Route path="dons/:id" element={<AdminDonDetail />} />

              {/* Contact (messages reçus) */}
              <Route path="messages" element={<AdminMessagesList />} />
              <Route path="messages/:id" element={<AdminMessageDetail />} />

            </Route>
          </Route>




          {/* test routes */}
          <Route path="/projectCard" element={<ProjectCard />} />
          <Route path="/projects" element={<Projets />} />
          <Route path="/pagination" element={<Pagination />} />
          <Route path="/project-page" element={<ProjectPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/skelton" element={<ProjectCardSkeleton />} />
          <Route path="/evenement/:id" element={<EventPage />} />
        </Routes>

      </BrowserRouter>
    </StrictMode>
  </Provider>,
);
