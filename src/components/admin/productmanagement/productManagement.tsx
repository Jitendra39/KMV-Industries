// ProductManagement.js
import React, { useState, useEffect } from 'react';
 
interface Product {
  id: number | null;
  name: string;
  image: string;
  description: string;
  price: string;
  quantity: string;
  size: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Product>({
    id: null,
    name: '',
    image: '',
    description: '',
    price: '',
    quantity: '',
    size: '',
  });

  const dummyData = [
    {
      id: 1,
      name: 'Classic T-Shirt',
      image: 'https://via.placeholder.com/150',
      description: 'A comfortable and stylish classic t-shirt.',
      price: 19.99,
      quantity: 50,
      size: 'M',
    },
    {
      id: 2,
      name: 'Denim Jeans',
      image: 'https://via.placeholder.com/150',
      description: 'Durable denim jeans for everyday wear.',
      price: 49.99,
      quantity: 30,
      size: '32',
    },
    {
      id: 3,
      name: 'Running Shoes',
      image: 'https://via.placeholder.com/150',
      description: 'Lightweight running shoes for optimal performance.',
      price: 79.99,
      quantity: 20,
      size: '10',
    },
    {
      id: 4,
      name: 'Summer Dress',
      image: 'https://via.placeholder.com/150',
      description: 'A breezy summer dress perfect for warm weather.',
      price: 39.99,
      quantity: 40,
      size: 'S',
    },
    {
      id: 5,
      name: 'Winter Jacket',
      image: 'https://via.placeholder.com/150',
      description: 'A warm and insulated jacket for cold days.',
      price: 99.99,
      quantity: 15,
      size: 'L',
    },
    {
      id: 6,
      name: 'Casual Hoodie',
      image: 'https://via.placeholder.com/150',
      description: 'A comfortable casual hoodie for everyday use.',
      price: 29.99,
      quantity: 60,
      size: 'XL',
    },
  ];

  useEffect(() => {
    setProducts(dummyData as any);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.id) {
      const updatedProducts = products.map((product) =>
        product.id === formData.id ? { ...formData } : product
      );
      setProducts(updatedProducts);
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    closeForm();
  };

  const openForm = (product: Product | null = null) => {
    if (product) {
      setFormData({
        ...product,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
      });
    } else {
      setFormData({
        id: null,
        name: '',
        image: '',
        description: '',
        price: '',
        quantity: '',
        size: '',
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
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
                  />
                </div>
                <div className="product-management-form-group">
                  <label className="product-management-label">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="product-management-input"
                  />
                </div>
                <div className="product-management-form-group">
                  <label className="product-management-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="product-management-textarea"
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
                <th className="product-management-table-header">Image</th>
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
                  <td className="product-management-table-cell">
                    <img
                      src={product.image}
                      alt={"no preview" }
                      className="product-management-image"
                    />
                  </td>
                  <td className="product-management-table-cell">${product.price}</td>
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