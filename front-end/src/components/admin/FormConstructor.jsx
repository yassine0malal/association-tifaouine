import styles from "./FormConstructor.module.css";

import { useState } from "react";

const DynamicForm = ({ fields, onSubmit }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (e, field) => {
        const { name, value, type, checked, files } = e.target;

        let val;

        if (type === "checkbox") {
            val = checked;
        } else if (type === "file") {
            val = field.multiple ? files : files[0];
        } else {
            val = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const validate = () => {
        let newErrors = {};

        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Prepare FormData (important for files)
        const dataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            const value = formData[key];

            if (value instanceof FileList) {
                Array.from(value).forEach(file => {
                    dataToSend.append(key, file);
                });
            } else {
                dataToSend.append(key, value);
            }
        });

        onSubmit(dataToSend);
    };

    return (

        <form onSubmit={handleSubmit} className={styles.formContainer}>

            {fields.map(field => (
                <div key={field.name} className={styles.formGroup}>

                    <label className={styles.label}>{field.label}</label>

                    {/* TEXTAREA */}
                    {field.type === "textarea" && (
                        <textarea
                            className={styles.textarea}
                            name={field.name}
                            onChange={(e) => handleChange(e, field)}
                        />
                    )}

                    {/* SELECT */}
                    {field.type === "select" && (
                        <select
                            className={styles.select}
                            name={field.name}
                            onChange={(e) => handleChange(e, field)}
                        >
                            <option value="">Select...</option>
                            {field.options.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* CHECKBOX */}
                    {field.type === "checkbox" && (
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            name={field.name}
                            onChange={(e) => handleChange(e, field)}
                        />
                    )}

                    {/* RADIO */}
                    {field.type === "radio" && (
                        <div className={styles.radioGroup}>
                            {field.options.map(opt => (
                                <label key={opt.value}>
                                    <input
                                        type="radio"
                                        className={styles.radio}
                                        name={field.name}
                                        value={opt.value}
                                        onChange={(e) => handleChange(e, field)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    )}

                    {/* FILE */}
                    {field.type === "file" && (
                        <input
                            type="file"
                            className={styles.fileInput}
                            name={field.name}
                            multiple={field.multiple}
                            onChange={(e) => handleChange(e, field)}
                        />
                    )}

                    {/* DEFAULT INPUT */}
                    {!["textarea", "select", "checkbox", "radio", "file"].includes(field.type) && (
                        <input
                            type={field.type}
                            className={styles.input}
                            name={field.name}
                            onChange={(e) => handleChange(e, field)}
                        />
                    )}

                    {/* ERROR */}
                    {errors[field.name] && (
                        <span className={styles.error}>{errors[field.name]}</span>
                    )}
                </div>
            ))}

            <button type="submit" className={styles.submitBtn}>
                Create
            </button>
        </form>
    );
};

export default DynamicForm;