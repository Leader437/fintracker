import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MainLayout, AuthLayout } from "./layouts";
import {
  CurrentExpenses,
  PreviousExpenses,
  Export,
  Account,
  LoginRegister,
} from "./pages/index.js";
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast-mobile.css";
import { getProfile, refreshToken, logout } from "./features/auth/authSlice";
import { useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <CurrentExpenses />,
      },
      {
        path: "current-expenses",
        element: <CurrentExpenses />,
      },
      {
        path: "previous-expenses",
        element: <PreviousExpenses />,
      },
      {
        path: "export",
        element: <Export />,
      },
      {
        path: "account",
        element: <Account />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "auth", element: <LoginRegister /> },
      // don't need these since using query params to determine mode, but good practice that even if someone goes directly to these routes they redirect to relevant auth (login or signup) route
      {
        path: "login",
        loader: () => redirect("/auth?mode=login"),
      },
      {
        path: "signup",
        loader: () => redirect("/auth?mode=signup"),
      },
      {
        path: "forgot-password",
        loader: () => redirect("/auth?mode=forgot-password"),
      },
    ],
  },
]);

function AuthPersistence() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(getProfile()).unwrap();
      } catch {
        try {
          await dispatch(refreshToken()).unwrap();
          await dispatch(getProfile()).unwrap();
        } catch {
          await dispatch(logout()); // Explicitly log out if both checks fail
        }
      }
      setChecking(false);
    };
    checkAuth();
  }, [dispatch]);

  // Expose loading state for layouts/routes
  return checking;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthPersistence />
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Provider>
  </StrictMode>
);
