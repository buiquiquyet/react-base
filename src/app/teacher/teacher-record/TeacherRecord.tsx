import BaseHeaderTable from "@/layout/component/base-header-table/BaseHeaderTable";
import BasePagination from "@/layout/component/base-pagination/BasePagination";
import BaseTableAdmin from "@/layout/component/base-table-admin/Base-table-admin";
import { ApiResponse } from "@/layout/component/constances/api-response";
import { ETableColumnType } from "@/layout/component/constances/table.const";
import BaseDialogConfirm from "@/layout/modal/BaseDialogConfim";
import {
  deleteRecord,
  deleteRecords,
  getListRecords,
} from "@/redux/api/teacher/teacherProfileCrud";
import { BuildSearch } from "@/utils/BuildSearch";
import { Page } from "@/utils/Page";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import DialogTeahcerRecordManagerment from "./DialogTeacherRecord";
import "./../styles/TeacherRecord.scss";
import { getAllSemesters } from "@/redux/api/teacher/SemesterCrud";
import { itemOptions } from "@/layout/component/constances/itemOptionSetting";
import { getCountByRecordId } from "@/redux/api/teacher/fileCrud";
import config from "@/utils/config";

const column = [
  { label: "", accesstor: "", type: ETableColumnType.CHECKBOX_ACTION },
  {
    label: "Lớp",
    accessor: "lop",
    type: ETableColumnType.TEXT,
  },
  { label: "Học phần", accessor: "ten_hoc_phan", type: ETableColumnType.TEXT },
  { label: "Đợt", accessor: "ky_id", type: ETableColumnType.TEXT },
  { label: "Họ tên GV", accessor: "ten_gv", type: ETableColumnType.TEXT },
  {
    label: "Ngày bắt đầu",
    accessor: "ngay_bat_dau",
    type: ETableColumnType.TEXT,
  },
  {
    label: "Ngày kết thúc",
    accessor: "ngay_ket_thuc",
    type: ETableColumnType.TEXT,
  },
  { label: "File", accessor: "countFile", type: ETableColumnType.TEXT },
  { label: "Ghi chú", accessor: "ghichu", type: ETableColumnType.TEXT },
  { label: "", accessor: "", type: ETableColumnType.ICON },
];

