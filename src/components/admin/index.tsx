"use client";
import Link from "next/link";
import styled from "styled-components";

const AdminHome = () => {
  return (
    <StyledAdminHomeContainer>
      <StyledAdminHomeTitle>Admin Panel</StyledAdminHomeTitle>
      <StyledAdminHomeLinks>
        {[
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Product Management", path: "/admin/product-management" },
          { name: "Analytics & Details", path: "/admin/order-details" },
          { name: "Promotional Code", path: "/admin/promotional-code" },
          { name: "Stock Management", path: "/admin/stock-management" },
        ].map((item) => (
          <Link key={item.name} href={item.path} passHref>
            <StyledAdminHomeButton>
              {item.name}
            </StyledAdminHomeButton>
          </Link>
        ))}
      </StyledAdminHomeLinks>
    </StyledAdminHomeContainer>
  );
};

// Styled Components
const StyledAdminHomeContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  color: #343a40;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const StyledAdminHomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  padding-left: 1rem;
  color: #212529;
  border-left: 4px solid #6c5ce7;
`;

const StyledAdminHomeLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 1rem;
`;

const StyledAdminHomeButton = styled.button`
  width: 80vw;
  height: 100px;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  background-color: white;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: #6c5ce7;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
    color: #6c5ce7;
  }

  @media (min-width: 768px) {
    width: 60vw;
  }
  
  @media (min-width: 1024px) {
    width: 40vw;
  }
`;

export default AdminHome;