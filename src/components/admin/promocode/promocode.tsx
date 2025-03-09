

















// PromoCode.jsx
import React, { useState, useEffect } from 'react';

const Promocode = () => {
  const [promoCodes, setPromoCodes] = useState<{ code: string; discountType: string; discountValue: string; freeShipping: boolean; }[]>([]);
  const [newPromoCode, setNewPromoCode] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    freeShipping: false,
  });

  useEffect(() => {
    // Simulate fetching existing promo codes from an API
    // Replace with actual API call
    const dummyCodes = [
      { code: 'SAVE10', discountType: 'percentage', discountValue: '10', freeShipping: false },
      { code: 'FREESHIP', discountType: 'freeShipping', discountValue: '', freeShipping: true },
      { code: 'FLAT200', discountType: 'flat', discountValue: '200', freeShipping: false },
    ];
    setPromoCodes(dummyCodes as any );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewPromoCode({
      ...newPromoCode,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate saving the new promo code to an API
    // Replace with actual API call
    setPromoCodes([...promoCodes, newPromoCode]);
    setNewPromoCode({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      freeShipping: false,
    });
  };

  return (
    <div className="promoCode_container_unique">
      <div className="promoCode_innerContainer_unique">
        <h1 className="promoCode_title_unique">Promo Code Management</h1>

        <div className="promoCode_formContainer_unique">
          <h2 className="promoCode_formTitle_unique">Create New Promo Code</h2>
          <form onSubmit={handleSubmit}>
            <div className="promoCode_formGroup_unique">
              <label htmlFor="code">Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={newPromoCode.code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="promoCode_formGroup_unique">
              <label htmlFor="discountType">Discount Type</label>
              <select
                id="discountType"
                name="discountType"
                value={newPromoCode.discountType}
                onChange={handleInputChange}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Discount (₹)</option>
                <option value="freeShipping">Free Shipping</option>
              </select>
            </div>
            {newPromoCode.discountType !== 'freeShipping' && (
              <div className="promoCode_formGroup_unique">
                <label htmlFor="discountValue">Discount Value</label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={newPromoCode.discountValue}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            {newPromoCode.discountType === 'freeShipping' && (
                <div className="promoCode_formGroup_unique">
                  <label htmlFor="freeShipping">Free Shipping</label>
                  <input
                    type="checkbox"
                    id="freeShipping"
                    name="freeShipping"
                    checked={newPromoCode.freeShipping}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            <button type="submit" className="promoCode_submitButton_unique">
              Create Promo Code
            </button>
          </form>
        </div>

        <div className="promoCode_listContainer_unique">
          <h2 className="promoCode_listTitle_unique">Existing Promo Codes</h2>
          <ul className="promoCode_list_unique">
            {promoCodes.map((promo, index) => (
              <li key={index} className="promoCode_listItem_unique">
                <strong>{promo.code}:</strong>{' '}
                {promo.discountType === 'percentage'
                  ? `₹{promo.discountValue}% off`
                  : promo.discountType === 'flat'
                  ? `₹{promo.discountValue} off`
                  : 'Free Shipping'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Promocode;