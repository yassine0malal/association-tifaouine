import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfile, updateAdminProfile } from "./profileAdminSlice";
import styles from "./Profile.module.css";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const { data: profile, loading } = useSelector((state) => state.profileAdmin);

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        nom: profile.nom || "",
        email: profile.email || "",
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const updateData = { nom: formData.nom, email: formData.email };
    if (formData.password && formData.newPassword) {
      updateData.password = formData.password;
      updateData.newPassword = formData.newPassword;
    }

    try {
      await dispatch(updateAdminProfile(updateData)).unwrap();
      setMessage({ type: "success", text: "Profil mis à jour avec succès." });
      setFormData((prev) => ({ ...prev, password: "", newPassword: "" }));
    } catch (error) {
      setMessage({ type: "error", text: error });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !profile) {
    return <div className={styles.container}><p style={{ padding: "20px" }}>Chargement...</p></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mon Profil Administrateur</h1>
      </header>

      <div className={styles.card}>
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nom complet</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Adresse Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <hr style={{ margin: "32px 0", border: "none", borderTop: "1px solid var(--border)" }} />
          <h3 style={{ marginBottom: "24px", color: "var(--text-h)" }}>Changer le mot de passe (Optionnel)</h3>

          <div className={styles.formGroup}>
            <label>Mot de passe actuel</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Requis uniquement si vous changez le mot de passe"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Nouveau mot de passe</label>
            <input 
              type="password" 
              name="newPassword" 
              value={formData.newPassword} 
              onChange={handleChange} 
              placeholder="Laissez vide pour ne pas changer"
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
