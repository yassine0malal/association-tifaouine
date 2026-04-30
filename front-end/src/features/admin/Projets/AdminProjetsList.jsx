
import styles from "./ProjectList.module.css";
import FormConstructor from "../../../components/admin/FormConstructor";

export default function AdminProjetsList() {
    const projectFields = [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        {
            name: "category",
            label: "Category",
            type: "select",
            options: [
                { label: "Tech", value: "tech" },
                { label: "Health", value: "health" }
            ]
        },
        { name: "image", label: "Image", type: "file" }
    ];

    const handleCreate = async (formData) => {
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            console.log("Created:", data);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.projectist}>
            <h2>Create Project</h2>

            <FormConstructor
                fields={projectFields}
                onSubmit={handleCreate}
            />
        </div>
    );
}
