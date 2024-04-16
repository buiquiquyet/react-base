import {  Route, Routes } from "react-router-dom";
import Login from "./Login";
import Resgistration from "./Registration/Resgistration";
import ForgotPassword from "./ForgotPassword";

function Auth() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="registration" element={<Resgistration />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default Auth;
