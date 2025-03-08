"use client";

import Link from "next/link";
import styled from "styled-components";

const AdminHome = () => {
  return (
    <StyledAdminHomeContainer>
      <StyledAdminHomeTitle>Admin Panel</StyledAdminHomeTitle>
      <StyledAdminHomeLinks>
        {[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Product Management", path: "/product-management" },
          { name: "Analytics & Details", path: "/order-details" },
          { name: "Promotional Code", path: "/promotional-code" },
          { name: "Stock Management", path: "/stock-management" },
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
  background-color: #f6f0f0;
  color: #bdb395;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const StyledAdminHomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding-left: 1rem;
  padding-top: 1rem;
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
  font-weight: bold;
  color: black;
  background-color: #d5c7a3;
  border: 2px solid black;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    background-color: #bdb395;
    color: white;
  }

  @media (min-width: 768px) {
    width: 60vw;
  }

  @media (min-width: 1024px) {
    width: 40vw;
  }
`;

export default AdminHome;













// "use client";

// import Link from "next/link";

// const AdminHome = () => {
//   return (
//     <div className="min-h-screen bg-[#f6f0f0] text-[#bdb395] flex flex-col p-8">
//       <h1 className="text-[2.5rem] font-bold mb-8 pl-4 pt-4">Admin Panel</h1>
//       <div className="flex flex-col items-center justify-center flex-grow gap-4">
//         {[
//           { name: "Dashboard", path: "/dashboard" },
//           { name: "Product Management", path: "/product-management" },
//           { name: "Analytics & Details", path: "/order-details" },
//           { name: "Promotional Code", path: "/promotional-code" },
//           { name: "Stock Management", path: "/stock-management" },
//         ].map((item) => (
//           <Link key={item.name} href={item.path} passHref>
//             <button style={{backgroundColor: "#d5c7a3"}} className="w-[80vw] h-[100px] p-4 text-2xl font-bold text-black bg-[#d5c7a3] border-2 border-black rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 hover:bg-[#bdb395] hover:text-white md:w-[60vw] lg:w-[40vw]">
//               {item.name}
//             </button>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminHome;









