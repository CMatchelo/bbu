import { Outlet } from "react-router-dom";
import { SideMenu } from "./SideMenu";
import { HeaderBar } from "./headerBar";

export default function Layout() {
  return (
    <div className="flex min-h-screen min-w-screen">
      <div className="w-64">
        <SideMenu />
      </div>
      <div className="flex-1">
        <HeaderBar />
        <Outlet />
      </div>
    </div>
  );
}
