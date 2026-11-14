import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { RightColumn } from "./RightColumn";

// Three columns like X on the web: menu | content | suggestions
export const AppLayout = () => {
  return (
    <div className="x-shell">
      <Sidebar />
      <main className="x-main">
        <Outlet />
      </main>
      <RightColumn />
    </div>
  );
};