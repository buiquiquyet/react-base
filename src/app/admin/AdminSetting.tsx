import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./styles/AdminSetting.scss";
import ItemSingle from "./ItemSingle";
import SVG from "react-inlinesvg";
import IntructorProfile from "./InstructorProfile";
import ChairmanProfile from "./ChairmanProfile";
import Spinner from "@/helper/Spinner";
import { useEffect, useState } from "react";
import SideBarAdmin from "./SideBarAdmin";
import UserManagement from "./UserManagement";
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
  console.log(location.pathname.split("/")[2]);

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
                  element={<Navigate to="/admin/intructor-profile" />}
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
