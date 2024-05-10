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
import { ERole, EUrlRouter } from "./layout/component/constances/roleUser";

const Auth = lazy(() => import("./app/auth/Auth"));
const AdminSetting = lazy(() => import("./app/admin/AdminSetting"));
const TeacherSetting = lazy(() => import("./app/teacher/TeacherSetting"));
const TbtSetting = lazy(() => import("./app/tbt/TbtSetting"));
export const MyContext = createContext(null);
function AppRouter() {
  const navigate = useNavigate();
  const [roleUser, setRoleUser] = useState("");
  const [dataUser, setDataUser] = useState(null);

  const validate = async () => {
    const token = BuildParams.getLocalStorage("token");
    if (token) {
      const rs = await validateUser(token);
      if (rs.data.error) {
        navigate(EUrlRouter.SW_DEFAULT);
        return;
      } else {
        setRoleUser(rs.data.dataUser.nhom_id);
        setDataUser(rs.data.dataUser);
      }
      return;
    }
  };
  useEffect(() => {
    if (!BuildParams.compare(EUrlRouter.SW_DEFAULT)) {
      validate();
    }
  }, [location.pathname]);
  useEffect(() => {
    validate();
  }, []);
  useEffect(() => {
    if (roleUser)
      navigate(
        roleUser === ERole.ADMIN
          ? EUrlRouter.SW_ADMIN
          : roleUser === ERole.GVCN
          ? EUrlRouter.SW_TEACHER
          : EUrlRouter.SW_TBT
      );
  }, [roleUser]);
  return (
    <>
      <MyContext.Provider value={dataUser}>
        <Suspense>
          <Routes>
            <Route path={`${EUrlRouter.SW_AUTH}/*`} element={<Auth />} />
            <Route path="*" element={<Login />} />
            {roleUser && roleUser === ERole.ADMIN ? (
              <Route
                path={`${EUrlRouter.SW_ADMIN}/*`}
                element={<AdminSetting />}
              />
            ) : roleUser === ERole.GVCN ? (
              <Route
                path={`${EUrlRouter.SW_TEACHER}/*`}
                element={<TeacherSetting />}
              />
            ) : (
              <Route path={`${EUrlRouter.SW_TBT}/*`} element={<TbtSetting />} />
            )}
          </Routes>
        </Suspense>
      </MyContext.Provider>
    </>
  );
}

export default AppRouter;
