import { useFormik } from "formik";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import * as Yup from "yup";
const initialValues = {
  email: "",
};
function ForgotPassword() {
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

      return errors;
    },
  });
  const handleBlur = (fieldName: string) => {
    formik.setFieldTouched(fieldName, true);
  };
  const handleFocus = (fieldName: string) => {
    formik.setFieldTouched(fieldName, false);
  };
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

            <form>
              <div className="d-flex flex-column gap-3 align-items-center justify-content-center justify-content-lg-start">
                <div className="lead fw-bold mb-4 ">Quên mật khẩu</div>
              </div>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <img
                  src={
                    import.meta.env.VITE_PUBLIC_URL +
                    "/images/login/forgot-pass.jpg"
                  }
                  style={{ height: "auto", width: "150px" }}
                />
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
                  style={{ fontSize: "18px" }}
                  placeholder="Nhập địa chỉ email"
                  onBlur={() => handleBlur("email")}
                  onFocus={() => handleFocus("email")}
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className="mess-invalid mt-1">{formik.errors.email}</div>
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
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
