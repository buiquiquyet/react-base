import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./styles/AdminSetting.scss";
import ItemSingle from "../../layout/component/sidebar/ItemSingle";
import SVG from "react-inlinesvg";
import IntructorProfile from "./InstructorProfile";
import ChairmanProfile from "./ChairmanProfile";
import Spinner from "@/helper/Spinner";
import { useEffect, useState } from "react";
import SideBarAdmin from "../../layout/component/sidebar/SideBarAdmin";
import UserManagement from "./UserManagement/UserManagement";
interface AdminSettingRoute {
  title: string;
  icon: string;
  key: string;
  element?: JSX.Element;
}
const AdminSettingsRoutes: AdminSettingRoute[] = [
  {
    title: "Người dùng",
    icon: "user-managerment",
    key: "user-managerment",
    element: <UserManagement />,
  },
  {
    title: "Hồ sơ giảng viên",
    icon: "intructor-profile",
    key: "intructor-profile",
    element: <IntructorProfile />,
  },
  {
    title: "Hồ sơ chủ nhiệm",
    icon: "chairman-profile",
    key: "chairman-profile",
    element: <ChairmanProfile />,
  },
];
function AdminSetting() {
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
        <div className="container-fluid a-setting">
          <div className="row d-flex">
            <SideBarAdmin title="Admin">
              <div className="mt-4">
                {AdminSettingsRoutes.map((route, i) => (
                  <ItemSingle
                    key={i}
                    classNameString={route.key}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      if (location.pathname.split("/")[2] !== route.key) {
                        // navigate("/" + route.key, { replace: true });
                        navigate("/admin/" + route.key);
                      }
                    }}
                    isActived={location.pathname.split("/")[2] === route.key}
                    icon={route.icon}
                    title={route.title}
                  />
                ))}
              </div>
              <div className="logout-icon" onClick={() => navigate("/")}>
                <SVG
                  src={import.meta.env.VITE_PUBLIC_URL + "/icons/logout.svg"}
                  fill="white"
                  height="1.6rem"
                  width="1.6rem"
                ></SVG>
              </div>
            </SideBarAdmin>

            <div className="app-right offset-xl-1 ">
              <Routes>
                {AdminSettingsRoutes.map((route, i) => (
                  <Route
                    key={i}
                    path={`${route.key}`}
                    element={route.element}
                  ></Route>
                ))}
                <Route
                  index
                  element={<Navigate to="/admin/user-managerment" />}
                />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSetting;
