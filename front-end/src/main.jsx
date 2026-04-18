import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/variables.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import MemberForm from "./components/forms/MemberForm.jsx";
import Footer from "./components/Layout/Footer/Footer.jsx";
import Projets from "./features/projets/projects-list/ProjetList.jsx";
import AdminLogin from "./features/admin/AdminLogin.jsx";
import ProjectCard from "./components/common/ProjectCard.jsx";
import Pagination from "./components/common/Pagination.jsx";
import ProjectPage from "./features/projets/project-page/ProjetDetail.jsx";
import ProjectCardSkeleton from "./components/common/ProjectCardSkeleton.jsx";
import { Provider } from "react-redux";
import { store } from './app/store.js';
import About from "./features/public/About.jsx";
import Contact from "./features/public/Contact.jsx";
import Home from "./features/public/Accueil.jsx";

import "./i18n";
import RessourcesPage from "./features/ressources/Ressources.jsx";
import EventList from "./features/evenements/event-list/EventList.jsx";
import './styles/globals.css'
import EventPage from "./features/evenements/event-page/EventPage.jsx";
import Partner from "./features/partners/Partner.jsx";
// import Domaines from "./features/domains/Domain.jsx";
import Domain from "./features/domains/domainsPage/Domain.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Main Route: Home */}
          <Route path="/" element={<App />}>
            {/* Default one  */}
            <Route index element={<Home />} />

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
              <Route path="Faire-un-don" element={<Footer />} />
              <Route path="Devenir-membre" element={<Footer />} />
              <Route path="Benevolat" element={<Footer />} />
            </Route>

            {/* Main Routes : Domaines */}
            <Route path="/:lang/domains">
              <Route index  element={<Domain />} />
              <Route path=":id" element={<Domain />} />
            </Route>

            {/* Main Routes : Ressources */}
            <Route path="/:lang/domains">
              <Route path="rapports" element={<RessourcesPage />} />
              <Route path="partenaires" element={<Partner />} />
            </Route>
          </Route>

          {/* test routes */}
          <Route path="/AdminLogin" element={<AdminLogin />} />
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
