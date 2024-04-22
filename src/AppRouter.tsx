import "./style.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/app/auth/Login";
import { lazy } from "react";
const Auth = lazy(() => import("./app/auth/Auth"));
const AdminSetting = lazy(() => import("./app/admin/AdminSetting"));
function AppRouter() {
  return (
    <Routes>
      <Route path="/auth/*" element={<Auth />} />
        <Route
          path="/"
          element={
              <Navigate to={"/auth/login"} />
          }
        />
        <Route path="*" element={<Login />} />
      <Route path="/admin/*" element={<AdminSetting />} />
    </Routes>
  );
}

export default AppRouter;
