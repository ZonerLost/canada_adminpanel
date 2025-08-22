import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Minimal auth layout shell.
 * Keeps the dark theme background consistent across all auth pages.
 */
const AuthLayout = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(110,86,207,0.10), transparent 60%), radial-gradient(900px 500px at 90% 90%, rgba(212,175,55,0.10), transparent 60%), #12131A",
      }}
    >
      <Outlet />
    </div>
  );
};

export default AuthLayout;
