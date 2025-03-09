import React from 'react';
// import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory, faHeart, faQuestionCircle, faEnvelope, faTruck, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  // Dummy JSON data (replace with your backend data)
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 123-456-7890',
    shippingAddress: '123 Main St, Anytown, CA 91234',
    billingAddress: '123 Main St, Anytown, CA 91234',
    orderHistory: [
      { orderId: 1, status: 'Delivered' },
      { orderId: 2, status: 'Shipped' },
    ],
    wishlist: ['Product A', 'Product B'],
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="profile-placeholder.jpg" alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
        </div>
        <button className="edit-profile-button">
          <FontAwesomeIcon icon={faEdit} /> Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Basic Information</h3>
          <p><strong>Phone:</strong> {userData.phone}</p>
        </div>

        <div className="profile-section">
          <h3>Shipping & Billing Addresses</h3>
          <div className="address-box">
            <h4>Shipping Address</h4>
            <p>{userData.shippingAddress}</p>
          </div>
          <div className="address-box">
            <h4>Billing Address</h4>
            <p>{userData.billingAddress}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Order Management</h3>
          <div className="profile-links">
            <a href="/order-history">
              <FontAwesomeIcon icon={faHistory} /> Order History
            </a>
            <a href="/wishlist">
              <FontAwesomeIcon icon={faHeart} /> Wishlist & Favorites
            </a>
          </div>
        </div>

        <div className="profile-section">
          <h3>Customer Support</h3>
          <div className="profile-links">
            <a href="/contact">
              <FontAwesomeIcon icon={faEnvelope} /> Contact Support
            </a>
            <a href="/faq">
              <FontAwesomeIcon icon={faQuestionCircle} /> FAQs
            </a>
            <a href="/returns">
              <FontAwesomeIcon icon={faTruck} /> Return & Refund Policies
            </a>
            <a href="/terms">
              <FontAwesomeIcon icon={faFileAlt} /> Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;