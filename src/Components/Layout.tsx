import { Outlet, useNavigate } from "react-router-dom";
import { SideMenu } from "./SideMenu";
import { useUser } from "../Context/UserContext";
import { useEffect } from "react";
import { HeaderBar } from "./HeaderBar";

export default function Layout() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // evita render enquanto redireciona
  }

  return (
    <div className="flex h-screen overflow-hidden min-w-screen">
      <div className="w-fit">
        <SideMenu />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderBar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
