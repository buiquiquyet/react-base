import { useEffect, useState } from "react";
import BaseTableAdmin from "@/layout/component/base-table-admin/Base-table-admin";
import { getListUsers, deleteUser, deleteUsers } from "@/redux/admin/userCrud";
import { ToastContainer, toast } from "react-toastify";
import { Page } from "@/utils/Page";
import BaseButton from "@/layout/component/base-button/BaseButton";
import BasePagination from "@/layout/component/base-pagination/BasePagination";
import { ButtonColor } from "@/layout/component/constances/button.const";
import { ETableColumnType } from "@/layout/component/constances/table.const";
import "../styles/UserManagement.scss";
import DialogUserManagerment from "./DialogUserManagement";
import { getAllClasses } from "@/redux/admin/classCrud";
import { getAllDepartments } from "@/redux/admin/departmentCrud";
import { getClassesByIdKhoa } from "@/redux/admin/classCrud";
import { ListIcons } from "@/layout/component/constances/listIcons.const";
import BaseDialogConfirm from "@/layout/modal/BaseDialogConfim";
import BaseSearch from "@/layout/component/base-search/BaseSearch";
import { debounce } from "lodash";
import { BuildSearch } from "@/utils/BuildSearch";
import { BuildExcel } from "@/utils/BuildExcel";
import { Upload } from "antd";
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
  datas: any[];
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
  const [UserDataCoppy, setUserDataCoppy] = useState<any>([]);
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
  const [rowIdSelects, setRowIdSelects] = useState<string[]>([]);

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
    setUserDataCoppy([]);
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
  const handleDeleteUsers = () => {
    deleteUsers(rowIdSelects)
      .then((res: any) => {
        if (res.data.message) {
          setRowIdSelects([]);
          toast.success(res.data.message, {
            autoClose: 1800,
            onClose: () => fecthDataUsers(page),
          });
        }
      })
      .catch((error: any) => {
        toast.error(error, {
          autoClose: 1800,
        });
      });
  };
  const handleDebouncedSearch = debounce((value: string) => {
    if (value) {
      if (UserDataCoppy.length > 0) {
        const newDataUser = BuildSearch.search(
          ["hodem", "ten"],
          UserDataCoppy,
          value
        );
        if (newDataUser.length > 0)
          setDataUsers({ ...dataUsers, datas: newDataUser });
        else setDataUsers({ ...dataUsers, datas: [] });
      }
    } else {
      setDataUsers({ ...dataUsers, datas: UserDataCoppy });
    }
  }, 1000);
  const handleChangeInputSearch = (value: any) => {
    const values = value.target.value;
    if (UserDataCoppy.length === 0) {
      setUserDataCoppy(dataUsers.datas);
    }
    handleDebouncedSearch(values);
  };
  const handleExportExcel = () => {
    const titleColumn = [
      "Mã",
      "Mật khẩu",
      "Họ đệm",
      "Tên",
      "Khoa",
      "Lớp",
      "Chức vụ",
      "Email",
      "Điện thoại",
    ];
    const exportData = dataUsers.datas.map((item) => [
      item.tendangnhap,
      item.matkhau,
      item.hodem,
      item.ten,
      item.id_khoa,
      item.lop,
      item.nhom_id,
      item.email,
      item.dienthoai,
    ]);
    BuildExcel.export(exportData, titleColumn);
  };
  const handleImportExcel = (info: any) => {
    console.log(dataUsers.datas);
    const file = info.file.originFileObj;
    BuildExcel.import(file);
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
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <div className="d-flex gap-3 mb-4">
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
                onClick={handleDeleteUsers}
                title="Xóa"
                disabled={rowIdSelects.length === 0}
              ></BaseButton>
            </div>
          </div>
          <div>
            <BaseSearch
              placeholder="Tìm kiếm..."
              onChange={(value: any) => handleChangeInputSearch(value)}
            />
          </div>
        </div>
        <div className="d-flex gap-3">
          <div>
            <Upload onChange={handleImportExcel} showUploadList={false}>
              <BaseButton
                color={ButtonColor.Success}
                title="Nhập excel"
              ></BaseButton>
            </Upload>
          </div>
          <div>
            <BaseButton
              color={ButtonColor.Info}
              onClick={handleExportExcel}
              title="Xuất excel"
            ></BaseButton>
          </div>
        </div>
      </div>
      <BaseTableAdmin
        columns={column}
        data={dataUsers && dataUsers.datas}
        onClickShowOptios={handleShowSetting}
        itemOptions={itemOptions}
        setRowIdSelects={setRowIdSelects}
      />
      {dataUsers.datas && (
        <BasePagination
          totalPage={dataUsers.totalPages}
          onClick={(event, newPage) => handleChangePage(event, newPage)}
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
