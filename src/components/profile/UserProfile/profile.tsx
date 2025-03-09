import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faHistory, 
  faHeart, 
  faQuestionCircle, 
  faEnvelope, 
  faTruck, 
  faFileAlt,
  faSave,
  faTimes,
  faPlus,
  faTrash,
  faHome,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  profilePicture: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    type: 'Shipping',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate fetching dummy data
        const dummyData: UserData = {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "123-456-7890",
          profilePicture: "profile-placeholder.jpg",
          addresses: [
            {
              id: '1',
              type: 'Shipping',
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              isDefault: true
            },
            {
              id: '2',
              type: 'Billing',
              street: '456 Oak Ave',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              isDefault: true
            }
          ]
        };
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setUserData(dummyData);
        setEditedData(JSON.parse(JSON.stringify(dummyData)));

      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(JSON.parse(JSON.stringify(userData)));
    setImagePreview(null);
    setShowAddressForm(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call to save data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editedData) {
        setUserData(editedData);
      }
      setIsEditing(false);
      setShowAddressForm(false);
      setImagePreview(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedData) {
      setEditedData({
        ...editedData,
        [name]: value
      });
    }
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };

  const handleAddAddress = () => {
    if (editedData) {
      const newAddressComplete: Address = {
        ...newAddress,
        id: Date.now().toString(),
        isDefault: editedData.addresses.filter(a => a.type === newAddress.type).length === 0
      };
      
      setEditedData({
        ...editedData,
        addresses: [...editedData.addresses, newAddressComplete]
      });
      
      setNewAddress({
        type: 'Shipping',
        street: '',
        city: '',
        state: '',
        zipCode: '',
      });
      
      setShowAddressForm(false);
    }
  };

  const handleRemoveAddress = (id: string) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        addresses: editedData.addresses.filter(address => address.id !== id)
      });
    }
  };

  const handleSetDefaultAddress = (id: string, type: string) => {
    if (editedData) {
      const updatedAddresses = editedData.addresses.map(address => {
        if (address.type === type) {
          return {
            ...address,
            isDefault: address.id === id
          };
        }
        return address;
      });
      
      setEditedData({
        ...editedData,
        addresses: updatedAddresses
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        if (editedData) {
          setEditedData({
            ...editedData,
            profilePicture: reader.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !userData) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;
  if (!userData) return <div className="no-data-message">No profile data found.</div>;

  const getAddressesByType = (type: string) => {
    return (isEditing ? editedData : userData)?.addresses.filter(addr => addr.type === type) || [];
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Shipping': return faTruck;
      case 'Billing': return faFileAlt;
      case 'Home': return faHome;
      case 'Office': return faBuilding;
      default: return faEdit;
    }
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-picture-container">
          <img 
            src={imagePreview || (isEditing ? editedData?.profilePicture : userData.profilePicture)} 
            alt="Profile" 
            className="profile-picture" 
          />
          {isEditing && (
            <div className="profile-picture-edit">
              <label htmlFor="profile-picture" className="profile-picture-edit-label">
                <FontAwesomeIcon icon={faEdit} /> Change Photo
              </label>
              <input 
                type="file" 
                id="profile-picture" 
                className="profile-picture-input" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
        
        <div className="profile-info">
          {isEditing ? (
            <div className="profile-edit-form">
              <input
                type="text"
                name="name"
                value={editedData?.name || ''}
                onChange={handleInputChange}
                className="profile-edit-input"
                placeholder="Your Name"
              />
              <input
                type="email"
                name="email"
                value={editedData?.email || ''}
                onChange={handleInputChange}
                className="profile-edit-input"
                placeholder="Your Email"
                disabled
              />
            </div>
          ) : (
            <>
              <h2>{userData.name}</h2>
              <p>{userData.email}</p>
            </>
          )}
        </div>
        
        {isEditing ? (
          <div className="edit-profile-buttons">
            <button
              onClick={handleSave}
              className="save-profile-button"
            >
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="cancel-edit-button"
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="edit-profile-button"
          >
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Basic Information */}
        <div className="profile-section">
          <h3>Basic Information</h3>
          <div className="info-item">
            <label>Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editedData?.phone || ''}
                onChange={handleInputChange}
                className="profile-edit-input"
                placeholder="Your Phone Number"
              />
            ) : (
              <span>{userData.phone}</span>
            )}
          </div>
        </div>

        {/* Addresses */}
        <div className="profile-section addresses-section">
          <div className="section-header">
            <h3>Addresses</h3>
            {isEditing && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="add-address-button"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Address
              </button>
            )}
          </div>
          
          {/* Add Address Form */}
          {isEditing && showAddressForm && (
            <div className="address-form-container">
              <h4>Add New Address</h4>
              <div className="address-form">
                <div className="form-group">
                  <label>Address Type</label>
                  <select
                    name="type"
                    value={newAddress.type}
                    onChange={handleAddressInputChange}
                    className="address-input"
                  >
                    <option value="Shipping">Shipping</option>
                    <option value="Billing">Billing</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleAddressInputChange}
                    className="address-input"
                    placeholder="Street Address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressInputChange}
                      className="address-input"
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleAddressInputChange}
                      className="address-input"
                      placeholder="State"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={newAddress.zipCode}
                      onChange={handleAddressInputChange}
                      className="address-input"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAddress}
                    className="submit-button"
                    disabled={!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode}
                  >
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Addresses */}
          <div className="address-section">
            <h4>Shipping Addresses</h4>
            {getAddressesByType('Shipping').length > 0 ? (
              getAddressesByType('Shipping').map(address => (
                <div key={address.id} className={`address-box ${address.isDefault ? 'default-address' : ''}`}>
                  <div className="address-header">
                    <h5>
                      <FontAwesomeIcon icon={getAddressIcon(address.type)} className="address-icon" />
                      {address.type} Address
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </h5>
                    {isEditing && (
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button 
                            onClick={() => handleSetDefaultAddress(address.id, address.type)}
                            className="make-default-button"
                          >
                            Set Default
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveAddress(address.id)}
                          className="remove-address-button"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="address-content">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-address-message">No shipping addresses added yet.</p>
            )}
          </div>

          {/* Billing Addresses */}
          <div className="address-section">
            <h4>Billing Addresses</h4>
            {getAddressesByType('Billing').length > 0 ? (
              getAddressesByType('Billing').map(address => (
                <div key={address.id} className={`address-box ${address.isDefault ? 'default-address' : ''}`}>
                  <div className="address-header">
                    <h5>
                      <FontAwesomeIcon icon={getAddressIcon(address.type)} className="address-icon" />
                      {address.type} Address
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </h5>
                    {isEditing && (
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button 
                            onClick={() => handleSetDefaultAddress(address.id, address.type)}
                            className="make-default-button"
                          >
                            Set Default
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveAddress(address.id)}
                          className="remove-address-button"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="address-content">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-address-message">No billing addresses added yet.</p>
            )}
          </div>

          {/* Other Addresses if any */}
          {getAddressesByType('Home').length > 0 && (
            <div className="address-section">
              <h4>Home Addresses</h4>
              {getAddressesByType('Home').map(address => (
                <div key={address.id} className={`address-box ${address.isDefault ? 'default-address' : ''}`}>
                  <div className="address-header">
                    <h5>
                      <FontAwesomeIcon icon={getAddressIcon(address.type)} className="address-icon" />
                      {address.type} Address
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </h5>
                    {isEditing && (
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button 
                            onClick={() => handleSetDefaultAddress(address.id, address.type)}
                            className="make-default-button"
                          >
                            Set Default
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveAddress(address.id)}
                          className="remove-address-button"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="address-content">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {getAddressesByType('Office').length > 0 && (
            <div className="address-section">
              <h4>Office Addresses</h4>
              {getAddressesByType('Office').map(address => (
                <div key={address.id} className={`address-box ${address.isDefault ? 'default-address' : ''}`}>
                  <div className="address-header">
                    <h5>
                      <FontAwesomeIcon icon={getAddressIcon(address.type)} className="address-icon" />
                      {address.type} Address
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </h5>
                    {isEditing && (
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button 
                            onClick={() => handleSetDefaultAddress(address.id, address.type)}
                            className="make-default-button"
                          >
                            Set Default
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveAddress(address.id)}
                          className="remove-address-button"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="address-content">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Management */}
        <div className="profile-section">
          <h3>Order Management</h3>
          <div className="profile-links">
            <a href="/order-history" className="profile-link">
              <FontAwesomeIcon icon={faHistory} className="link-icon" /> Order History
            </a>
            <a href="/wishlist" className="profile-link">
              <FontAwesomeIcon icon={faHeart} className="link-icon" /> Wishlist & Favorites
            </a>
          </div>
        </div>

        {/* Customer Support */}
        <div className="profile-section">
          <h3>Customer Support</h3>
          <div className="profile-links">
            <a href="/contact" className="profile-link">
              <FontAwesomeIcon icon={faEnvelope} className="link-icon" /> Contact Support
            </a>
            <a href="/faq" className="profile-link">
              <FontAwesomeIcon icon={faQuestionCircle} className="link-icon" /> FAQs
            </a>
            <a href="/returns" className="profile-link">
              <FontAwesomeIcon icon={faTruck} className="link-icon" /> Return & Refund Policies
            </a>
            <a href="/terms" className="profile-link">
              <FontAwesomeIcon icon={faFileAlt} className="link-icon" /> Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;