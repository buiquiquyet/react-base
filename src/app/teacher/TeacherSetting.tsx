import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./styles/TeacherSetting.scss";
import ItemSingle from "../../layout/component/sidebar/ItemSingle";
import SVG from "react-inlinesvg";
import Spinner from "@/helper/Spinner";
import { useContext, useEffect, useState } from "react";
import SideBarAdmin from "../../layout/component/sidebar/SideBarAdmin";
import { BuildParams } from "@/utils/BuildParams";
import TeacherProfile from "./teacher-profile/TeacherProfile";
import { MyContext } from "@/AppRouter";
// import TeacherProfile from "./teacher-profile-instructor/TeacherProfileInstructor";

interface TeacherSettingRoute {
  title: string;
  icon: string;
  key: string;
  element?: JSX.Element;
}
const TeacherSettingsRoutes: TeacherSettingRoute[] = [
  {
    title: "Hồ sơ giảng dạy",
    icon: "intructor-profile",
    key: "teacher-record",
    element: <TeacherProfile />,
  },
  {
    title: "Hồ sơ chủ nhiệm",
    icon: "chairman-profile",
    key: "teacher-instructor",
    element: <TeacherProfile />,
  },
  
];
function TeacherSetting() {
  const location = useLocation();
  const navigate = useNavigate();
  const dataUserContext: any = useContext(MyContext)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeSpinner = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timeSpinner);
  }, []);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="container-fluid t-setting">
          <div className="row ">
            <SideBarAdmin title="Giáo viên">
              <div className="d-flex">
                {TeacherSettingsRoutes.map((route, i) => (
                  <ItemSingle
                    key={i}
                    classNameString={route.key}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      if (location.pathname.split("/")[2] !== route.key) {
                        // navigate("/" + route.key, { replace: true });
                        navigate("/teacher/" + route.key);
                      }
                    }}
                    isActived={location.pathname.split("/")[2] === route.key}
                    icon={route.icon}
                    title={route.title}
                  />
                ))}
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="fw-bold" style={{color:"white"}}>
                  {dataUserContext && dataUserContext.hodem + " " + dataUserContext.ten}
                </div>
                <div
                  onClick={() => {
                    navigate("/");
                    BuildParams.removeLocalStorage("token");
                  }}
                >
                  <SVG
                    src={import.meta.env.VITE_PUBLIC_URL + "/icons/logout.svg"}
                    fill="white"
                    height="1.6rem"
                    width="1.6rem"
                  ></SVG>
                </div>
              </div>
            </SideBarAdmin>
            <div className="app-right ">
              <Routes>
                {TeacherSettingsRoutes.map((route, i) => (
                  <Route
                    key={i}
                    path={`${route.key}`}
                    element={route.element}
                  ></Route>
                ))}
                <Route
                  index
                  element={<Navigate to="/teacher/teacher-record" />}
                />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherSetting;
