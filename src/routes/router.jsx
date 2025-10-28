import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";
import AdminLayout from "../layouts/AdminLayout.jsx";
import Loading from "../components/Loading.jsx";
import Fallback from "../components/Fallback.jsx";

// Public
const Login = lazy(() => import("../auth/Login.jsx"));

// Dashboard
const Dashboard = lazy(() => import("../modules/dashboard/Dashboard.jsx"));

// People
const CaregiversList = lazy(() =>
  import("../modules/people/pages/CaregiversList.jsx")
);
const EmployersList = lazy(() =>
  import("../modules/people/pages/EmployersList.jsx")
);
const PendingQueue = lazy(() =>
  import("../modules/people/pages/PendingQueue.jsx")
);
const UserDetail = lazy(() => import("../modules/people/pages/UserDetail.jsx"));

// Listings & Matching
const ListingsList = lazy(() =>
  import("../modules/listings-matching/pages/ListingsList.jsx")
);
const MatchList = lazy(() =>
  import("../modules/listings-matching/pages/MatchList.jsx")
);
const Rules = lazy(() =>
  import("../modules/listings-matching/pages/Rules.jsx")
);

// Messaging & Safety
const Conversations = lazy(() =>
  import("../modules/messaging-safety/pages/Conversations.jsx")
);
const ReportsQueue = lazy(() =>
  import("../modules/messaging-safety/pages/ReportsQueue.jsx")
);
const Policies = lazy(() =>
  import("../modules/messaging-safety/pages/Policies.jsx")
);

// Monetization
const Subscriptions = lazy(() =>
  import("../modules/monetization/pages/Subscriptions.jsx")
);
const Boosts = lazy(() => import("../modules/monetization/pages/Boosts.jsx"));
const Pricing = lazy(() => import("../modules/monetization/pages/Pricing.jsx"));

// Content & L10n
const Strings = lazy(() => import("../modules/content-l10n/pages/Strings.jsx"));
const Pages = lazy(() => import("../modules/content-l10n/pages/Pages.jsx"));
const Tutorials = lazy(() =>
  import("../modules/content-l10n/pages/Tutorials.jsx")
);
const Templates = lazy(() =>
  import("../modules/content-l10n/notifications/Templates.jsx")
);
const Campaigns = lazy(() =>
  import("../modules/content-l10n/notifications/Campaigns.jsx")
);
const Logs = lazy(() =>
  import("../modules/content-l10n/notifications/Logs.jsx")
);
// Settings
const Settings = lazy(() => import("../modules/settings/Settings.jsx"));
// FAQ
const FAQ = lazy(() => import("../modules/faq/pages/FAQ.jsx"));

const withSuspense = (el) => <Suspense fallback={<Fallback />}>{el}</Suspense>;

const router = createBrowserRouter([
  // Public routes
  {
    path: PATHS.AUTH.LOGIN,
    element: withSuspense(<Login />),
  },

  // Authenticated shell
  {
    path: PATHS.ROOT,
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<Dashboard />),
      },

      // People
      {
        path: "people",
        children: [
          { index: true, element: withSuspense(<CaregiversList />) },
          { path: "caregivers", element: withSuspense(<CaregiversList />) },
          { path: "employers", element: withSuspense(<EmployersList />) },
          { path: "pending", element: withSuspense(<PendingQueue />) },
          { path: ":id", element: withSuspense(<UserDetail />) },
        ],
      },

      // Listings & Matching
      {
        path: "listings",
        children: [
          { index: true, element: withSuspense(<ListingsList />) },
          { path: "matches", element: withSuspense(<MatchList />) },
          { path: "rules", element: withSuspense(<Rules />) },
        ],
      },

      // Messaging & Safety
      {
        path: "messaging",
        children: [
          { index: true, element: withSuspense(<Conversations />) },
          { path: "conversations", element: withSuspense(<Conversations />) },
          { path: "reports", element: withSuspense(<ReportsQueue />) },
          { path: "policies", element: withSuspense(<Policies />) },
        ],
      },

      // Monetization
      {
        path: "billing",
        children: [
          { index: true, element: withSuspense(<Subscriptions />) },
          { path: "subscriptions", element: withSuspense(<Subscriptions />) },
          { path: "boosts", element: withSuspense(<Boosts />) },
          { path: "pricing", element: withSuspense(<Pricing />) },
        ],
      },

      // Content & L10n
      {
        path: "content",
        children: [
          { index: true, element: withSuspense(<Strings />) },
          { path: "strings", element: withSuspense(<Strings />) },
          { path: "pages", element: withSuspense(<Pages />) },
          { path: "tutorials", element: withSuspense(<Tutorials />) },
          {
            path: "notifications",
            children: [
              { index: true, element: withSuspense(<Templates />) },
              { path: "templates", element: withSuspense(<Templates />) },
              { path: "campaigns", element: withSuspense(<Campaigns />) },
              { path: "logs", element: withSuspense(<Logs />) },
            ],
          },
        ],
      },

      // FAQ
      {
        path: "faq",
        element: withSuspense(<FAQ />),
      },

      // Settings
      {
        path: "settings",
        element: withSuspense(<Settings />),
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <div className="card p-6">Not Found</div>,
  },
]);

export default router;
