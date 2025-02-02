import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Input } from "antd";
import BaseButton from "@/layout/component/base-button/BaseButton";
import BaseSelect from "@/layout/component/base-select/BaseSelect";
import BaseDialog from "@/layout/modal/BaseDialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Fragment, useEffect, useState } from "react";
import BaseMessageLog from "@/layout/modal/BaseMessageLog";
import {
  getTenDangNhapUsers,
  updateUser,
  getUserById,
} from "@/redux/api/admin/userCrud";
import { createUser } from "@/redux/api/admin/userCrud";
import { UserModal } from "../modal/userModal";
import {
  ToastMessage,
  ToastStatus,
} from "@/layout/component/constances/toast-dialog";
import { ErrorMessage } from "@/layout/component/constances/error-code.const";
interface DialogProps {
  optionsCV?: any;
  optionsDe?: any;
  optionsCl?: any;
  selectedOptionCV?: any;
  selectedOptionDe?: any;
  selectedOptionCl?: any;
  onChangeCV: (value: any) => void;
  onChangeDe: (value: any) => void;
  onChangeCl: (value: any) => void;
  onClickDialog: () => void;
  valueRadio?: any;
  onChangRadio: (value: any) => void;
  handleFecthUser: () => void;
  typeDialog?: string;
  idUser?: any;
}

const initialValues = {
  tendangnhap: "",
  matkhau: "",
  hodem: "",
  ten: "",
  nhom_id: "",
  id_khoa: "",
  lop: "",
  email: "",
  gioitinh: "",
  ngaysinh: "",
  diachi: "",
  dienthoai: "",
};

