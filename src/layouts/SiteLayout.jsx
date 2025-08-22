import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../Components/ui/section/LeftSidebar";
import Header from "../Components/ui/section/Header";
import RightSidebar from "../Components/ui/section/RightSidebar";

const COLORS = {
  bg: "#0B0B0F",       // Onyx (app background)
  bg2: "#12131A",      // Charcoal (content surface)
  card: "#161821",     // Card surface
  ring: "rgba(110,86,207,0.20)", // subtle purple ring
};

const DashboardLayout = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden relative"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* Left Sidebar */}
      <LeftSidebar isOpen={leftSidebarOpen} setIsOpen={setLeftSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onMenuClick={() => setLeftSidebarOpen(true)}
          // Using notifications icon to open Right Sidebar (keep or add a separate prop if you prefer)
          onNotificationClick={() => setRightSidebarOpen(true)}
        />

        {/* Main Page Scrollable Area */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-5"
          style={{
            backgroundColor: COLORS.bg2,
            borderTop: `1px solid ${COLORS.ring}`,
          }}
        >
          {/* Optional max-width wrapper for nicer reading width */}
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={rightSidebarOpen}
        setIsOpen={setRightSidebarOpen}
      />
    </div>
  );
};

export default DashboardLayout;
