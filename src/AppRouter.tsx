import "./style.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/app/auth/Login";
import { lazy } from "react";
const Auth = lazy(() => import('./app/auth/Auth'))
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
        {/* <Route path="*" element={<Login />} /> */}
      </Routes>
  );
}

export default AppRouter;
