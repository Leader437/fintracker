import { Sidebar, Container } from "../components";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProfile } from "../features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user && !loading) {
        setChecking(true);
        await dispatch(getProfile());
        setChecking(false);
      } else {
        setChecking(false);
      }
    };
    checkAuth();
  }, [dispatch, user, loading]);

  if (checking || loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return (
    <div>
      <Sidebar />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default MainLayout;