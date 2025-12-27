import { Sidebar, Container } from "../components";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "../features/auth/authSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      dispatch(getProfile());
    }
  }, [dispatch, user, loading]);

  if (!isAuthenticated && !loading) {
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