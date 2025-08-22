import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import DashboardContent from "../Pages/MainDashboard";
import DashboardLayout from "../layouts/SiteLayout";
import AuthLayout  from "../layouts/AuthLayout"
import UsersPage from "../Pages/UsersPage";
import ContentPage from "../Pages/ContentPage";
import LiveEventsPage from "../Pages/LiveEventsPage";
import DealsPartnersPage from "../Pages/DealsPartnersPage";
import BrokersReferralsPage from "../Pages/BrokersReferralsPage";
import MessagingCommunityPage from "../Pages/MessagingCommunityPage";
import SupportMediaSettingsPage from "../Pages/SupportMediaSettingsPage"
import LoginPage from "../Pages/Auth/Login"


// --- Router ---
const Router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardContent /> },
      { path: "users-memberships", element: <UsersPage /> },
      { path: "content", element: <ContentPage /> },
      { path: "live-events", element: <LiveEventsPage /> },
      { path: "deals", element: <DealsPartnersPage /> },
      { path: "brokers", element: <BrokersReferralsPage /> },
      { path: "messaging", element: <MessagingCommunityPage /> },
      { path: "support-settings", element: <SupportMediaSettingsPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
]);

export default Router;
