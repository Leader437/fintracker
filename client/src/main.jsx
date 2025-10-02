import { StrictMode } from "react";
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
import { Provider } from "react-redux";
import { store } from "./store/store.js";

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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
