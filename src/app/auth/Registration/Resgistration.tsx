import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import SVG from "react-inlinesvg";
import "./style.scss";
import { Link } from "react-router-dom";
import { checkUserName, register } from "@/redux/auth/authCrud";
const initialValues = {
  name: "",
  email: "",
  password: "",
  rePassword: "",
};

function Resgistration() {
  const [isActiveEye, setIsActiveEye] = useState<boolean>(false);
  const [isActiveEyeAgain, setIsActiveEyeAgain] = useState<boolean>(false);
  const [userNameCheck, setUserNameCheck] = useState('');
  const toogleActiveEye = (idInput: string, idRef: string) => {
    idInput === "isActiveEye"
      ? setIsActiveEye(!isActiveEye)
      : setIsActiveEyeAgain(!isActiveEyeAgain);
    setTypeInput(idRef);
  };
  const setTypeInput = (idRef: string) => {
    const passElement = document.querySelector(idRef) as HTMLDivElement;
    const typePass =
      passElement?.getAttribute("type") === "text" ? "password" : "text";
    passElement.setAttribute("type", typePass);
  };
  const RegistrationSchema = Yup.object().shape({
    name: Yup.string()
    .notOneOf(
      [userNameCheck],
      "Tên đăng nhập đã được sử dụng. Vui lòng đổi tên khác"
    )
    .required("Vui lòng nhập tên đăng nhập của bạn")
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
    .max(50, "Tên đăng nhập tối đa 50 ký tự")
    .matches(/^\S+$/, "Vui lòng không nhập khoảng trắng"),
    email: Yup.string()
      .notOneOf(
        ["Tên đăng nhập đã được sử dụng"],
        "Tên đăng nhập đã được sử dụng. Vui lòng đổi tên khác"
      )
      .required("Vui lòng nhập tên đăng nhập của bạn")
      .email("Email chưa nhập đúng định dạng")
      .min(6, "Email tối thiểu 6 ký tự")
      .max(50, "Email tối đa 50 ký tự")
      .matches(/^\S+$/, "Vui lòng không nhập khoảng trắng"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(20, "Mật khẩu chỉ tối đa 20 ký tự")
      .required("Mật khẩu không được bỏ trống")
      .matches(
        /^[a-zA-Z0-9_]+$/i,
        "Vui lòng không nhập ký tự đặc biệt và khoảng trắng"
      ),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password") || null], "Xác nhận mật khẩu không chính xác.")
      .required("Mật khẩu không được bỏ trống")
      .matches(
        /^[a-zA-Z0-9_]+$/i,
        "Vui lòng không nhập ký tự đặc biệt và khoảng trắng"
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values) => {
      // register()
    },
  });
  const handleBlur = (fieldName: string) => {
    formik.setFieldTouched(fieldName, true);
  };
  const handleFocus = (fieldName: string) => {
    formik.setFieldTouched(fieldName, false);
  };
  const handleCheckUserName = (userName: string) => {
    if (userName) {
      checkUserName(userName).then((res: any) => {
        setUserNameCheck(res.data?.userName);
        if (userName === res.data?.userName) {
          formik.setFieldError(
            'name',
            'Tên đăng nhập đã tồn tại. Vui lòng đổi tên khác',
          );
        }
      });
    }
  }
  return (
    <section className="vh-100 auth-resgitration">
      <div className="container-fluid h-custom">
        <div
          className="row d-flex justify-content-center align-items-center h-100"
          style={{ position: "relative" }}
        >
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src={
                import.meta.env.VITE_PUBLIC_URL + "/images/login/logoLogin.webp"
              }
              className="img-fluid"
              alt="img"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4  offset-xl-1">
            <Link
              to={"/auth/login"}
              className="back-login d-flex align-items-center gap-2 mb-5 fw-bold"
            >
              <SVG
                src={import.meta.env.VITE_PUBLIC_URL + "/images/arrow-left.svg"}
              />
              <span>Quay lại</span>
            </Link>
            <form onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-column gap-3 align-items-center justify-content-center justify-content-lg-start">
                <div className="lead fw-bold mb-4 ">Đăng ký tài khoản</div>
              </div>
              <div data-mdb-input-init className="form-outline mb-3">
                <input
                  className={`form-control form-control-lg smaill-eye ${
                    formik.errors.name && formik.touched.name
                      ? "is-invalid"
                      : ""
                  }`}
                  maxLength={50}
                  type="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={() => {
                    handleBlur("name")
                    handleCheckUserName(formik.values.name)
                  }}
                  onFocus={() => handleFocus("name")}
                  placeholder="Tên đăng nhập"
                />
                {formik.errors.name && formik.touched.name ? (
                  <div className="mess-invalid mt-1">{formik.errors.name}</div>
                ) : null}
              </div>
              <div data-mdb-input-init className="form-outline mb-3">
                <input
                  className={`form-control form-control-lg smaill-eye ${
                    formik.errors.email && formik.touched.email
                      ? "is-invalid"
                      : ""
                  }`}
                  maxLength={50}
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={() => handleBlur("email")}
                  onFocus={() => handleFocus("email")}
                  placeholder="Nhập email của bạn"
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className="mess-invalid mt-1">{formik.errors.email}</div>
                ) : null}
              </div>

              <div
                data-mdb-input-init
                className="form-outline mb-3"
                style={{ position: "relative" }}
              >
                <input
                  className={`form-control form-control-lg smaill-eye ${
                    formik.errors.password && formik.touched.password
                      ? "is-invalid"
                      : ""
                  }`}
                  type="password"
                  name="password"
                  id="passInput"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={() => handleBlur("password")}
                  onFocus={() => handleFocus("password")}
                  placeholder="Nhập mật khẩu"
                />
                <div
                  onClick={() => toogleActiveEye("isActiveEye", "#passInput")}
                >
                  {!isActiveEye ? (
                    <img
                      src={
                        import.meta.env.VITE_PUBLIC_URL +
                        "/images/login/small_eye.svg"
                      }
                      className="small-eye"
                    />
                  ) : (
                    <img
                      src={
                        import.meta.env.VITE_PUBLIC_URL +
                        "/images/login/active_eye.svg"
                      }
                      className="small-eye"
                    />
                  )}
                </div>
                {formik.errors.password && formik.touched.password ? (
                  <div className="mess-invalid mt-1">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
              <div
                data-mdb-input-init
                className="form-outline mb-3"
                style={{ position: "relative" }}
              >
                <input
                  className={`form-control form-control-lg smaill-eye ${
                    formik.errors.rePassword && formik.touched.rePassword
                      ? "is-invalid"
                      : ""
                  }`}
                  type="password"
                  name="rePassword"
                  id="rePassInput"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={() => handleBlur("rePassword")}
                  onFocus={() => handleFocus("rePassword")}
                  placeholder="Nhập lại mật khẩu"
                />
                <div
                  onClick={() =>
                    toogleActiveEye("isActiveEyeAgain", "#rePassInput")
                  }
                >
                  {!isActiveEyeAgain ? (
                    <img
                      src={
                        import.meta.env.VITE_PUBLIC_URL +
                        "/images/login/small_eye.svg"
                      }
                      className="small-eye"
                    />
                  ) : (
                    <img
                      src={
                        import.meta.env.VITE_PUBLIC_URL +
                        "/images/login/active_eye.svg"
                      }
                      className="small-eye"
                    />
                  )}
                </div>
                {formik.errors.rePassword && formik.touched.rePassword ? (
                  <div className="mess-invalid mt-1">
                    {formik.errors.rePassword}
                  </div>
                ) : null}
              </div>
              <div className="d-flex justify-content-between align-items-center"></div>
              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: " 2.5rem", paddingRight: "2.5rem" }}
                >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Resgistration;
