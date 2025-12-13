import { Outlet, useNavigate } from "react-router-dom";
import { SideMenu } from "./SideMenu";
import { HeaderBar } from "./headerBar";
import { useUser } from "../Context/UserContext";

export default function Layout() {

  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null; // prevent render
  }

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
