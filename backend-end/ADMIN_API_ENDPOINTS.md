# Admin API — Endpoints POST (Création)

> Tous les endpoints admin nécessitent un header d'authentification :
> `Authorization: Bearer <token>`
>
> Base URL : `/api`

---

## 🔐 Authentification

### Login
```
POST /api/auth/login
Content-Type: application/json
```
```json
{
  "email": "admin@example.com",
  "password": "motdepasse"
}
```

---

## 📁 Domaines

```
POST /api/domaines
Content-Type: multipart/form-data
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `nom_fr` | string | ✅ | Nom en français |
| `nom_ar` | string | ✅ | Nom en arabe |
| `nom_en` | string | ✅ | Nom en anglais |
| `desc_fr` | string | ❌ | Description FR |
| `desc_ar` | string | ❌ | Description AR |
| `desc_en` | string | ❌ | Description EN |
| `icone` | file | ❌ | Image de l'icône |

---

## 🤝 Partenariats

```
POST /api/partenariats
Content-Type: multipart/form-data
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `nom_fr` | string | ✅ | Nom en français |
| `nom_ar` | string | ✅ | Nom en arabe |
| `nom_en` | string | ✅ | Nom en anglais |
| `description_fr` | string | ✅ | Description FR |
| `description_ar` | string | ✅ | Description AR |
| `description_en` | string | ✅ | Description EN |
| `logo` | file | ❌ | Logo du partenaire |
| `site_web` | string (url) | ❌ | Site web |

---

## 🏗️ Projets

```
POST /api/projets
Content-Type: multipart/form-data
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `domaine_id` | integer | ✅ | ID du domaine |
| `titre_fr` | string | ✅ | Titre en français |
| `titre_ar` | string | ✅ | Titre en arabe |
| `titre_en` | string | ✅ | Titre en anglais |
| `statut` | string | ✅ | `planifie` / `en_cours` / `termine` / `suspendu` |
| `budget` | number | ✅ | Budget du projet |
| `description_fr` | string | ❌ | Description FR |
| `description_ar` | string | ❌ | Description AR |
| `description_en` | string | ❌ | Description EN |
| `localisation` | string | ❌ | Localisation |
| `nb_beneficiaires` | integer | ❌ | Nombre de bénéficiaires |
| `date_debut` | date (ISO) | ❌ | Date de début |
| `date_fin` | date (ISO) | ❌ | Date de fin (> date_debut) |
| `partenariat_ids` | integer[] | ❌ | IDs des partenaires liés |
| `image_principale` | file | ❌ | Image principale |

---

## 📅 Événements

```
POST /api/evenements
Content-Type: application/json
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `domaine_id` | integer | ✅ | ID du domaine |
| `titre_fr` | string | ✅ | Titre en français |
| `titre_ar` | string | ✅ | Titre en arabe |
| `titre_en` | string | ✅ | Titre en anglais |
| `date_debut` | date (ISO) | ✅ | Date de début |
| `projet_id` | integer | ❌ | ID du projet lié |
| `date_fin` | date (ISO) | ❌ | Date de fin (> date_debut) |
| `lieu` | string | ❌ | Lieu de l'événement |
| `description_fr` | string | ❌ | Description FR |
| `description_ar` | string | ❌ | Description AR |
| `description_en` | string | ❌ | Description EN |
| `partenariat_ids` | integer[] | ❌ | IDs des partenaires liés |

---

## 👤 Membres

```
POST /api/membres
Content-Type: multipart/form-data
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `nom` | string | ✅ | Nom complet |
| `email` | string | ✅ | Email |
| `status` | string | ✅ | `actif` / `inactif` / `suspendu` |
| `poste` | string | ❌ | Poste occupé |
| `photo_profile` | file | ❌ | Photo de profil |

---

## 🙋 Bénévoles

```
POST /api/benevoles
Content-Type: multipart/form-data
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `nom` | string | ✅ | Nom complet |
| `email` | string | ✅ | Email |
| `status` | string | ✅ | `actif` / `inactif` / `suspendu` |
| `mession` | string | ❌ | Mission du bénévole |
| `disponibilite` | string | ❌ | Disponibilité |
| `photo_profile` | file | ❌ | Photo de profil |

---

## 📎 Ressources (Photos / Vidéos / Documents)

```
POST /api/ressources
Content-Type: multipart/form-data
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `type` | string | ✅ | `photo` / `video` / `rapport` / `guide` / `document` |
| `projet_id` | integer | ❌ | ID du projet lié |
| `evenement_id` | integer | ❌ | ID de l'événement lié |
| `titre_fr` | string | ❌ | Titre FR |
| `titre_ar` | string | ❌ | Titre AR |
| `titre_en` | string | ❌ | Titre EN |
| `description_fr` | string | ❌ | Description FR |
| `description_ar` | string | ❌ | Description AR |
| `description_en` | string | ❌ | Description EN |
| `is_featured` | boolean | ❌ | Mettre en avant (défaut: false) |
| `file` | file | ✅ | Fichier à uploader |

---

## 💰 Dons

### Don Financier (Public)
```
POST /api/dons/financier
Content-Type: application/json
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `email` | string | ✅ | Email du donateur |
| `nom_complet` | string | ✅ | Nom complet |
| `montant` | number | ✅ | Montant du don |
| `type_destination` | string | ✅ | `general` / `specifique` |
| `projet_id` | integer | ✅ si `specifique` | ID du projet ciblé |
| `telephone` | string | ❌ | Téléphone |
| `devise` | string | ❌ | Devise (défaut: `MAD`) |
| `ref_transaction` | string | ❌ | Référence de transaction |

### Don Matériel (Admin)
```
POST /api/dons/materiel
Content-Type: application/json
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `email` | string | ✅ | Email du donateur |
| `nom_complet` | string | ✅ | Nom complet |
| `description` | string | ✅ | Description du don |
| `type_destination` | string | ✅ | `general` / `specifique` |
| `projet_id` | integer | ✅ si `specifique` | ID du projet ciblé |
| `telephone` | string | ❌ | Téléphone |
| `quantite` | integer | ❌ | Quantité (défaut: 1) |
| `date_decision` | date (ISO) | ❌ | Date de décision |

---

## 📊 Statistiques

### Créer une stat manuelle
```
POST /api/stats
Content-Type: application/json
```
> Voir le modèle Stat pour les champs exacts.

### Synchroniser les stats depuis la base
```
POST /api/stats/sync
```
> Aucun body requis. Recalcule toutes les statistiques dynamiquement.

---

## 📬 Messages de contact (Public)

```
POST /api/messages
Content-Type: application/json
```
| Champ | Type | Requis | Description |
|---|---|---|---|
| `nom_complet` | string | ✅ | Nom complet |
| `email` | string | ✅ | Email |
| `objet` | string | ✅ | `DEMANDE_PARTENARIAT` / `DEMANDE_BENEVOLE` / `DEMANDE_MEMBRE` / `DEMANDE_SERVICE` / `DEMANDE_INFORMATION` |
| `message` | string | ✅ | Contenu du message (min 10 chars) |
