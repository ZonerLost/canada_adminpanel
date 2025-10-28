import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../shell/Header";
import LeftSidebar from "../shell/LeftSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <LeftSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <Header onMenuClick={() => setSidebarOpen((s) => !s)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
