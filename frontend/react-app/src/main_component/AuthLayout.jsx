import { Outlet } from "react-router-dom";
import AtlasBackground from "./AtlasBackground";
import "../styles/AuthLayout.css";

function AuthLayout() {
  return (
    <div className="atlas-auth-layout">
      <AtlasBackground />

      <main className="atlas-auth-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
