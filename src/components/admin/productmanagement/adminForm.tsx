import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Product {
  id: number | null;
  name: string;
  images: string[];
  description: string;
  price: string;
  quantity: string;
  size: string;
}

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductForm = ({ product, onClose, onSave }: ProductFormProps) => {
  const [formData, setFormData] = useState<Product>({
    id: null,
    name: '',
    images: [],
    description: '',
    price: '',
    quantity: '',
    size: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize form data when product prop changes
    if (product) {
      setFormData({
        ...product,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        images: product.images || [],
      });
    } else {
      setFormData({
        id: null,
        name: '',
        images: [],
        description: '',
        price: '',
        quantity: '',
        size: '',
      });
    }
    
    // Reset image states
    setImageFiles([]);
    setPreviewImages([]);
    
    // Cleanup function
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...previewImages];
    
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setImageFiles(updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading('Saving product...');
    
    try {
      // Upload images if there are any
      let uploadedImageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        const imageFormData = new FormData();
        imageFiles.forEach((file) => {
          imageFormData.append('images', file);
        });
        
        const uploadResponse = await fetch('/api/admin/product/uploadImages', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        const uploadResult = await uploadResponse.json();
        uploadedImageUrls = uploadResult.urls;
      }

      // Combine existing images with newly uploaded ones
      const productToSave = {
        ...formData,
        image: uploadedImageUrls,
      };

      // Determine if we're adding or updating
      const apiEndpoint = formData.id ? 'updateProduct' : 'addProduct';
      console.log('Product to save:', apiEndpoint);
      const response = await fetch(`/api/admin/product/${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSave),
      });

      console.log('Response:', response);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      toast.dismiss();
      toast.success(`Product ${formData.id ? 'updated' : 'added'} successfully`);
      
      // Pass the saved product back to parent component
      onSave(data.product);
    } catch (error) {
      toast.dismiss();
      console.error(error);

      toast.error(`Error ${formData.id ? 'updating' : 'adding'} product`);
    }
  };

  return (
    <div className="product-management-form-overlay">
      <div className="product-management-form-container">
        <h2 className="product-management-form-title">
          {formData.id ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="product-management-form-group">
            <label className="product-management-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="product-management-input"
              required
            />
          </div>
          
          <div className="product-management-form-group">
            <label className="product-management-label">Images</label>
            <div className="product-management-image-upload">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="product-management-file-input"
                multiple
                accept="image/*"
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="product-management-upload-button"
              >
                Select Images
              </button>
            </div>
            
            <div className="product-management-image-preview-container">
              {/* Existing images */}
              {formData.images && formData.images.map((image, index) => (
                <div key={`existing-${index}`} className="product-management-image-preview-wrapper">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="product-management-image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="product-management-remove-image"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* New image previews */}
              {previewImages.map((preview, index) => (
                <div key={`new-${index}`} className="product-management-image-preview-wrapper">
                  <img
                    src={preview}
                    alt={`Upload ${index + 1}`}
                    className="product-management-image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="product-management-remove-image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="product-management-form-group">
            <label className="product-management-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="product-management-textarea"
              required
            />
          </div>
          
          <div className="product-management-form-group">
            <label className="product-management-label">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="product-management-input"
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="product-management-form-group">
            <label className="product-management-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="product-management-input"
              required
              min="0"
            />
          </div>
          
          <div className="product-management-form-group">
            <label className="product-management-label">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="product-management-input"
            />
          </div>
          
          <div className="product-management-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="product-management-cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="product-management-save-button"
            >
              {formData.id ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;