const DialogUserManagerment: React.FC<DialogProps> = ({
  optionsCV,
  optionsDe,
  optionsCl,
  selectedOptionCV,
  selectedOptionDe,
  selectedOptionCl,
  onChangeCV,
  onChangeDe,
  onChangeCl,
  onClickDialog,
  valueRadio,
  onChangRadio,
  handleFecthUser,
  idUser,
}) => {
  const firstDiv = [
    {
      label: "Tên đăng nhập",
      type: "text",
      name: "tendangnhap",
      callback: () => handleCheckTenDangNhap(formik.values.tendangnhap),
    },
    {
      label: "Mật khẩu",
      type: "text",
      name: "matkhau",
    },
    {
      label: "Họ đệm",
      type: "text",
      name: "hodem",
    },
    {
      label: "Tên",
      type: "text",
      name: "ten",
    },
  ];
  const secondDiv = [
    {
      label: "Chức vụ",
      options: optionsCV,
      placeholder: "Chọn chức vụ...",
      callback: onChangeCV,
      value: selectedOptionCV,
      // name: "nhom_id",
    },
    {
      label: "Khoa",
      options: optionsDe,
      placeholder: "Chọn id_khoa...",
      callback: onChangeDe,
      value: selectedOptionDe,
      // name: "id_khoa",
    },
    {
      label: "Lớp",
      options: optionsCl,
      placeholder: "Chọn lớp...",
      callback: onChangeCl,
      value: selectedOptionCl,
      // name: "lop",
    },
  ];

  const thirdDiv = [
    { label: "Ngày sinh", type: "date", name: "ngaysinh", value: "ngaysinh" },
    { label: "Email", type: "text", name: "email", value: "email" },
    { label: "Địa chỉ", type: "text", name: "diachi", value: "diachi" },
    {
      label: "Số điện thoại",
      type: "text",
      name: "dienthoai",
      value: "dienthoai",
    },
  ];
  const [tdnUserCheck, setTdnUserCheck] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [dataUser, setDataUser] = useState<UserModal>(initialValues);
  // const [dataUserUpdate, setDataUserUpdate] = useState<UserModal>()
  const DialogSchema = Yup.object().shape({
    tendangnhap: Yup.string()
      .notOneOf(
        idUser === "" ? [tdnUserCheck] : [],
        "Tên đăng nhập đã được sử dụng. Vui lòng đổi tên khác"
      )
      .required("Trường này bắt buộc nhập")
      .min(6, "Tên đăng nhập tối thiểu 6 ký tự")
      .max(50, "Tên đăng nhập tối đa 50 ký tự")
      .matches(
        /^[a-zA-Z0-9_]+$/i,
        "Trường này không nhập ký tự đặc biệt và khoảng trắng"
      ),
    hodem: Yup.string()
      .required("Trường này bắt buộc nhập")
      .max(50, "Tên đăng nhập tối đa 50 ký tự"),
    ten: Yup.string()
      .required("Trường này bắt buộc nhập")
      .max(50, "Tên đăng nhập tối đa 50 ký tự"),
    matkhau: Yup.string()
      .min(4, "Mật khẩu phải có ít nhất 4 ký tự")
      .max(100, "Mật khẩu chỉ tối đa 20 ký tự")
      .required("Mật khẩu không được bỏ trống")
      .matches(
        /^[a-zA-Z0-9_]+$/i,
        "Trường này không nhập ký tự đặc biệt và khoảng trắng"
      ),
    // dienthoai: Yup.string().matches(
    //   /^\d*$/,
    //   "Số điện thoại chỉ được chứa ký tự số"
    // ),
  });

  const formik = useFormik({
    initialValues: dataUser,
    enableReinitialize: true,
    validationSchema: DialogSchema,
    onSubmit: (values) => {
      const user = {
        ...values,
        gioitinh: valueRadio,
        id_khoa: selectedOptionDe,
        lop: selectedOptionCl,
        nhom_id: selectedOptionCV,
      };
      if (idUser) {
        updateUser(idUser, user)
          .then((res: any) => {
            setDisabledBtn(true);
            ToastMessage.show(ToastStatus.success, res.data.message, () => {
              onClickDialog();
              handleFecthUser();
            });
          })
          .catch(() => {
            ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
          });
      } else {
        createUser(user)
          .then((res: any) => {
            if (res.data.message) {
              setDisabledBtn(true);
              ToastMessage.show(ToastStatus.success, res.data.message, () => {
                onClickDialog();
                handleFecthUser();
              });
            } else {
              ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
            }
          })
          .catch(() => {
            ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
          });
      }
    },
  });
  const handleBlur = (fieldName: any) => {
    formik.setFieldTouched(fieldName, true);
  };
  const handleFocus = (fieldName: any) => {
    formik.setFieldTouched(fieldName, false);
  };
  const handleCheckTenDangNhap = (tendangnhap: string) => {
    if (tendangnhap) {
      getTenDangNhapUsers(tendangnhap)
        .then((res: any) => {
          if (res.data.message) {
            setTdnUserCheck(res.data?.data.tendangnhap);
          } else {
            setTdnUserCheck("");
          }
        })
        .catch(() => {
          setTdnUserCheck("");
        });
    }
  };

  const fecthDataUserById = (idUser: any) => {
    getUserById(idUser)
      .then((res: any) => {
        if (res.data.message) {
          const data = res.data.data;
          setDataUser(data);
          onChangeCV(data.nhom_id);
          onChangeDe(data.id_khoa);
          onChangeCl(data.lop);
          onChangRadio(data.gioitinh);
        }
      })
      .catch(() => {
        ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
      });
  };
  const renderElementFistDiv = (
    label: string,
    typeInput?: string,
    name?: string,
    callback?: (value: string) => void
  ) => {
    return (
      <div className="dialog-item w-100">
        <FormLabel>{label}</FormLabel>
        <Input
          type={typeInput}
          name={name}
          className={`${
            formik.errors[name as keyof typeof formik.errors] &&
            formik.touched[name as keyof typeof formik.touched]
              ? "is-invalid"
              : ""
          }`}
          value={formik.values[name as keyof typeof formik.values]}
          onChange={formik.handleChange}
          onBlur={() => {
            handleBlur(name);
            if (callback)
              callback(formik.values[name as keyof typeof formik.values]);
          }}
          onFocus={() => handleFocus(name)}
        />
        {formik.errors[name as keyof typeof formik.values] &&
        formik.touched[name as keyof typeof formik.values] ? (
          <BaseMessageLog
            text={formik.errors[name as keyof typeof formik.values]}
          />
        ) : null}
      </div>
    );
  };
  const renderElementSecondDiv = (
    label?: string,
    options?: any,
    placeholder?: string,
    callback?: () => void,
    value?: any
  ) => {
    return (
      <div className="dialog-item w-100">
        <FormLabel>{label}</FormLabel>
        <BaseSelect
          options={options}
          className="w-100"
          placeholder={placeholder}
          onChangeValue={callback}
          value={value}
        />
      </div>
    );
  };
  const renderElementThirdDiv = (
    lable?: string,
    typeInput?: string,
    name?: string,
    value?: string
  ) => {
    return (
      <div className="dialog-item w-100">
        <FormLabel>{lable}</FormLabel>
        <Input
          className={`${
            formik.errors[name as keyof typeof formik.errors] &&
            formik.touched[name as keyof typeof formik.touched]
              ? "is-invalid"
              : ""
          }`}
          type={typeInput}
          name={name}
          value={formik.values[value as keyof typeof formik.values]}
          onChange={formik.handleChange}
          onBlur={() => {
            handleBlur(name);
          }}
        />
        {formik.errors[name as keyof typeof formik.values] &&
        formik.touched[name as keyof typeof formik.values] ? (
          <BaseMessageLog
            text={formik.errors[name as keyof typeof formik.values]}
          />
        ) : null}
      </div>
    );
  };

  useEffect(() => {
    if (idUser) {
      fecthDataUserById(idUser);
    }
  }, [idUser]);
  return (
    <BaseDialog
      onClickHideDialog={onClickDialog}
      label={`${idUser ? "Chỉnh sửa" : "Thêm mới"}`}
    >
      <form className="dialog-form mt-3" onSubmit={formik.handleSubmit}>
        <div className="d-flex gap-4 justify-content-between">
          <div className="col-4 d-flex flex-column gap-3">
            {firstDiv.map((item: any, index: number) => {
              return (
                <Fragment key={index}>
                  {renderElementFistDiv(
                    item.label,
                    item.type,
                    item.name,
                    item.callback
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="d-flex gap-3  col-3 flex-column">
            <div className="dialog-item">
              <FormLabel>Giới tính</FormLabel>
              <div className="d-flex justify-content-center">
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  value={valueRadio}
                  onChange={onChangRadio}
                >
                  <FormControlLabel
                    value="Nam"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel value="Nu" control={<Radio />} label="Nữ" />
                </RadioGroup>
              </div>
            </div>
            {secondDiv.map((item: any, index: any) => {
              return (
                <Fragment key={index}>
                  {renderElementSecondDiv(
                    item.label,
                    item.options,
                    item.placeholder,
                    item.callback,
                    item.value
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="d-flex flex-column flex-1 col-4 gap-3">
            {thirdDiv.map((item: any, index: any) => {
              return (
                <Fragment key={index}>
                  {renderElementThirdDiv(
                    item.label,
                    item.type,
                    item.name,
                    item.value
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <BaseButton title="Cập nhật" disabled={disabledBtn} />
        </div>
      </form>
    </BaseDialog>
  );
};

export default DialogUserManagerment;
