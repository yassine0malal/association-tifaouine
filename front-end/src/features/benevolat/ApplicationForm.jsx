import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

/** Allowed MIME types per file input */
const ALLOWED_FILE_TYPES = {
  photo: ["image/jpeg", "image/png", "image/jpg"],
  identity_card: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
  cv_doc: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
};

/** Max file sizes in bytes */
const MAX_FILE_SIZE = {
  photo: 5 * 1024 * 1024,        // 5 MB
  identity_card: 10 * 1024 * 1024, // 10 MB
  cv_doc: 10 * 1024 * 1024,       // 10 MB
};

/** API endpoint per path */
const API_ENDPOINTS = {
  volunteer: "/api/volunteer",
  member: "/api/member",
};

/** Initial blank form state */
const INITIAL_FORM_DATA = {
  fullname: "",
  email: "",
  phone_number: "",
  skills: "",
  address: "",
  motivation: "",
  availability: "",
  photo: null,
  identity_card: null,
  cv_doc: null,
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

function ApplicationForm({ path, styles }) {
  const { t, i18n } = useTranslation("volunteer_page");

  // ── State ──────────────────────────────────
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  /** Tracks whether the user has attempted to submit at least once.
   *  Errors are only shown after the first submit attempt. */
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // ── File input refs (used to reset inputs after successful submit) ──
  const photoRef = useRef();
  const identityRef = useRef();
  const cvRef = useRef();

  // ─────────────────────────────────────────────
  // Validation rules (rebuilt when language changes)
  // ─────────────────────────────────────────────

  const validationRules = useMemo(
    () => ({
      fullname: {
        regex: /^[a-zA-Z\u0600-\u06FF\s]{3,50}$/,
        message: t("applicationForm.validation.fullname"),
      },
      email: {
        regex: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
        message: t("applicationForm.validation.email"),
      },
      phone_number: {
        regex: /^(\+212|0)[6-7][0-9]{8}$/,
        message: t("applicationForm.validation.phone"),
      },
      address: {
        regex: /^.{5,100}$/,
        message: t("applicationForm.validation.address"),
      },
      motivation: {
        regex: /^.{20,500}$/,
        message: t("applicationForm.validation.motivation"),
      },
      skills: {
        regex: /^.{2,100}$/,
        message: t("applicationForm.validation.skills"),
      },
      availability: {
        regex: /.+/,
        message: t("applicationForm.validation.availability"),
      },
    }),
    [t, i18n.language],
  );

  // ─────────────────────────────────────────────
  // Field-level text validation helper
  // ─────────────────────────────────────────────

  /** Returns an error string for a given text field, or "" if valid. */
  const getFieldError = useCallback(
    (name, value, rules = validationRules) => {
      const rule = rules[name];
      if (!rule) return "";

      if (!value || (typeof value === "string" && !value.trim())) {
        return t("applicationForm.validation.required");
      }

      const stringValue = typeof value === "string" ? value : value.name || "";
      if (!rule.regex.test(stringValue)) {
        return rule.message;
      }

      return "";
    },
    [validationRules, t],
  );

  // ─────────────────────────────────────────────
  // File validation helper
  // ─────────────────────────────────────────────

  /**
   * Validates a file against allowed types and max size.
   * Returns an error string, or "" if valid.
   */
  const getFileError = useCallback(
    (name, file) => {
      if (!file) {
        // Required file fields
        if (name === "photo") return t("applicationForm.validation.photo");
        if (name === "identity_card") return t("applicationForm.validation.idCard");
        return ""; // cv_doc is optional
      }

      const allowed = ALLOWED_FILE_TYPES[name] || [];
      if (!allowed.includes(file.type)) {
        return t("applicationForm.validation.fileType", {
          types: allowed.join(", "),
        });
      }

      const maxSize = MAX_FILE_SIZE[name];
      if (file.size > maxSize) {
        return t("applicationForm.validation.fileSize", {
          size: maxSize / (1024 * 1024),
        });
      }

      return "";
    },
    [t],
  );

  // ─────────────────────────────────────────────
  // Re-validate translated error messages on language change
  // (only after first submit attempt)
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!hasSubmitted || Object.keys(errors).length === 0) return;

    const updatedErrors = {};
    let hasChanges = false;

    Object.keys(formData).forEach((field) => {
      const value = formData[field];
      // Use appropriate validator depending on field type
      const newError =
        value instanceof File || value === null
          ? getFileError(field, value)
          : getFieldError(field, value);

      if (newError !== errors[field]) {
        updatedErrors[field] = newError;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setErrors((prev) => ({ ...prev, ...updatedErrors }));
    }
  }, [i18n.language, validationRules, getFieldError, getFileError, formData, errors, hasSubmitted]);

  // ─────────────────────────────────────────────
  // Event handlers
  // ─────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0] || null;

      // Always validate the file so we can surface errors
      const fileError = getFileError(name, file);

      if (fileError) {
        // Store the error (visible only after first submit)
        if (hasSubmitted) {
          setErrors((prev) => ({ ...prev, [name]: fileError }));
        }
        // Do NOT update formData — keep previous valid file (or null)
        return;
      }

      // File is valid — update formData and clear any previous error
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (hasSubmitted) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      // Text / select input
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Live re-validation only after first submit attempt
      if (hasSubmitted) {
        const error = getFieldError(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  // ─────────────────────────────────────────────
  // Full-form validation (called on submit)
  // ─────────────────────────────────────────────

  const validateForm = () => {
    const newErrors = {};

    // ── Text fields always required ────────────
    const alwaysRequiredText = ["fullname", "email", "phone_number", "address", "motivation"];
    alwaysRequiredText.forEach((field) => {
      const error = getFieldError(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // ── Volunteer-only fields ──────────────────
    if (path === "volunteer") {
      const skillsError = getFieldError("skills", formData.skills);
      if (skillsError) newErrors.skills = skillsError;

      const availabilityError = getFieldError("availability", formData.availability);
      if (availabilityError) newErrors.availability = availabilityError;
    }

    // ── File fields ────────────────────────────
    // photo — required for both paths
    const photoError = getFileError("photo", formData.photo);
    if (photoError) newErrors.photo = photoError;

    // identity_card — required for both paths
    const idCardError = getFileError("identity_card", formData.identity_card);
    if (idCardError) newErrors.identity_card = idCardError;

    // cv_doc — optional, but validate type/size if provided
    if (formData.cv_doc) {
      const cvError = getFileError("cv_doc", formData.cv_doc);
      if (cvError) newErrors.cv_doc = cvError;
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  // ─────────────────────────────────────────────
  // Submit handler
  // ─────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      // Scroll to and focus the first invalid field
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // ── Build multipart payload ────────────────
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });
    submitData.append("path", path);

    // ── Choose endpoint based on path ──────────
    const endpoint = API_ENDPOINTS[path] ?? "/api/application";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: t("applicationForm.response.success"),
        });

        // Reset form
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setHasSubmitted(false);
        if (photoRef.current) photoRef.current.value = "";
        if (identityRef.current) identityRef.current.value = "";
        if (cvRef.current) cvRef.current.value = "";
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: t("applicationForm.response.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // Utility
  // ─────────────────────────────────────────────

  const getFileName = (file) => (file ? file.name : "");

  // ─────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────

  /** Renders an inline error only after first submit attempt */
  const ErrorMsg = ({ field }) =>
    hasSubmitted && errors[field] ? (
      <span className={styles.errorMessage}>{errors[field]}</span>
    ) : null;

  /** Returns combined wrapper class with optional error class */
  const wrapperClass = (field) =>
    `${styles.wrapper} ${errors[field] && hasSubmitted ? styles.error : ""}`;

  /** Returns input class with optional error class */
  const inputClass = (field) =>
    errors[field] && hasSubmitted ? styles.inputError : "";

  // ─────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────

  console.log(path);
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>{t(`applicationForm.form_title.${path !== "" ? path : "volunteer"}`)}</h2>
      <div className={styles.inputFields}>

        {/* ── Row 1: Full name + Email ── */}
        <div className={styles.twoInputs}>
          <div className={wrapperClass("fullname")}>
            <label htmlFor="fullname">{t("applicationForm.labels.fullname")} *</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder={t("applicationForm.placeholders.fullname")}
              className={inputClass("fullname")}
            />
            <ErrorMsg field="fullname" />
          </div>

          <div className={wrapperClass("email")}>
            <label htmlFor="email">{t("applicationForm.labels.email")} *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("applicationForm.placeholders.email")}
              className={inputClass("email")}
            />
            <ErrorMsg field="email" />
          </div>
        </div>

        {/* ── Row 2: Phone (+ Skills for volunteer) ── */}
        {path === "volunteer" ? (
          <div className={styles.twoInputs}>
            <div className={wrapperClass("phone_number")}>
              <label htmlFor="phone_number">{t("applicationForm.labels.phone")} *</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder={t("applicationForm.placeholders.phone")}
                className={inputClass("phone_number")}
              />
              <ErrorMsg field="phone_number" />
            </div>

            <div className={wrapperClass("skills")}>
              <label htmlFor="skills">{t("applicationForm.labels.skills")} *</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder={t("applicationForm.placeholders.skills")}
                className={inputClass("skills")}
              />
              <ErrorMsg field="skills" />
            </div>
          </div>
        ) : (
          <div className={wrapperClass("phone_number")}>
            <label htmlFor="phone_number">{t("applicationForm.labels.phone")} *</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder={t("applicationForm.placeholders.phone")}
              className={inputClass("phone_number")}
            />
            <ErrorMsg field="phone_number" />
          </div>
        )}

        {/* ── Availability (volunteer only) ── */}
        {path === "volunteer" && (
          <div className={wrapperClass("availability")}>
            <label htmlFor="availability">{t("applicationForm.labels.availability")} *</label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className={inputClass("availability")}
            >
              <option value="" disabled>{t("applicationForm.availabilityOptions.select")}</option>
              <option value="weekdays">{t("applicationForm.availabilityOptions.weekdays")}</option>
              <option value="weekends">{t("applicationForm.availabilityOptions.weekends")}</option>
              <option value="evenings">{t("applicationForm.availabilityOptions.evenings")}</option>
              <option value="full-time">{t("applicationForm.availabilityOptions.fullTime")}</option>
              <option value="flexible">{t("applicationForm.availabilityOptions.flexible")}</option>
            </select>
            <ErrorMsg field="availability" />
          </div>
        )}

        {/* ── Address ── */}
        <div className={wrapperClass("address")}>
          <label htmlFor="address">{t("applicationForm.labels.address")} *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={t("applicationForm.placeholders.address")}
            className={inputClass("address")}
          />
          <ErrorMsg field="address" />
        </div>

        {/* ── Motivation ── */}
        <div className={wrapperClass("motivation")}>
          <label htmlFor="motivation">{t("applicationForm.labels.motivation")} *</label>
          <textarea
            name="motivation"
            id="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder={t("applicationForm.placeholders.motivation")}
            className={inputClass("motivation")}
            rows={4}
          />
          <ErrorMsg field="motivation" />
        </div>

        {/* ── File uploads: Photo + ID card ── */}
        <div className={styles.twoInputs}>

          {/* Photo */}
          <div className={wrapperClass("photo")}>
            <label htmlFor="photo">{t("applicationForm.labels.photo")} *</label>
            <input
              type="file"
              id="photo"
              name="photo"
              ref={photoRef}
              onChange={handleChange}
              accept="image/jpeg,image/png,image/jpg"
            />
            <label htmlFor="photo" className={styles.fileLabel}>
              <svg width="30" height="30" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H5.15L7 2H13V4H7.875L6.05 6H2V18H18V9H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H2ZM18 6V4H16V2H18V0H20V2H22V4H20V6H18ZM10 16.5C11.25 16.5 12.3125 16.0625 13.1875 15.1875C14.0625 14.3125 14.5 13.25 14.5 12C14.5 10.75 14.0625 9.6875 13.1875 8.8125C12.3125 7.9375 11.25 7.5 10 7.5C8.75 7.5 7.6875 7.9375 6.8125 8.8125C5.9375 9.6875 5.5 10.75 5.5 12C5.5 13.25 5.9375 14.3125 6.8125 15.1875C7.6875 16.0625 8.75 16.5 10 16.5ZM10 14.5C9.3 14.5 8.70833 14.2583 8.225 13.775C7.74167 13.2917 7.5 12.7 7.5 12C7.5 11.3 7.74167 10.7083 8.225 10.225C8.70833 9.74167 9.3 9.5 10 9.5C10.7 9.5 11.2917 9.74167 11.775 10.225C12.2583 10.7083 12.5 11.3 12.5 12C12.5 12.7 12.2583 13.2917 11.775 13.775C11.2917 14.2583 10.7 14.5 10 14.5Z" fill="#837567" />
              </svg>
              <span>{formData.photo ? getFileName(formData.photo) : t("applicationForm.fileUpload.photo")}</span>
            </label>
            <ErrorMsg field="photo" />
          </div>

          {/* Identity card */}
          <div className={wrapperClass("identity_card")}>
            <label htmlFor="identity_card">{t("applicationForm.labels.idCard")} *</label>
            <input
              type="file"
              id="identity_card"
              name="identity_card"
              ref={identityRef}
              onChange={handleChange}
              accept="image/jpeg,image/png,image/jpg,application/pdf"
            />
            <label htmlFor="identity_card" className={styles.fileLabel}>
              <svg width="30" height="30" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9H17V7H12V9V9M12 6H17V4H12V6V6M3 12H11V11.45C11 10.7 10.6333 10.1042 9.9 9.6625C9.16667 9.22083 8.2 9 7 9C5.8 9 4.83333 9.22083 4.1 9.6625C3.36667 10.1042 3 10.7 3 11.45V12V12M7 8C7.55 8 8.02083 7.80417 8.4125 7.4125C8.80417 7.02083 9 6.55 9 6C9 5.45 8.80417 4.97917 8.4125 4.5875C8.02083 4.19583 7.55 4 7 4C6.45 4 5.97917 4.19583 5.5875 4.5875C5.19583 4.97917 5 5.45 5 6C5 6.55 5.19583 7.02083 5.5875 7.4125C5.97917 7.80417 6.45 8 7 8V8M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2V16M2 14H18V2H2V14M2 14V2V14" fill="#837567" />
              </svg>
              <span>{formData.identity_card ? getFileName(formData.identity_card) : t("applicationForm.fileUpload.idCard")}</span>
            </label>
            <ErrorMsg field="identity_card" />
          </div>
        </div>
      </div>

      {/* ── CV upload (member path only, optional) ── */}
      {path === "member" && (
        <div className={styles.wrapper}>
          <label htmlFor="cv_doc">{t("applicationForm.labels.cv")}</label>
          <input
            type="file"
            id="cv_doc"
            name="cv_doc"
            ref={cvRef}
            onChange={handleChange}
            accept="image/jpeg,image/png,image/jpg,application/pdf"
          />
          <label htmlFor="cv_doc" className={styles.fileLabel}>
            <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9063 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5V10.5V10.5C28.725 10.7 30.1563 11.4437 31.2938 12.7312C32.4313 14.0187 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21V21V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3437 3.73125 18.575 3 16.5 3C14.425 3 12.6563 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25V24M16.5 13.5V13.5V13.5V13.5" fill="#D5C3B4" />
            </svg>
            <span>{formData.cv_doc ? getFileName(formData.cv_doc) : t("applicationForm.fileUpload.cv")}</span>
          </label>
          <ErrorMsg field="cv_doc" />
        </div>
      )}

      {/* ── Submit button ── */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? t("applicationForm.button.submitting")
          : t("applicationForm.button.submit")}
      </button>

      {/* ── Submit status message ── */}
      {submitStatus && (
        <p className={`${styles.responseMsg} ${styles[submitStatus.type]}`}>
          {submitStatus.type === "success" ? (
            <svg width="15" height="15" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 8.5L9 4M5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667Z" fill="#2EB431" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25 8.75H6.41667V5.25H5.25V8.75V8.75M5.83333 4.08333C5.99861 4.08333 6.13715 4.02743 6.24896 3.91563C6.36076 3.80382 6.41667 3.66528 6.41667 3.5C6.41667 3.33472 6.36076 3.19618 6.24896 3.08437C6.13715 2.97257 5.99861 2.91667 5.83333 2.91667C5.66806 2.91667 5.52951 2.97257 5.41771 3.08437C5.3059 3.19618 5.25 3.33472 5.25 3.5C5.25 3.66528 5.3059 3.80382 5.41771 3.91563C5.52951 4.02743 5.66806 4.08333 5.83333 4.08333Z" fill="#D32F2F" />
            </svg>
          )}
          <span>{submitStatus.message}</span>
        </p>
      )}
    </form>
  );
}

export default ApplicationForm;