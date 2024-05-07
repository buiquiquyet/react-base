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
import { useEffect, useState } from "react";
import SideBarAdmin from "../../layout/component/sidebar/SideBarAdmin";
import TeacherProfileOther from "./teacher-profile-other/TeacherProfileOther";
import { BuildParams } from "@/utils/BuildParams";
import TeacherRecord from "./teacher-record/TeacherRecord";
import TeacherProfile from "./teacher-profile/TeacherProfile";

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
    element: <TeacherRecord />,
  },
  {
    title: "Hồ sơ chủ nhiệm",
    icon: "chairman-profile",
    key: "teacher-profile",
    element: <TeacherProfile />,
  },
  {
    title: "Hồ sơ khác",
    icon: "chairman-profile",
    key: "teacher-other",
    element: <TeacherProfileOther />,
  },
];
function TeacherSetting() {
  const location = useLocation();
  const navigate = useNavigate();

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
