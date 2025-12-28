import React, { useState } from 'react';
import { uploadProductImage, uploadMultipleProductImages, deleteProductImage } from '../firebase/storage';
import { updateProduct } from '../firebase/firestore';

const ImageUpload = ({ productId, currentImages = [], onImagesUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    setUploadProgress(`Завантаження ${files.length} файлів...`);

    try {
      const result = await uploadMultipleProductImages(files, productId);
      
      if (result.success) {
        // Оновлюємо документ товару з новими URL зображень
        const allImages = [...currentImages, ...result.urls];
        await updateProduct(productId, { images: allImages });
        
        setUploadProgress(`Успішно завантажено ${result.urls.length} зображень!`);
        
        if (onImagesUpdated) {
          onImagesUpdated(allImages);
        }
        
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setError(result.error || 'Помилка завантаження');
      }
    } catch (err) {
      setError('Виникла помилка при завантаженні');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl, index) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це зображення?')) {
      return;
    }

    try {
      // Витягуємо ім'я файлу з URL
      const fileName = imageUrl.split(`products%2F${productId}%2F`)[1]?.split('?')[0];
      
      if (fileName) {
        const decodedFileName = decodeURIComponent(fileName);
        await deleteProductImage(productId, decodedFileName);
      }
      
      // Оновлюємо масив зображень
      const updatedImages = currentImages.filter((_, i) => i !== index);
      await updateProduct(productId, { images: updatedImages });
      
      if (onImagesUpdated) {
        onImagesUpdated(updatedImages);
      }
    } catch (err) {
      setError('Помилка видалення зображення');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      background: 'var(--secondary)',
      borderRadius: '15px',
      marginTop: '2rem'
    }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
        Завантаження зображень
      </h3>

      {/* Кнопка завантаження */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
          id={`file-input-${productId}`}
        />
        <label
          htmlFor={`file-input-${productId}`}
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: uploading ? '#ccc' : 'var(--accent)',
            color: 'white',
            borderRadius: '10px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {uploading ? 'Завантаження...' : 'Обрати зображення'}
        </label>
      </div>

      {/* Статус завантаження */}
      {uploadProgress && (
        <div style={{
          padding: '1rem',
          background: '#e8f5e9',
          color: '#2e7d32',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {uploadProgress}
        </div>
      )}

      {/* Помилки */}
      {error && (
        <div style={{
          padding: '1rem',
          background: '#ffebee',
          color: '#c62828',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Поточні зображення */}
      {currentImages && currentImages.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
            Поточні зображення ({currentImages.length}):
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {currentImages.map((url, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={url}
                  alt={`Продукт ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '2px solid var(--secondary)'
                  }}
                />
                <button
                  onClick={() => handleDeleteImage(url, index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: '#c62828',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Підказка */}
      <p style={{
        marginTop: '1rem',
        fontSize: '0.9rem',
        color: 'var(--text-light)'
      }}>
        💡 Рекомендовані розміри: 1200x1200 пікселів. Максимальний розмір: 5MB.
      </p>
    </div>
  );
};

export default ImageUpload;
