 
import React, { useState, useEffect } from 'react';


const Analytics = () => {
  const [salesData, setSalesData] = useState({
    dailyRevenue: 1200,
    weeklyRevenue: 8000,
    monthlyRevenue: 35000,
    bestSellers: [
      { name: 'Classic T-Shirt', sales: 150 },
      { name: 'Denim Jeans', sales: 120 },
      { name: 'Running Shoes', sales: 90 },
      { name: 'Winter Jacket', sales: 80 },
      { name: 'Summer Dress', sales: 100 },
      { name: 'Casual Hoodie', sales: 110 },
    ],
    visitorDemographics: {
      age: '25-34',
      location: 'USA',
      gender: 'Mixed',
    },
    referralSources: ['Google', 'Social Media', 'Direct', 'Email'],
    numberOfSales: 320,
    shippingAddresses: [
      {
        product: 'Classic T-Shirt',
        address: '123 Main St, Anytown, CA 91234',
      },
      {
        product: 'Denim Jeans',
        address: '456 Oak Ave, Somecity, NY 56789',
      },
      {
        product: 'Running Shoes',
        address: '789 Pine Ln, Othertown, TX 10112',
      },
      {
        product: 'Winter Jacket',
        address: '100 Snow Rd, Coldtown, AK 99999',
      },
      {
        product: 'Summer Dress',
        address: '200 Sun Blvd, Hotcity, FL 33333',
      },
      {
        product: 'Casual Hoodie',
        address: '300 Cozy Ln, Chillville, WA 98000',
      },
    ],
  });

  useEffect(() => {
    // Simulate fetching data (replace with actual API calls)
  }, []);

  return (
    <div className="orderSummary_container_unique">
      <div className="orderSummary_innerContainer_unique">
        <h1 className="orderSummary_title_unique">Order Summary</h1>

        <div className="orderSummary_grid_unique">
          <div className="orderSummary_card_unique">
            <h2 className="orderSummary_cardTitle_unique">Sales Reports</h2>
            <div className="orderSummary_cardContent_unique">
            <p><strong>Daily Revenue:</strong> ₹{salesData.dailyRevenue}</p>
            <p><strong>Weekly Revenue:</strong> ₹{salesData.weeklyRevenue}</p>
            <p><strong>Monthly Revenue:</strong> ₹{salesData.monthlyRevenue}</p>
            </div>
          </div>

          <div className="orderSummary_card_unique">
            <h2 className="orderSummary_cardTitle_unique">Product Performance</h2>
            <h3 className="orderSummary_cardSubtitle_unique">Bestsellers:</h3>
            <ul className="orderSummary_list_unique">
              {salesData.bestSellers.map((item, index) => (
                <li key={index} className="orderSummary_listItem_unique">
                  {item.name}: {item.sales} sales
                </li>
              ))}
            </ul>
          </div>

          <div className="orderSummary_card_unique">
            <h2 className="orderSummary_cardTitle_unique">Traffic Stats</h2>
            <p>
              <strong>Visitor Demographics:</strong> Age {salesData.visitorDemographics.age}, Location {salesData.visitorDemographics.location}, Gender {salesData.visitorDemographics.gender}
            </p>
            <p><strong>Referral Sources:</strong> {salesData.referralSources.join(', ')}</p>
          </div>

          <div className="orderSummary_card_unique">
            <h2 className="orderSummary_cardTitle_unique">General Stats</h2>
            <p><strong>Number of Sales:</strong> {salesData.numberOfSales}</p>
          </div>

          <div className="orderSummary_card_unique orderSummary_fullWidth_unique">
            <h2 className="orderSummary_cardTitle_unique">Shipping Addresses</h2>
            <ul className="orderSummary_list_unique">
              {salesData.shippingAddresses.map((item, index) => (
                <li key={index} className="orderSummary_listItem_unique">
                  <strong>{item.product}:</strong> {item.address}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;