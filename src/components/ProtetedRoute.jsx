// import Spinner from "../ui/Spinner";
// import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import cookiejs from 'cookiejs';
// const FullPage = styled.div`
//   height: 100vh;
//   background-color: var(--color-grey-50);
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  // 1. Load the authenticated user
  //   const { isLoading, isAuthenticated } = useUser();
  const admin = cookiejs.get("admin");

  // 2. If there is NO authenticated user, redirect to the /login
  useEffect(() => {
    if (!admin) {
      // No admindata stored in local storage
      navigate("/login");
    }
  }, [navigate, admin]);
  //   useEffect(
  //     function () {
  //       if (!isAuthenticated && !isLoading) navigate("/login");
  //     },
  //     [isAuthenticated, isLoading, navigate]
  //   );

  // 3. While loading, show a spinner
  //   if (isLoading)
  //     return (
  //       <FullPage>
  //         <Spinner />
  //       </FullPage>
  //     );

  // 4. If there IS a user, render the app
  if (admin) return children;
  // if (isAuthenticated) return children;
  //   return children;
};

export default ProtectedRoute;
