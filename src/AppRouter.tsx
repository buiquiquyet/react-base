import "./style.scss";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "@/app/auth/Login";
import { Suspense, lazy, useEffect } from "react";
import { validateUser } from "./redux/api/admin/userCrud";
import { BuildParams } from "./utils/BuildParams";
import { toast } from "react-toastify";
import { ERole } from "./layout/component/constances/roleUser";
const Auth = lazy(() => import("./app/auth/Auth"));
const AdminSetting = lazy(() => import("./app/admin/AdminSetting"));
const TeacherSetting = lazy(() => import("./app/teacher/TeacherSetting"));

function AppRouter() {
  const navigate = useNavigate();
  useEffect(() => {
    const validate = async () => {
      const token = BuildParams.getLocalStorage("token");
      if (token) {
        const rs = await validateUser(token);
        if (rs.data.error) {
          navigate("/");
        }
      }
    };
    validate();
  }, []);
  return (
    <Suspense>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/" element={<Navigate to={"/auth/login"} />} />
        <Route path="*" element={<Login />} />
        <Route path="/admin/*" element={<AdminSetting />} />
        <Route path="/teacher/*" element={<TeacherSetting />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
