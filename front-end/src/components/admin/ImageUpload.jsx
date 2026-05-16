import React, { useState, useEffect, useRef } from 'react';
import styles from './ImageUpload.module.css';
import { FaCloudUploadAlt, FaTimes, FaFileImage } from 'react-icons/fa';

/**
 * ImageUpload Component
 * @param {Object} props
 * @param {string} props.label - Label for the upload field
 * @param {boolean} props.multiple - Allow multiple file selection
 * @param {Function} props.onChange - Callback when files are selected/changed
 * @param {string} props.accept - Accepted file types (default: "image/*")
 * @param {Array} props.existingImages - Array of existing image objects {id, url} or strings
 * @param {Function} props.onRemoveExisting - Callback when an existing image is removed
 * @param {string} props.required - If the field is required
 */
const ImageUpload = ({
  label,
  multiple = false,
  onChange,
  accept = "image/*",
  existingImages = [],
  onRemoveExisting,
  required = false
}) => {
  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (multiple) {
      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);
      onChange(newFiles);

      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isNew: true
      }));
      setPreviews([...previews, ...newPreviews]);
    } else {
      const file = files[0];
      setSelectedFiles([file]);
      onChange(file);

      // Revoke old single preview if it exists
      if (previews.length > 0 && previews[0].isNew) {
        URL.revokeObjectURL(previews[0].url);
      }

      setPreviews([{
        url: URL.createObjectURL(file),
        name: file.name,
        isNew: true
      }]);
    }
  };

  const removeFile = (index, e) => {
    e.preventDefault();
    e.stopPropagation();

    const fileToRemove = previews[index];

    if (fileToRemove.isNew) {
      URL.revokeObjectURL(fileToRemove.url);
      const newFiles = selectedFiles.filter((_, i) => {
        // For single file, selectedFiles has only one element
        if (!multiple) return false;

        // Find the index in selectedFiles. 
        // This is a bit tricky if we have duplicate names, 
        // but since they are from the same selection session it should be okay-ish
        // Better: filter previews and then re-map selectedFiles if needed
        return i !== index;
      });

      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);

      if (multiple) {
        // We need to match selectedFiles with previews
        // Actually, selectedFiles should always correspond to isNew previews
        const newSelectedFiles = selectedFiles.filter((_, i) => {
          // Find the relative index among new files
          let newIdx = 0;
          for (let k = 0; k < index; k++) {
            if (previews[k].isNew) newIdx++;
          }
          return i !== newIdx;
        });
        setSelectedFiles(newSelectedFiles);
        onChange(newSelectedFiles);
      } else {
        setSelectedFiles([]);
        onChange(null);
      }
    } else {
      // Existing image removal
      if (onRemoveExisting) {
        onRemoveExisting(fileToRemove.originalData);
      }
      setPreviews(previews.filter((_, i) => i !== index));
    }
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previews.forEach(p => {
        if (p.isNew) URL.revokeObjectURL(p.url);
      });
    };
  }, []);

  // Initialize previews with existing images if any
  useEffect(() => {
    const initialPreviews = existingImages.map(img => ({
      url: typeof img === 'string' ? img : img.url,
      name: 'Existing Image',
      isNew: false,
      originalData: img
    }));
    setPreviews(initialPreviews);
  }, [existingImages.length]);

  return (
    <div className={styles.uploadContainer}>
      {label && <label className={styles.label}>{label} {required && <span className={styles.required}>*</span>}</label>}

      <div
        className={styles.dropZone}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          className={styles.hiddenInput}
        />
        <div className={styles.dropZoneContent}>
          <FaCloudUploadAlt className={styles.uploadIcon} />
          <p>Cliquez pour sélectionner {multiple ? 'des images' : 'une image'}</p>
          <span className={styles.fileCount}>
            {previews.length} fichier{previews.length !== 1 ? 's' : ''} sélectionné{previews.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {previews.length > 0 && (
        <div className={styles.previewGrid}>
          {previews.map((preview, index) => (
            <div key={index} className={styles.previewItem}>
              <img src={preview.url} alt={preview.name} className={styles.previewImage} />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => removeFile(index, e)}
                title="Supprimer"
              >
                <FaTimes />
              </button>
              {preview.isNew && <span className={styles.newBadge}>Nouveau</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
