import { FormLabel } from "@mui/material";
import { Button, Input } from "antd";
import BaseButton from "@/layout/component/base-button/BaseButton";
import BaseSelect from "@/layout/component/base-select/BaseSelect";
import BaseDialog from "@/layout/modal/BaseDialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Fragment, useContext, useEffect, useState } from "react";
import BaseMessageLog from "@/layout/modal/BaseMessageLog";
import { toast } from "react-toastify";
import { TeacherModal } from "../modal/teacherModal";
import { Upload } from "antd";
import SVG from "react-inlinesvg";
import { MyContext } from "@/AppRouter";
import {
  createRecord,
  getRecordById,
  updateRecord,
} from "@/redux/api/teacher/teacherRecordCrud";
import { createFiles, deleteFiles } from "@/redux/api/teacher/fileCrud";
import config from "@/utils/config";
import { BaseIframe } from "@/layout/modal/BaseIframe";
import {
  createInstructor,
  getInstructorById,
  updateInstructor,
} from "@/redux/api/teacher/teacherInstructor";
import { BuildParams } from "@/utils/BuildParams";
interface DialogProps {
  optionsSemester?: any;
  selectedOptionSemester?: any;
  selectedClass?: any;
  onChangeSemester: (value: any) => void;
  onChangeClass: (value: any) => void;
  onClickDialog: () => void;
  handleFecthProfiles: () => void;
  typeDialog?: string;
  idProfile?: any;
  listFiles?: any[];
  optionClasses?: any[];
}

const initialValues = {
  user_id: "",
  ten_gv: "",
  lop: "",
  ten_hoc_phan: "",
  ky_id: "",
  ngay_bat_dau: "",
  ngay_ket_thuc: "",
  check: "",
};

