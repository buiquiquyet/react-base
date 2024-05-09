import "./style.scss";
import {
  Route,
  Routes,
  // useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "@/app/auth/Login";
import { Suspense, createContext, lazy, useEffect, useState } from "react";
import { validateUser } from "./redux/api/admin/userCrud";
import { BuildParams } from "./utils/BuildParams";

const Auth = lazy(() => import("./app/auth/Auth"));
const AdminSetting = lazy(() => import("./app/admin/AdminSetting"));
const TeacherSetting = lazy(() => import("./app/teacher/TeacherSetting"));
const TbtSetting = lazy(() => import("./app/tbt/TbtSetting"));
export const MyContext = createContext(null);
function AppRouter() {
  const navigate = useNavigate();
  // const location = useLocation();

  const [roleUser, setRoleUser] = useState("");
  const [dataUser, setDataUser] = useState(null);

  const validate = async () => {
    const token = BuildParams.getLocalStorage("token");
    if (token) {
      const rs = await validateUser(token);
      if (rs.data.error) {
        navigate("/");
        return;
      } else {
        setRoleUser(rs.data.dataUser.nhom_id);
        setDataUser(rs.data.dataUser);
      }
      return;
    }
  };
  useEffect(() => {
    if (!BuildParams.compare("/")) {
      validate();
    }
  }, [location.pathname]);
  useEffect(() => {
    validate();
  }, []);
  useEffect(() => {
    if (roleUser)
      navigate(
        roleUser === "ADMIN"
          ? "/admin"
          : roleUser === "GVCN"
          ? "/teacher"
          : "/tbt"
      );
  }, [roleUser]);
  return (
    <>
      <MyContext.Provider value={dataUser}>
        <Suspense>
          <Routes>
            <Route path="/auth/*" element={<Auth />} />
            {/* <Route path="/" element={<Navigate to={"/auth/login"} />} /> */}
            <Route path="*" element={<Login />} />
            {roleUser && roleUser === "ADMIN" ? (
              <Route path="/admin/*" element={<AdminSetting />} />
            ) : roleUser === "GVCN" ? (
              <Route path="/teacher/*" element={<TeacherSetting />} />
            ) : (
              <Route path="/tbt/*" element={<TbtSetting />} />
            )}
          </Routes>
        </Suspense>
      </MyContext.Provider>
    </>
  );
}

export default AppRouter;
