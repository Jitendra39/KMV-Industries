import { getUser, user } from '@/database/Auth';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface Product {
  id: number | null;
  name: string;
  images: string[];
  description: string;
  price: string;
  quantity: string;
  size: string;
  category: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<Product>({
    id: null,
    name: '',
    images: [],
    description: '',
    price: '',
    quantity: '',
    size: '',
    category: ''
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (!user) {

      getUser().then(
        (user) => {
          console.log("user", user);

          if (!user) {
            toast.error('You are not authorized to view this page');
            router.push('/login');
          }
        }
      ).catch(() => {
        toast.error('You are not authorized to view this page');
        router.push('/login');
      });
    }

  });

  useEffect(() => {

    console.log("user", user);
    fetch('/api/admin/product/getProduct')
      .then(response => response.json())
      .then(data => {
        // Convert legacy 'image' field to 'images' array for backward compatibility
        const updatedProducts = data.products.map((product: any) => ({
          ...product,
          images: product.images || (product.image ? [product.image] : []),
        }));
        console.log("updatedProducts", updatedProducts);
        setProducts(updatedProducts);
      })
      .catch(_ => {
        toast.error('Error fetching products');
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (formData.id) {
      const updatedImages = [...formData.images[0]];
      setDeleteImages([...deleteImages, updatedImages[index]]);
      updatedImages.splice(index, 1);
      console.log(updatedImages);
      setFormData({ ...formData, images: [updatedImages] as any });
    } else {
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({ ...formData, images: updatedImages });
    }
  };


  const handleRequest = async (route: string, data: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {

      if (route === 'deleteImages') {
        const { images } = data;
        try {
          const response = await fetch('/api/admin/product/deleteImages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-ID': user.user.id || ''
            },
            body: JSON.stringify({ images }),
          });

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

        } catch (error) {
          console.error('Request error:', error);
          reject(error);
        }

      }

      try {
        // If we have new image files, we need to upload them first
        let uploadedImageUrls: string[] = [];



        if (imageFiles.length > 0) {
          const formData = new FormData();
          imageFiles.forEach((file) => {
            formData.append('images', file);
            // console.log(`Adding file ${index}:`, file.name, file.size);
          });

          const uploadResponse = await fetch('/api/admin/product/uploadImages', {
            method: 'POST',
            headers: {
              'User-ID': user.user.id || '',
            },
            body: formData,
          });


          if (!uploadResponse.ok) {
            throw new Error(`Upload failed with status ${uploadResponse.status}`);
          }

          const uploadResult = await uploadResponse.json();

          uploadedImageUrls = uploadResult.urls;
        }

        // Combine existing images with newly uploaded ones
        const finalData = {
          ...data,
          image: [...(data.images || []), ...uploadedImageUrls],
        };

        const response = await fetch(`/api/admin/product/${route}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-ID': user.user.id || ''
          },
          body: JSON.stringify(finalData),
        });

        console.log("response", response);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        resolve(responseData);
      } catch (error) {
        console.error('Request error:', error);
        reject(error);
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.loading('Saving product...');


    if (deleteImages.length > 0) {
      handleRequest('deleteImages', { images: deleteImages })
        .then(_ => {
          console.log('Images deleted successfully');
        })
        .catch(_ => {
          console.error('Error deleting images');
        });
    }


    if (formData.id) {
      handleRequest('updateProduct', formData)
        .then(data => {
          const updatedProducts = products.map((product) =>
            product.id === formData.id ? { ...formData, images: data.product.images || formData.images } : product
          );
          setProducts(updatedProducts);
          toast.dismiss();
          toast.success('Product updated successfully');
        })
        .catch(_ => {
          toast.dismiss();
          toast.error('Error updating product');
        });
    } else {

      console.log("images", { imageFiles, previewImages });

      handleRequest('addProduct', formData)
        .then(data => {
          toast.dismiss();
          toast.success('Product added successfully');
          setProducts([...products, data.product]);
        })
        .catch(err => {
          toast.dismiss();
          toast.error('Error adding product');
          console.error(err);
        });
    }

    closeForm();
  };

  const openForm = (product: Product | null = null) => {
    // Reset image states
    setImageFiles([]);
    setPreviewImages([]);

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
        category: '',
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    // Clean up preview URLs to avoid memory leaks
    previewImages.forEach(url => URL.revokeObjectURL(url));
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    toast.loading('Deleting product...');
    handleRequest('deleteProduct', { id })
      .then(_ => {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        toast.dismiss();
        toast.success('Product deleted successfully');
      })
      .catch(_ => {
        toast.dismiss();
        toast.error('Error deleting product');
      });
  };

  return (
    <div className="product-management-container">
      <div className="product-management-content">
        <h1 className="product-management-title">Product Management</h1>

        <button onClick={() => openForm()} className="product-management-add-button">
          Add Product
        </button>

        {isFormOpen && (
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
                    {/* {console.log("images", formData) as any}    */}
                    {formData.images && formData.images[0] && Array.isArray(formData.images[0]) && formData.images[0].map((image: string, index: number) => (

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
                <div className="product-management-form-group">
                  <label className="product-management-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="product-management-input"
                  >
                    <option value="">Select a category</option>
                    <option value="abc">abc</option>
                    <option value="abcd">abcd</option>
                  </select>
                </div>
                <div className="product-management-form-actions">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="product-management-cancel-button"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="product-management-save-button">
                    {formData.id ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="product-management-table-container">
          <table className="product-management-table">
            <thead>
              <tr>
                <th className="product-management-table-header">Name</th>
                <th className="product-management-table-header">Images</th>
                <th className="product-management-table-header">Price</th>
                <th className="product-management-table-header">Quantity</th>
                <th className="product-management-table-header">Size</th>
                <th className="product-management-table-header product-management-table-actions-header">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>

              {products.map((product) => (
                <tr key={product.id}>
                  <td className="product-management-table-cell">{product.name}</td>
                  <td className="product-management-table-cell product-management-image-cell">
                    {product.images && product.images.length > 0 && product.images[0] && Array.isArray(product.images[0]) ? (
                      // Handle nested array structure
                      <div className="product-management-table-images">
                        <img
                          src={product.images[0][0]}
                          alt={product.name}
                          className="product-management-image"
                        />
                        {product.images[0].length > 1 && (
                          <span className="product-management-image-count">
                            +{product.images[0].length - 1} more
                          </span>
                        )}
                      </div>
                    ) : (
                      // Handle flat array structure
                      product.images && product.images.length > 0 ? (
                        <div className="product-management-table-images">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="product-management-image"
                          />
                          {product.images.length > 1 && (
                            <span className="product-management-image-count">
                              +{product.images.length - 1} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="product-management-no-image">No image</div>
                      )
                    )}
                  </td>
                  <td className="product-management-table-cell">₹{product.price}</td>
                  <td className="product-management-table-cell">{product.quantity}</td>
                  <td className="product-management-table-cell">{product.size}</td>
                  <td className="product-management-table-cell product-management-table-actions">
                    <button
                      onClick={() => openForm(product)}
                      className="product-management-edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => product.id !== null && handleDelete(product.id)}
                      className="product-management-delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;

 