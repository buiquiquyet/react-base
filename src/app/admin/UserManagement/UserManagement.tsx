import { useEffect, useRef, useState } from "react";
import BaseTableAdmin from "@/layout/component/base-table-admin/Base-table-admin";
import {
  getListUsers,
  deleteUser,
  deleteUsers,
  createManyUsers,
} from "@/redux/api/admin/userCrud";
import { ToastContainer } from "react-toastify";
import { Page } from "@/utils/Page";
import BasePagination from "@/layout/component/base-pagination/BasePagination";
import { ETableColumnType } from "@/layout/component/constances/table.const";
import "../styles/UserManagement.scss";
import DialogUserManagerment from "./DialogUserManagement";
import { getAllClasses } from "@/redux/api/admin/classCrud";
import { getAllDepartments } from "@/redux/api/admin/departmentCrud";
import { getClassesByIdKhoa } from "@/redux/api/admin/classCrud";
import BaseDialogConfirm from "@/layout/modal/BaseDialogConfim";
import { debounce } from "lodash";
import { BuildSearch } from "@/utils/BuildSearch";
import { BuildExcel } from "@/utils/BuildExcel";
import BaseHeaderTable from "@/layout/component/base-header-table/BaseHeaderTable";
import { ApiResponse } from "@/layout/component/constances/api-response";
import { itemOptions } from "@/layout/component/constances/itemOptionSetting";
import { EDisabledHeaderTableCom } from "@/layout/component/constances/disabledHeaderTable";
import { ErrorMessage } from "@/layout/component/constances/error-code.const";
import {
  ToastMessage,
  ToastStatus,
} from "@/layout/component/constances/toast-dialog";
import { BuildParams } from "@/utils/BuildParams";
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

function UserManagement() {
  const [dataUsers, setDataUsers] = useState<ApiResponse>({
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancelDiaLogConfirm = () => {
    setOpenDialogConfirm(false);
  };
  const handleOkDiaLogConfirm = async () => {
    setOpenDialogConfirm(false);
    const rs: any = idUser
      ? await deleteUser(idUser)
      : await deleteUsers(rowIdSelects);
    if (rs.data.message) {
      !idUser && setRowIdSelects([]);
      ToastMessage.show(ToastStatus.success, rs.data.message, () => {
        fecthDataUsers(page);
        setIdUser("");
      });
    } else {
      ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
    }
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
          setUserDataCoppy(newDatas);
          setDataUsers({
            ...res.data,
            datas: newDatas,
          });
        } else {
          ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
          setDataUsers([] as any);
        }
      })
      .catch(() => {
        ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
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
          ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
          setDataClasses([] as any);
        }
      })
      .catch(() => {
        ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
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
          ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
          setDataDepartment([] as any);
        }
      })
      .catch(() => {
        ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
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
          ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
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
  const handleShowDialogDel = () => {
    setOpenDialogConfirm(true);
  };
  // const handleDebouncedSearch = debounce((value: string,fieldName: any[], threshold: number) => {
  //   if (value) {
  //     if (UserDataCoppy.length > 0) {
  //       const newDataUser = BuildSearch.Search(
  //         fieldName,
  //         UserDataCoppy,
  //         value,
  //         threshold
  //       );
  //       if (newDataUser.length > 0)
  //         setDataUsers({ ...dataUsers, datas: newDataUser });
  //       else setDataUsers({ ...dataUsers, datas: [] });
  //     }
  //   } else {
  //     setDataUsers({ ...dataUsers, datas: UserDataCoppy });
  //   }
  // }, 1000);
  // const handleChangeSearch = (value: any, fieldName: any[], threshold: number) => {
  //   const values = value.target.value;
  //   if (UserDataCoppy.length === 0) {
  //     setUserDataCoppy(dataUsers.datas);
  //   }
  //   handleDebouncedSearch(values,fieldName, threshold);
  // };
  const handleChangeSearchSelected = (
    value: any,
    fieldName: any[],
    threshold: number
  ) => {
    const newDatas: any = BuildSearch.handleChangeSearch(
      value,
      fieldName,
      threshold,
      UserDataCoppy
    );
    if (!newDatas) return setDataUsers({ ...dataUsers, datas: UserDataCoppy });
    if (newDatas?.length > 0) {
      const coppyData = [...UserDataCoppy];
      const newArr = BuildParams.commonItemsOf2Arr(coppyData, newDatas);
      setDataUsers({ ...dataUsers, datas: newArr });
    } else setDataUsers({ ...dataUsers, datas: [] });
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
      "Địa chỉ",
      "Ngày sinh",
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
      item.diachi,
      item.ngaysinh,
    ]);
    BuildExcel.export(exportData, titleColumn);
  };
  const handleImportExcel = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const titleColumn = [
      "tendangnhap",
      "matkhau",
      "hodem",
      "ten",
      "id_khoa",
      "lop",
      "nhom_id",
      "email",
      "dienthoai",
      "diachi",
      "ngaysinh",
    ];
    try {
      const formattedData: any = await BuildExcel.import(file, titleColumn);
      if (formattedData) {
        const res: any = await createManyUsers(formattedData);
        if (res.data.message) {
          ToastMessage.show(ToastStatus.success, res.data.message, () => {
            fecthDataUsers(page);
          });
        }
      }
    } catch (error) {
      ToastMessage.show(ToastStatus.success, ErrorMessage.ERR_RESPONSE_API);
    }
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      <ToastContainer />
      <BaseHeaderTable
        placeholderSearch="Tìm kiếm theo tên..."
        onClickShowHideDialog={handleShowHideDialog}
        onClickShowDialogDel={handleShowDialogDel}
        rowIdSelects={rowIdSelects}
        onClickChangeInputSearch={(value) =>
          handleChangeSearchSelected(value, ["hodem", "ten"], 0.5)
        }
        fileInputRef={fileInputRef}
        onClickImportExcel={(e) => handleImportExcel(e)}
        onClickExportExcel={handleExportExcel}
        onClickButtonInputFile={handleButtonClick}
        disabledElement={[
          EDisabledHeaderTableCom.DISABLED_CHECK,
          EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_DEPARTMENT,
          EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_SUBJECT,
          EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_CLASS,
        ]}
      />
      <BaseTableAdmin
        columns={column}
        data={dataUsers && dataUsers.datas}
        onClickShowOptios={handleShowSetting}
        itemOptions={itemOptions}
        setRowIdSelects={setRowIdSelects}
        rowIdSelects={rowIdSelects}
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
        text="Bạn xác nhận muốn xóa người dùng?"
        title="Xóa người dùng"
        onOk={handleOkDiaLogConfirm}
        onCancel={handleCancelDiaLogConfirm}
        isModalOpen={openDialogConfirm}
      />
    </div>
  );
}

export default UserManagement;