function TeacherRecord() {
  const [dataRecords, setDataRecords] = useState<ApiResponse>({
    currentPage: 1,
    datas: [],
    message: "",
    totalPages: 0,
    totalRecords: 0,
  });
  const [UserRecordCoppy, setRecordDataCoppy] = useState<any>([]);
  const pages: Page = new Page();
  const [page, setPages] = useState(pages);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [optionsSemester, setOptionsSemester] = useState([]);
  const [listFileNames, setListFileNames] = useState([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [rowIdSelects, setRowIdSelects] = useState<string[]>([]);
  const [idRecord, setIdRecord] = useState("");
  const [selectedOptionSemester, setSelectedOptionSemester] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleShowHideDialog = () => {
    if (isShowDialog) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    setIsShowDialog(!isShowDialog);
  };
  const handleShowDialogDel = () => {
    setOpenDialogConfirm(true);
  };
  const handleShowSetting = (key: any, id: any) => {
    if (id) {
      setIdRecord(id);
    }
    if (key.key === "2") {
      setOpenDialogConfirm(true);
    } else {
      setIsShowDialog(!isShowDialog);
    }
  };
  const handleChangePage = (event: any, newPage: any) => {
    setPages({
      ...page,
      pageNumber: newPage,
    });
    setRecordDataCoppy([]);
  };
  const handleDebouncedSearch = debounce((value: string) => {
    if (value) {
      if (UserRecordCoppy.length > 0) {
        const newDataUser = BuildSearch.search(
          ["ten_hoc_phan"],
          UserRecordCoppy,
          value
        );
        if (newDataUser.length > 0)
          setDataRecords({ ...dataRecords, datas: newDataUser });
        else setDataRecords({ ...dataRecords, datas: [] });
      }
    } else {
      setDataRecords({ ...dataRecords, datas: UserRecordCoppy });
    }
  }, 1000);
  const handleChangeInputSearch = (value: any) => {
    const values = value.target.value;
    if (UserRecordCoppy?.length === 0) {
      setRecordDataCoppy(dataRecords.datas);
    }
    handleDebouncedSearch(values);
  };

  const handleChangeSemester = (value: any) => {
    setSelectedOptionSemester(value);
  };
  const handleCancelDiaLogConfirm = () => {
    setOpenDialogConfirm(false);
  };
  const handleOkDiaLogConfirm = async () => {
    setOpenDialogConfirm(false);
    const rs: any = idRecord
      ? await deleteRecord(idRecord)
      : await deleteRecords(rowIdSelects);
    if (rs.data.message) {
      !idRecord && setRowIdSelects([]);
      toast.success(rs.data.message, {
        autoClose: 1500,
        onClose: () => {
          fecthDataRecords(page);
          setIdRecord("");
        },
      });
    } else {
      toast.success("Đã xảy ra lỗi", {
        autoClose: 1500,
      });
    }
  };
  const fecthDataSemester = () => {
    getAllSemesters()
      .then((res: any) => {
        if (res.data.message) {
          const newSemesters = res.data.datas.map((item: any) => {
            return {
              value: item.Id,
              label: item.ten,
            };
          });
          setOptionsSemester(newSemesters);
        } else setOptionsSemester([]);
      })
      .catch(() => {
        toast.error("Error", { autoClose: 1800 });
      });
  };
  const fecthDataRecords = (page: Page) => {
    getListRecords(page)
      .then(async (res: any) => {
        if (res.data) {
          const arrResponse = await Promise.all(
            res.data.datas.map(async (item: any) => {
              const countFile = await fechtCountFileByRecordId(item.Id);
              if (countFile) {
                return {
                  ...item,
                  countFile,
                };
              } else return { ...item, countFile: 0 };
            })
          );
          setDataRecords({
            ...res.data,
            datas: arrResponse,
          });
        } else {
          toast.error(res.data.error);
          setDataRecords([] as any);
        }
      })
      .catch((error: any) => {
        toast.error(error);
        setDataRecords([] as any);
      });
  };
  const fechtCountFileByRecordId = async (recordId: any) => {
    try {
      const res = await getCountByRecordId(recordId);
      if (res.data.message) {
        setListFileNames(res.data.files)
        return res.data.countFile;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching count:", error);
      return false;
    }
  };
  
  useEffect(() => {
    fecthDataRecords(page);
    fecthDataSemester();
  }, []);
  return (
    <div className="w-100 teacher-record">
      <ToastContainer />
      <BaseHeaderTable
        placeholderSearch="Tìm kiếm theo tên học phần..."
        onClickShowHideDialog={handleShowHideDialog}
        onClickShowDialogDel={handleShowDialogDel}
        rowIdSelects={rowIdSelects}
        onClickChangeInputSearch={(value) => handleChangeInputSearch(value)}
        fileInputRef={fileInputRef}
        // onClickImportExcel={(e) => handleImportExcel(e)}
        // onClickExportExcel={handleExportExcel}
        // onClickButtonInputFile={handleButtonClick}
      />
      <BaseTableAdmin
        columns={column}
        data={dataRecords && dataRecords.datas}
        onClickShowOptios={handleShowSetting}
        itemOptions={itemOptions}
        setRowIdSelects={setRowIdSelects}
        rowIdSelects={rowIdSelects}
      />
      {dataRecords.datas && (
        <BasePagination
          totalPage={dataRecords.totalPages}
          onClick={(event, newPage) => handleChangePage(event, newPage)}
          totalRecords={dataRecords.totalRecords}
          pageNumber={page.pageNumber}
        />
      )}
      {isShowDialog && (
        <DialogTeahcerRecordManagerment
          optionsSemester={optionsSemester}
          onChangeSemester={(value) => handleChangeSemester(value)}
          onClickDialog={handleShowHideDialog}
          selectedOptionSemester={selectedOptionSemester}
          handleFecthRecords={() => fecthDataRecords(page)}
          idRecord={idRecord}
          listFiles={listFileNames}
        />
      )}
      <BaseDialogConfirm
        text="Bạn xác nhận muốn xóa hồ sơ?"
        title="Xóa hồ sơ"
        onOk={handleOkDiaLogConfirm}
        onCancel={handleCancelDiaLogConfirm}
        isModalOpen={openDialogConfirm}
      />
    </div>
  );
}

export default TeacherRecord;
