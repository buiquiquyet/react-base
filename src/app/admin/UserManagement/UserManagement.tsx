import { useEffect, useState } from "react";
import BaseTableAdmin from "../../../layout/component/Base-table-admin";
import { getListUsers, deleteUser, updateUsers } from "@/redux/admin/userCrud";
import { ToastContainer, toast } from "react-toastify";
import { Page } from "@/utils/Page";
import BaseButton from "@/layout/component/BaseButton";
import BasePagination from "@/layout/component/BasePagination";
import { ButtonColor } from "@/layout/component/constances/button.const";
import { ETableColumnType } from "@/layout/component/constances/table.const";
import "../styles/UserManagement.scss";
import DialogUserManagerment from "./DialogUserManagement";
import { getAllClasses } from "@/redux/admin/classCrud";
import { getAllDepartments } from "@/redux/admin/departmentCrud";
import { getClassesByIdKhoa } from "@/redux/admin/classCrud";
import { ListIcons } from "@/layout/component/constances/listIcons.const";
import BaseDialogConfirm from "@/layout/component/BaseDialogConfim";

const column = [
  { label: "", accesstor: "", type: ETableColumnType.CHECKBOX_ACTION },
  {
    label: "Mã",
    accessor: "tendangnhap",
    type: ETableColumnType.TEXT,
  },
  { label: "Mật khẩu", accessor: "matkhau", type: ETableColumnType.TEXT },
  { label: "Họ đệm", accessor: "hodem", type: ETableColumnType.TEXT },
  { label: "Tên", accessor: "ten", type: ETableColumnType.TEXT },
  { label: "Khoa", accessor: "id_khoa", type: ETableColumnType.TEXT },
  { label: "Lớp", accessor: "lop", type: ETableColumnType.TEXT },
  { label: "Chức vụ", accessor: "nhom_id", type: ETableColumnType.TEXT },
  { label: "Email", accessor: "email", type: ETableColumnType.TEXT },
  // { label: "Giới tính", accessor: "gioitinh", type: ETableColumnType.TEXT },
  // { label: "Ngày sinh", accessor: "ngaysinh", type: ETableColumnType.TEXT },
  // { label: "Địa chỉ", accessor: "diachi", type: ETableColumnType.TEXT },
  { label: "Điện thoại", accessor: "dienthoai", type: ETableColumnType.TEXT },
  { label: "", accessor: "", type: ETableColumnType.ICON },
];
const PositionUser = [
  { value: "GVCN", label: "Giáo Viên" },
  { value: "TBM", label: "Trưởng Bộ Môn" },
  { value: "ADMIN", label: "Quản Trị" },
];
const itemOptions = [
  { key: "1", label: ListIcons.getIcon("Chỉnh sửa") },
  { key: "2", label: ListIcons.getIcon("Xóa") },
];

interface ApiUserResponse {
  currentPage: number;
  datas: [];
  message: string;
  totalPages: number;
  totalRecords: number;
}

