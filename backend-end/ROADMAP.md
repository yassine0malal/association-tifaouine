# 🗺️ Roadmap Architecture - Backend Site Web Association Tifaouine (V2.0)

> Ce document intègre les spécifications du Cahier des Charges (Version 1.0 - Mars 2026), de l'architecture UML et de l'état d'avancement actuel du code (Implémentation par couche).

---

## 🎯 1. Contexte & Architecture Globale
- **Projet :** Site web institutionnel bilingue (Arabe / Français) de l'Association Tifaouine.
- **Objectif du Backend :** Fournir une API REST robuste consommée par un frontend React SPA.
- **Stack Définie :** `Node.js (v20)` + `Express.js (v4)` + `PostgreSQL (v15+)`.
- **ORM & Structure :** `Sequelize (v6)` avec architecture 4 couches : `Routes ➡️ Controllers ➡️ Services ➡️ Repositories ➡️ Models`.
- **Sécurité :** Authentification `JWT` (pour le Back-Office Administration), validation `express-validator`, mots de passe hachés avec `bcryptjs`.

---

## 🏗️ 2. État d'avancement du Backend (Réalisé par l'équipe)
L'équipe a déjà mis en place une structure solide qui correspond parfaitement au diagramme de classes (Couches 1 à 4) fourni dans le CDC.

✅ **Couche 1 (Utilisateurs) :** Modèles `Utilisateur` (Abstract), `Admin`, `Membre`, `Benevole` créés avec relations `hasOne`. Logique d'authentification complète existante.
✅ **Couche 2 (Contenu Métier) :** Modèles `Domaine`, `Projet`, `Evenement`, `Ressource` créés. Composition `Domaine -> Projet (1..*)` et Agrégation `Projet -> Evenement (0..1 -> *)` implémentées dans `models/index.js`.
✅ **Couche 3 & 4 (Dons & Support) :** Modèles `Don`, `DonFinancier`, `DonMateriel`, `Partenariat`, `MessageContact`, `Stat` implémentés et reliés (`Utilisateur -> Don`, `Don -> Projet`).

---

## 🚀 3. Feuille de Route pour le Développement Restant (Sprint 2 & 3)

Puisque les **Modèles (Database)** existent déjà avec leurs relations exactes issues du diagramme UML, la mission actuelle est de développer les couches d'accès aux données, la logique métier, et les points de terminaison (Endpoints) spécifiés dans le CDC.

### 🧩 3.1. Implémentation du Module `Domaine`
> *Lien CDC : Les domaines portent les thématiques (Eau Potable, Agriculture, Social, etc.).*
- [ ] **Repository :** `src/repositories/domaine.repository.js` (Lister tous les domaines pour le menu de navigation frontend).
- [ ] **Service :** `src/services/domaine.service.js`.
- [ ] **Controller :** `src/controllers/domaine.controller.js`.
- [ ] **Routes :** `src/routes/domaines.routes.js`.
  - Endpoint Publique : `GET /api/domaines`
  - Endpoints Admin (JWT) : `POST`, `PUT`, `DELETE /api/admin/domaines/:id`

### 🏗️ 3.2. Implémentation du Module `Projet`
> *Lien CDC (BF-04) : Fiches détaillées des projets reliés aux domaines, avec nb_beneficiaires, dates, statut.*
- [ ] **Repository :** `src/repositories/projet.repository.js` (Doit inclure une fonction pour filtrer par `domaine_id` et par `année`).
- [ ] **Service :** `src/services/projet.service.js`.
- [ ] **Controller :** `src/controllers/projet.controller.js`.
- [ ] **Routes :** `src/routes/projets.routes.js`.
  - Endpoints Publiques : `GET /api/projets` (liste filtrable), `GET /api/projets/:id`.
  - Endpoints Admin (JWT) : `POST`, `PUT`, `DELETE /api/admin/projets/:id`.

### 📅 3.3. Implémentation du Module `Evenement`
> *Lien CDC : Les événements rattachés aux projets.*
- [ ] Créer la boucle complète (Repository, Service, Controller, Route) pour `Evenement`.
- [ ] **Valider** dans le Service que la date de l'événement est cohérente avec les dates de début et fin du Projet lié.

### 💰 3.4. Flux Complexes (Diagramme de Séquence `Dons`)
> *Lien CDC (UC-06) : Gestion asynchrone / synchrone des dons (Financiers et Matériels).*
- [ ] **Controller Dons :** `src/controllers/don.controller.js`.
- [ ] **Endpoints :**
  - `POST /api/dons/financier` : Création de DonFinancier (statut: `recu`), nécessite logique synchrone de paiement PayPal/Stripe.
  - `POST /api/dons/materiel` : Création de DonMateriel (statut: `en_attente`), suivi d'un envoi asynchrone de notification à l'Admin (via `Nodemailer`).
  - `PATCH /api/admin/dons/materiel/:id/valider` : Validation par l'Admin.
  - `PATCH /api/admin/dons/materiel/:id/refuser` : Refus par l'Admin.
- [ ] **Mise à jour des stats :** Lors de la validation d'un don, mettre à jour le modèle `Stat` (Compteur d'impact).

### 📞 3.5. Transversales (Contact & Stats)
> *Lien CDC : Besoins transversaux pour l'accueil.*
- [ ] **Forms :** `POST /api/contact` implémenter le service avec `Nodemailer` pour l'envoi de mail.
- [ ] **Stats :** `GET /api/stats` (Récupération des statistiques d'impact pour les compteurs animés de la page d'accueil BF-01).

---

## 🔒 4. Validations et Sécurité (Exigences Non-Fonctionnelles)
> *Lien CDC : Exigences 3.3 / 4.7*
- [ ] Implémenter les Middlewares avec `express-validator` sur toutes les routes `POST`/`PUT` pour contrer les failles XSS / SQL Injections.
- [ ] Vérifier que `helmet` et `express-rate-limit` sont intégrés dans le point d'entrée (`server.js` ou `app.js`).
- [ ] Isoler toutes les routes commençant par `/api/admin/*` derrière un Middleware vérifiant la validité du Token `JWT`.

---
*Ce document sert de référence technique pour l'alignement entre le code et le diagramme UML du projet Tifaouine.*
