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
import { store }  from './app/store.js';
import About from "./features/public/About.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Main Route: Home */}
          <Route path="/" element={<App />}>
            {/* Default one  */}
            <Route index element={<About/>} />

            {/* Main Route: A propos */}
            <Route path="/about">
              <Route path="nous" element={<About />} />
              <Route path="contact" element={<Footer />} />
            </Route>

            {/* Main Routes : Activites */}
            <Route path="/activites">
              <Route path="projets" element={<Projets />} />
              <Route path="evenements" element={<Footer />} />
              <Route path="actualites" element={<Footer />} />
            </Route>

            {/* Main Routes : Participez */}
            <Route path="/partisipez">
              <Route path="Faire-un-don" element={<Footer />} />
              <Route path="Devenir-membre" element={<Footer />} />
              <Route path="Benevolat" element={<Footer />} />
            </Route>

            {/* Main Routes : Doamaines */}
            <Route path="/domaines">
              <Route path="education" element={<Footer />} />
              <Route path="eau" element={<Footer />} />
              <Route path="agriculture" element={<Footer />} />
            </Route>

            {/* Main Routes : Ressources */}
            <Route path="/ressources">
              <Route path="rapports" element={<Footer />} />
              <Route path="partenaires" element={<Footer />} />
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
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </Provider>,
);
