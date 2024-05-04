import "./style.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/app/auth/Login";
import { lazy } from "react";
import { useSelector } from "react-redux";
import { RoleSlice } from "./redux/reducer/selector";
import { ERole } from "./layout/component/constances/roleUser";
const Auth = lazy(() => import("./app/auth/Auth"));
const AdminSetting = lazy(() => import("./app/admin/AdminSetting"));
function AppRouter() {
  const { role } = useSelector(RoleSlice);

  return (
    <Routes>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/" element={<Navigate to={"/auth/login"} />} />
      <Route path="*" element={<Login />} />
      {role === ERole.ADMIN && (
        <Route path="/admin/*" element={<AdminSetting />} />
      )}
    </Routes>
  );
}

export default AppRouter;