function UserManagement() {
  const [dataUsers, setDataUsers] = useState<ApiUserResponse>({
    currentPage: 1,
    datas: [],
    message: "",
    totalPages: 0,
    totalRecords: 0,
  });
  const [dataClasses, setDataClasses] = useState([]);
  const [dataDepartment, setDataDepartment] = useState([]);
  const pages: Page = new Page();
  const [page, setPages] = useState(pages);
  const [selectedOptionCV, setSelectedOptionCV] = useState(null);
  const [selectedOptionDe, setSelectedOptionDe] = useState(null);
  const [selectedOptionCl, setSelectedOptionCl] = useState(null);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [valueRadio, setValueRadio] = useState("");
  const [idUser, setIdUser] = useState("");
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);

  const handleCancelDiaLogConfirm = () => {
    setOpenDialogConfirm(false);
  };
  const handleOkDiaLogConfirm = () => {
    setOpenDialogConfirm(false);
    deleteUser(idUser)
      .then((res: any) => {
        if (res.data.message) {
          toast.success(res.data.message, {
            autoClose: 1500,
            onClose: () => fecthDataUsers(page),
          });
        }
      })
      .catch((error: any) => {
        toast.success(error, {
          autoClose: 1500,
        });
      });
    setOpenDialogConfirm(false);
  };
  const handleChangeRadio = (event: any | string) => {
    if (typeof event === "string") {
      setValueRadio(event);
    } else {
      setValueRadio(event.target.value);
    }
  };
  const fecthDataUsers = (page: Page) => {
    setSelectedOptionCV(null);
    setSelectedOptionDe(null);
    setSelectedOptionCl(null);
    setValueRadio("");
    getListUsers(page)
      .then((res: any) => {
        if (res.data) {
          const newDataDepartment = [...dataDepartment];
          const newDatas = res.data.datas.map((itemUser: any) => {
            const name_department = newDataDepartment
              .filter(
                (itemDepartment: any) =>
                  itemUser.id_khoa === itemDepartment.value
              )
              .map((item: any) => item.label)
              .join("");
            return {
              ...itemUser,
              id_khoa: name_department,
            };
          });
          setDataUsers({
            ...res.data,
            datas: newDatas,
          });
        } else {
          toast.error(res.data.error);
          setDataUsers([] as any);
        }
      })
      .catch((error: any) => {
        toast.error(error);
        setDataUsers([] as any);
      });
  };

  const fecthDataClasses = () => {
    getAllClasses()
      .then((res: any) => {
        if (res.data.message) {
          const newDatas = res.data.datas.map((item: any) => {
            return {
              value: item.nhom_id,
              label: item.nhom_id,
              idLop: item.Id,
            };
          });
          setDataClasses(newDatas);
        } else {
          toast.error(res.data.error);
          setDataClasses([] as any);
        }
      })
      .catch((error: any) => {
        toast.error(error);
        setDataClasses([] as any);
      });
  };
  const fecthDataDepartments = () => {
    getAllDepartments()
      .then((res: any) => {
        if (res.data.message) {
          const newDatas = res.data.datas.map((item: any) => {
            return {
              value: item.id_khoa,
              label: item.name_khoa,
              idKhoa: item.Id,
            };
          });
          setDataDepartment(newDatas);
        } else {
          toast.error(res.data.error);
          setDataDepartment([] as any);
        }
      })
      .catch((error: any) => {
        toast.error(error);
        setDataDepartment([] as any);
      });
  };
  const handleChangeCV = (value: any) => {
    setSelectedOptionCV(value);
  };
  const handleChangeDe = (value: any) => {
    setSelectedOptionDe(value);
    setSelectedOptionCl(null);
    if (value) {
      getClassesByIdKhoa(value)
        .then((res: any) => {
          if (res.data.message) {
            const newDatas = res.data.datas.map((item: any) => {
              return {
                value: item.nhom_id,
                label: item.nhom_id,
                idLop: item.Id,
              };
            });
            setDataClasses(newDatas);
          }
        })
        .catch(() => {
          toast.error("Đã xảy ra lỗi");
        });
    }
  };
  const handleChangeCl = (value: any) => {
    setSelectedOptionCl(value);
  };
  const handleChangePage = (event: any, newPage: any) => {
    setPages({
      ...page,
      pageNumber: newPage,
    });
  };
  const handleShowHideDialog = () => {
    if (isShowDialog) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    if (idUser) {
      setIdUser("");
      setValueRadio("");
      setSelectedOptionCV(null);
      setSelectedOptionDe(null);
      setSelectedOptionCl(null);
    }
    setIsShowDialog(!isShowDialog);
  };
  const handleShowSetting = (key: any, id: any) => {
    if (id) {
      setIdUser(id);
    }
    if (key.key === "2") {
      setOpenDialogConfirm(true);
    } else {
      setIsShowDialog(!isShowDialog);
    }
  };
  useEffect(() => {
    fecthDataDepartments();
    fecthDataClasses();
  }, [page]);
  useEffect(() => {
    if (dataDepartment && dataDepartment.length > 0) {
      fecthDataUsers(page);
    }
  }, [page, dataDepartment]);
  return (
    <div className="w-100 use-management">
      <div className="d-flex gap-3 mb-4">
        <ToastContainer />
        <div className="d-flex gap-3">
          <div>
            <BaseButton
              color={ButtonColor.Primary}
              onClick={handleShowHideDialog}
              title="Thêm mới"
            ></BaseButton>
          </div>
          <div>
            <BaseButton
              color={ButtonColor.Error}
              onClick={() => {}}
              title="Xóa"
            ></BaseButton>
          </div>
        </div>
      </div>
      <BaseTableAdmin
        columns={column}
        data={dataUsers && dataUsers.datas}
        onClickShowOptios={handleShowSetting}
        itemOptions={itemOptions}
      />
      {dataUsers.datas && (
        <BasePagination
          totalPage={dataUsers.totalPages}
          onClick={handleChangePage}
          totalRecords={dataUsers.totalRecords}
          pageNumber={page.pageNumber}
        />
      )}
      {isShowDialog && (
        <DialogUserManagerment
          optionsCV={PositionUser}
          optionsDe={dataDepartment}
          optionsCl={dataClasses}
          onChangeCV={(value) => handleChangeCV(value)}
          onChangeDe={(value) => handleChangeDe(value)}
          onChangeCl={(value) => handleChangeCl(value)}
          onClickDialog={handleShowHideDialog}
          selectedOptionCV={selectedOptionCV}
          selectedOptionDe={selectedOptionDe}
          selectedOptionCl={selectedOptionCl}
          onChangRadio={(value) => handleChangeRadio(value)}
          valueRadio={valueRadio}
          handleFecthUser={() => fecthDataUsers(page)}
          idUser={idUser}
        />
      )}
      <BaseDialogConfirm
        text="Bạn xác nhận muốn xóa người dùng này?"
        title="Xóa người dùng"
        onOk={handleOkDiaLogConfirm}
        onCancel={handleCancelDiaLogConfirm}
        isModalOpen={openDialogConfirm}
      />
    </div>
  );
}

export default UserManagement;
