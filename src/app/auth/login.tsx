import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./styles/login.scss";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "@/helper/Spinner.tsx";
import { Link } from "react-router-dom";
const initialValues = {
  email: "",
  password: "",
};
function Login() {
  const [isActiveEye, setIsActiveEye] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const handleToogleActiveEye = () => {
    setIsActiveEye(!isActiveEye);
    const passElement = document.querySelector("#passInput") as HTMLDivElement;
    const typePass =
      passElement?.getAttribute("type") === "text" ? "password" : "text";
    passElement.setAttribute("type", typePass);
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log(values);
    },
    validate: (values) => {
      const errors: any = {};
      console.log(values);

      if (!values.email) {
        errors.email = "Vui lòng nhập email của bạn";
      } else if (!Yup.string().email().isValidSync(values.email)) {
        errors.email = "Email chưa nhập đúng định dạng";
      } else if (!Yup.string().min(3).max(50).isValidSync(values.email)) {
        errors.email = "Tên đăng nhập không hợp lệ";
      }
      if (!values.password) {
        errors.password = "Mật khẩu không được bỏ trống";
      } else if (!Yup.string().min(6).max(20).isValidSync(values.password)) {
        errors.password = "Chứa từ 6 -20 ký tự";
      } else if (
        !Yup.string()
          .matches(/^[a-zA-Z0-9_]+$/i)
          .isValidSync(values.password)
      ) {
        errors.password = "Vui lòng không nhập ký tự đặc biệt và khoảng trắng";
      }
      return errors;
    },
  });
  const handleBlur = (fieldName: string) => {
    formik.setFieldTouched(fieldName, true);
  };
  const handleFocus = (fieldName: string) => {
    formik.setFieldTouched(fieldName, false);
  };

  useEffect(() => {
    const timeSpinner = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timeSpinner);
  }, []);
  
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="vh-100 auth-login">
          <div className="container-fluid h-custom">
            <div
              className="row d-flex justify-content-center align-items-center h-100"
              style={{ position: "relative" }}
            >
              <div className="col-md-9 col-lg-6 col-xl-5">
                <img
                  src={
                    import.meta.env.VITE_PUBLIC_URL +
                    "/images/login/logoLogin.webp"
                  }
                  className="img-fluid"
                  alt="img"
                />
              </div>
              <div className="col-md-8 col-lg-6 col-xl-4  offset-xl-1">
                <form onSubmit={formik.handleSubmit}>
                  <div className="d-flex flex-column gap-3 align-items-center justify-content-center justify-content-lg-start">
                    <div className="lead fw-bold mb-3 ">Đăng nhập</div>
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-primary btn-floating p-3 pt-2 pb-2 mx-1 w-100 d-flex  "
                      style={{
                        background: "var(--background-1)",
                        border: "1px solid var(--background-1)",
                        color: "#1a202c",
                        fontWeight: "initial",
                      }}
                    >
                      <img
                        src={
                          import.meta.env.VITE_PUBLIC_URL +
                          `/images/login/new-google.svg`
                        }
                        style={{ justifyItems: "start" }}
                        alt="img"
                      />
                      <span className="flex-grow-1">Đăng nhập với Google</span>
                    </button>
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-primary btn-floating p-3 pt-2 pb-2 mx-1 w-100 d-flex  "
                      style={{
                        background: "var(--background-1)",
                        border: "1px solid var(--background-1)",
                        color: "#1a202c",
                        fontWeight: "initial",
                      }}
                    >
                      <img
                        src={
                          import.meta.env.VITE_PUBLIC_URL +
                          "/images/login/new-facebook.svg"
                        }
                        style={{ justifyItems: "start" }}
                        alt="img"
                      />
                      <span className="flex-grow-1">
                        Đăng nhập với FaceBook
                      </span>
                    </button>
                  </div>

                  <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0">Hoặc</p>
                  </div>

                  <div data-mdb-input-init className="form-outline mb-3">
                    <input
                      type="email"
                      name="email"
                      className={`form-control form-control-lg smaill-eye ${
                        formik.errors.email && formik.touched.email
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      style={{ fontSize: "18px" }}
                      placeholder="Nhập địa chỉ email"
                      onBlur={() => handleBlur("email")}
                      onFocus={() => handleFocus("email")}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <div className="mess-invalid mt-1">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>

                  <div
                    data-mdb-input-init
                    className="form-outline mb-3"
                    style={{ position: "relative" }}
                  >
                    <input
                      type="password"
                      id="passInput"
                      name="password"
                      className={`form-control form-control-lg smaill-eye ${
                        formik.errors.password && formik.touched.password
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{ fontSize: "18px" }}
                      placeholder="Nhập mật khẩu"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={() => handleBlur("password")}
                      onFocus={() => handleFocus("password")}
                    />
                    <div onClick={handleToogleActiveEye}>
                      {!isActiveEye ? (
                        <img
                          src={
                            import.meta.env.VITE_PUBLIC_URL +
                            "/images/login/small_eye.svg"
                          }
                          className="small-eye"
                          alt="img"
                        />
                      ) : (
                        <img
                          src={
                            import.meta.env.VITE_PUBLIC_URL +
                            "/images/login/active_eye.svg"
                          }
                          alt="img"
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

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check mb-0">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        value=""
                        id="form2Example3"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="form2Example3"
                      >
                        Ghi nhớ mật khẩu
                      </label>
                    </div>
                    <Link to={'/auth/forgot-password'} className="text-body forget-pass">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <div className="text-center text-lg-start mt-4 pt-2">
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-primary btn-lg"
                      style={{
                        paddingLeft: " 2.5rem",
                        paddingRight: "2.5rem",
                      }}
                    >
                      Đăng nhập
                    </button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Bạn chưa có tài khoản?
                      <Link
                        to={"/auth/registration"}
                        className="forget-pass"
                        style={{ marginLeft: "6px" }}
                      >
                        Đăng ký
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Login;