const DialogTeahcerProfileManagerment: React.FC<DialogProps> = ({
  optionsSemester,
  selectedOptionSemester,
  onChangeSemester,
  onClickDialog,
  handleFecthProfiles,
  idProfile,
  listFiles,
  optionClasses,
  onChangeClass,
  selectedClass,
}) => {
  const dataUserContext: any = useContext(MyContext);
  const firstDiv = [
    {
      label: "  Họ tên ",
      type: "text",
      name: "ten_gv",
      value: dataUserContext.hodem + " " + dataUserContext.ten,
    },

    {
      label: "Học phần",
      type: "text",
      name: "ten_hoc_phan",
    },
  ];
  const classDiv = [
    {
      label: "Lớp",
      options: optionClasses,
      placeholder: "Chọn lớp...",
      callback: onChangeClass,
      value: selectedClass,
    },
  ];
  const secondDiv = [
    {
      label: "Đợt",
      options: optionsSemester,
      placeholder: "Chọn đợt...",
      callback: onChangeSemester,
      value: selectedOptionSemester,
    },
  ];
  const thirddDiv = [
    {
      label: "Ngày bắt đầu",
      type: "date",
      name: "ngay_bat_dau",
    },
    {
      label: "Ngày kết thúc",
      type: "date",
      name: "ngay_ket_thuc",
    },
  ];

  const [disabledBtn, setDisabledBtn] = useState(false);
  const [dataProfile, setDataProfile] = useState<TeacherModal>(initialValues);
  const [fileList, setFileList] = useState<any>([]);

  // const [dataProfileUpdate, setDataProfileUpdate] = useState<UserModal>()
  const DialogSchema = Yup.object().shape({
    ten_hoc_phan: Yup.string().required("Trường này bắt buộc nhập"),
    ngay_bat_dau: Yup.string().required("Trường này bắt buộc nhập"),
    ngay_ket_thuc: Yup.string().required("Trường này bắt buộc nhập"),
    // ky_id: Yup.string().required("Trường này bắt buộc nhập"),
  });

  const formik = useFormik({
    initialValues: dataProfile,
    enableReinitialize: true,
    validationSchema: DialogSchema,
    onSubmit: async (values) => {
      const profile = {
        ...values,
        user_id: dataUserContext.Id,
        ky_id: selectedOptionSemester,
        ten_gv: dataUserContext.hodem + " " + dataUserContext.ten,
        lop: selectedClass,
        id_khoa: dataUserContext.id_khoa
      };
      if (idProfile) {
        const rsDelFileUploads = await deleteFileUploads();
        const newFileLists = fileList.filter((file: any) => !file.Id);
        const rsFileUpload = await createFileUpload(newFileLists, idProfile);
        if (!rsFileUpload && !rsDelFileUploads) {
          toast.error("Đã xảy ra lỗi.", { autoClose: 1500 });
        } else {
          const rsUpdateProfile = BuildParams.isLocation("record")
            ? await updateRecord(idProfile, profile)
            : await updateInstructor(idProfile, profile);
          if (rsUpdateProfile.data.message) {
            setDisabledBtn(true);
            toast.success(rsUpdateProfile.data.message, {
              autoClose: 1800,
              onClose: () => {
                onClickDialog();
                handleFecthProfiles();
              },
            });
          }
        }
      } else {
        const rsCreateProfile = BuildParams.isLocation("record")
          ? await createRecord(profile)
          : await createInstructor(profile);
        if (rsCreateProfile.data.message) {
          await createFileUpload(fileList, rsCreateProfile.data.profileId);
          setDisabledBtn(true);
          toast.success(rsCreateProfile.data.message, {
            autoClose: 1800,
            onClose: () => {
              onClickDialog();
              handleFecthProfiles();
            },
          });
        }
      }
    },
  });
  const deleteFileUploads = async () => {
    const delFiles = listFiles
      ?.filter((file: any) => {
        const existsInList = fileList.some(
          (value: any) => value.Id === file.Id
        );
        return !existsInList;
      })
      .map((file: any) => file.Id);
    if (delFiles && delFiles.length > 0) {
      const rs = await deleteFiles(delFiles);
      if (rs.data.message) return true;
      return false;
    }
    return;
  };
  const createFileUpload = async (
    fileList: any,
    idProfile: string
  ): Promise<boolean> => {
    if (fileList.length > 0) {
      const promises = fileList.map((file: any) => {
        const formData = new FormData();
        formData.append("profile_id", idProfile);
        formData.append("ten", file.originFileObj);
        return createFiles(formData);
      });
      try {
        const responses = await Promise.all(promises);
        return responses.every((res) => res.data.message);
      } catch (error) {
        return false;
      }
    } else {
      return true;
    }
  };
  const onChange = ({ fileList }: { fileList: any }) => {
    setFileList(fileList.slice(0, 6));
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src && file.preview) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    BaseIframe.openIframe(file, src);
  };
  const handleBlur = (fieldName: any) => {
    formik.setFieldTouched(fieldName, true);
  };
  const handleFocus = (fieldName: any) => {
    formik.setFieldTouched(fieldName, false);
  };

  const fecthDataProfileById = async (idProfile: any) => {
    const rsRecordById: any = BuildParams.isLocation("record")
      ? await getRecordById(idProfile)
      : await getInstructorById(idProfile);
    if (rsRecordById.data.message) {
      const data = rsRecordById.data.data;
      onChangeClass(data.lop);
      setDataProfile(data);
      onChangeSemester(data.ky_id);
    }
  };
  const renderElementFistDiv = (
    label: string,
    typeInput?: string,
    name?: string,
    value?: any
  ) => {
    return (
      <div className="dialog-item w-100">
        <FormLabel>{label}</FormLabel>
        <Input
          type={typeInput}
          name={name}
          disabled={value}
          className={`${
            formik.errors[name as keyof typeof formik.errors] &&
            formik.touched[name as keyof typeof formik.touched]
              ? "is-invalid"
              : ""
          }`}
          value={
            value ?? false
              ? value
              : formik.values[name as keyof typeof formik.values]
          }
          onChange={formik.handleChange}
          onBlur={() => {
            handleBlur(name);
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

  useEffect(() => {
    if (idProfile) {
      fecthDataProfileById(idProfile);
    }
  }, [idProfile]);
  useEffect(() => {
    if (idProfile && listFiles && listFiles.length > 0) {
      setFileList(listFiles);
    }
  }, [idProfile, listFiles]);
  useEffect(() => {
    onChangeClass(dataUserContext.lop)
  }, [])
  return (
    <BaseDialog
      onClickHideDialog={onClickDialog}
      label={`${idProfile ? "Chỉnh sửa" : "Thêm mới"}`}
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
                    item.value
                  )}
                </Fragment>
              );
            })}
            {classDiv.map((item: any, index: any) => {
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
          <div className="d-flex gap-3  col-3 flex-column">
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
            {thirddDiv.map((item: any, index: any) => {
              return (
                <Fragment key={index}>
                  {renderElementFistDiv(item.label, item.type, item.name)}
                </Fragment>
              );
            })}
          </div>
          <div className="d-flex flex-column flex-1 col-3 gap-3">
            <Upload
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="text"
              fileList={
                idProfile
                  ? fileList.map((file: any) => ({
                      uid: file.uid || file.Id,
                      name: file.name || file.ten,
                      url: file.originFileObj
                        ? null
                        : `${config.FILE_URL}${file.ten}`,
                      ...file,
                      status: "done",
                    }))
                  : fileList.map((file: any) => ({
                      ...file,
                      status: "done",
                    }))
              }
              onChange={onChange}
              onPreview={onPreview}
              multiple
              accept=".pdf"
            >
              <FormLabel></FormLabel>
              <Button className="d-flex align-items-center gap-1">
                <SVG
                  src={import.meta.env.VITE_PUBLIC_URL + "/icons/upload.svg"}
                />
                Tải file
              </Button>
            </Upload>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <BaseButton title="Cập nhật" disabled={disabledBtn} />
        </div>
      </form>
    </BaseDialog>
  );
};

export default DialogTeahcerProfileManagerment;
