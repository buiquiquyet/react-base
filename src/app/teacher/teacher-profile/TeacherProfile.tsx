import BaseHeaderTable from "@/layout/component/base-header-table/BaseHeaderTable";
import BasePagination from "@/layout/component/base-pagination/BasePagination";
import BaseTableAdmin from "@/layout/component/base-table-admin/Base-table-admin";
import { ApiResponse } from "@/layout/component/constances/api-response";
import { ETableColumnType } from "@/layout/component/constances/table.const";
import BaseDialogConfirm from "@/layout/modal/BaseDialogConfim";
import {
  deleteRecord,
  deleteRecords,
  getAllRecords,
  getListRecordByDepartmentId,
  getListRecordByUserId,
  getRecordById,
  updateCheckRecords,
  updateNoteRecord,
  // getListRecords,
} from "@/redux/api/teacher/teacherRecordCrud";
import {
  deleteInstructor,
  deleteInstructors,
  getAllInstructors,
  getListInstructorByUserId,
  // getListInstructors,
} from "@/redux/api/teacher/teacherInstructor";
import { BuildSearch } from "@/utils/BuildSearch";
import { Page } from "@/utils/Page";
import { debounce } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import DialogTeahcerProfileManagerment from "./DialogTeacherProfile";
import "./../styles/TeacherProfile.scss";
import { getAllSemesters } from "@/redux/api/teacher/SemesterCrud";
import { itemOptions } from "@/layout/component/constances/itemOptionSetting";
import {
  deleteFileByProfileIds,
  getCountByProfileId,
} from "@/redux/api/teacher/fileCrud";
import BaseDialogFile from "@/layout/modal/BaseDialogFile";
import { getAllClasses } from "@/redux/api/admin/classCrud";
import { EDisabledHeaderTableCom } from "@/layout/component/constances/disabledHeaderTable";
import { BuildParams } from "@/utils/BuildParams";
import { MyContext } from "@/AppRouter";
import BaseDialogNote from "@/layout/modal/BaseDialogNote";
import { ERole, EUrlRouter } from "@/layout/component/constances/roleUser";
import { BuildExcel } from "@/utils/BuildExcel";

const columnRecord: any = [
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
  { label: "File", accessor: "countFile", type: ETableColumnType.FILE },
  { label: "Ghi chú", accessor: "ghichu", type: ETableColumnType.NOTE },
  {
    label: "Trạng thái",
    accessor: "check",
    type: ETableColumnType.STATUS,
  },
];
const columnInstructor: any = [
  {
    label: "Lớp",
    accessor: "lop",
    type: ETableColumnType.TEXT,
  },
  { label: "Đợt", accessor: "ky_id", type: ETableColumnType.TEXT },
  { label: "Họ tên GV", accessor: "ten_gv", type: ETableColumnType.TEXT },
  { label: "File", accessor: "countFile", type: ETableColumnType.FILE },
];
const initArrDisabled: any = [EDisabledHeaderTableCom.DISABLED_IMPORT];
function TeacherProfile() {
  const dataUserContext: any = useContext(MyContext);
  const [dataProfiles, setDataProfiles] = useState<ApiResponse>({
    currentPage: 1,
    datas: [],
    message: "",
    totalPages: 0,
    totalRecords: 0,
  });

  const [columnTable, setColumnTable] = useState<any>(columnRecord);
  const [initialArrDisabled, setInitialArrDisabled] = useState(initArrDisabled);
  const [UserProfileCoppy, setProfileDataCoppy] = useState<any>([]);
  const pages: Page = new Page();
  const [page, setPages] = useState(pages);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [optionsSemester, setOptionsSemester] = useState([]);
  const [optionClasses, setOptionClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState(null);
  const [listFileNames, setListFileNames] = useState([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [isopenDialogFile, setIsOpenDialogFile] = useState(false);
  const [isOpenDialogNote, setIsOpenDialogNote] = useState(false);
  const [rowIdSelects, setRowIdSelects] = useState<string[]>([]);
  const [idProfile, setIdProfile] = useState("");
  const [idRecordUpdateNote, setIdRecordUpdateNote] = useState("");
  const [recordDataById, setRecordDataById] = useState();
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [selectedOptionSemester, setSelectedOptionSemester] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleShowHideDialog = () => {
    if (isShowDialog) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    if (idProfile) {
      setIdProfile("");
      setSelectedClasses(null);
      setSelectedOptionSemester(null);
    }
    setIsShowDialog(!isShowDialog);
  };
  const handleShowDialogDel = () => {
    setOpenDialogConfirm(true);
  };
  const handleShowSetting = (key: any, id: any) => {
    if (id) {
      setIdProfile(id);
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
    setProfileDataCoppy([]);
  };
  const handleDebouncedSearch = debounce((value: string) => {
    if (value) {
      if (UserProfileCoppy?.length > 0) {
        const newDataUser = BuildSearch.search(
          ["ten_hoc_phan"],
          UserProfileCoppy,
          value
        );
        if (newDataUser.length > 0)
          setDataProfiles({ ...dataProfiles, datas: newDataUser });
        else setDataProfiles({ ...dataProfiles, datas: [] });
      }
    } else {
      setDataProfiles({ ...dataProfiles, datas: UserProfileCoppy });
    }
  }, 1000);
  const handleChangeInputSearch = (value: any) => {
    const values = value.target.value;
    if (UserProfileCoppy?.length === 0) {
      setProfileDataCoppy(dataProfiles.datas);
    }
    handleDebouncedSearch(values);
  };

  const handleChangeSemester = (value: any) => {
    setSelectedOptionSemester(value);
  };
  const handleChangeClass = (value: any) => {
    setSelectedClasses(value);
  };
  const handleCancelDiaLogConfirm = () => {
    setOpenDialogConfirm(false);
  };
  const handleOkDiaLogConfirm = async () => {
    setOpenDialogConfirm(false);
    const rs: any = idProfile
      ? BuildParams.isLocation(EUrlRouter.IS_RECORD)
        ? await deleteRecord(idProfile)
        : await deleteInstructor(idProfile)
      : BuildParams.isLocation(EUrlRouter.IS_RECORD)
      ? await deleteRecords(rowIdSelects)
      : await deleteInstructors(rowIdSelects);
    await deleteFileByProfileIds(idProfile ? [idProfile] : rowIdSelects);
    if (rs.data.message) {
      !idProfile && setRowIdSelects([]);
      toast.success(rs.data.message, {
        autoClose: 1500,
        onClose: () => {
          fecthDataProfiles(page);
          setIdProfile("");
        },
      });
    } else {
      toast.success("Đã xảy ra lỗi", {
        autoClose: 1500,
      });
    }
  };
  const handleIsOpenDialogFile = (idProfile: string) => {
    setIsOpenDialogFile(!isopenDialogFile);
    fecthDataFileByIdProfile(idProfile);
  };
  const handleIsHidenDialogFile = () => {
    setListFileNames([]);
    setIsOpenDialogFile(!isopenDialogFile);
  };
  const handleChangeSelectedCheckOption = (valueCheck: any) => {
    setSelectedCheck(valueCheck);
  };

  const handleCheckProfile = async () => {
    if (selectedCheck) {
      const rsCheckProfile = await updateCheckRecords(
        rowIdSelects,
        selectedCheck
      );
      if (rsCheckProfile.data.message) {
        setRowIdSelects([]);
        toast.success(rsCheckProfile.data.message, {
          autoClose: 1800,
          onClose: () => {
            fecthDataProfiles(page);
          },
        });
      }
    } else toast.error("Chưa chọn trạng thái duyệt!", { autoClose: 1500 });
  };
  const handleUpdateNote = async (note: string) => {
    const rsUpdateNote = await updateNoteRecord(idRecordUpdateNote, note);
    if (rsUpdateNote.data.message) {
      setIsOpenDialogNote(!isOpenDialogNote);
      toast.success(rsUpdateNote.data.message, {
        autoClose: 1800,
        onClose: () => fecthDataProfiles(page),
      });
    } else {
      toast.error("Đã xảy ra lỗi thêm ghi chú!", { autoClose: 1500 });
    }
  };
  const handleOpenDialogNote = async (idRecord: string) => {
    const rsGetRecordById = await getRecordById(idRecord);
    if (rsGetRecordById.data.message) {
      setRecordDataById(rsGetRecordById.data.data);
    } else {
      toast.error("Đã xảy ra lỗi lấy dữ liệu!", { autoClose: 1500 });
    }
    setIdRecordUpdateNote(idRecord);
    setIsOpenDialogNote(!isOpenDialogNote);
  };
  const handleHideDialogNote = () => {
    setIsOpenDialogNote(false);
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
  const fecthDataProfiles = async (page: Page) => {
    setSelectedOptionSemester(null);
    setListFileNames([]);
    const rsDataProfiles: any = BuildParams.starWith(EUrlRouter.SW_TBT)
      ? await getListRecordByDepartmentId(dataUserContext?.id_khoa, page)
      : BuildParams.starWith(EUrlRouter.SW_ADMIN)
      ? BuildParams.isLocation(EUrlRouter.IS_RECORD)
        ? await getAllRecords()
        : await getAllInstructors()
      : BuildParams.isLocation(EUrlRouter.IS_RECORD)
      ? await getListRecordByUserId(dataUserContext?.Id, page)
      : await getListInstructorByUserId(dataUserContext?.Id, page);
    if (rsDataProfiles.data.message) {
      const arrResponse = await Promise.all(
        rsDataProfiles.data.datas.map(async (item: any) => {
          const fileData = await fechtCountFileByProfileId(item.Id);
          if (fileData) {
            return {
              ...item,
              countFile: fileData.countFile,
            };
          } else return { ...item, countFile: 0 };
        })
      );
      const newSemester = [...optionsSemester];
      const newDatas = arrResponse.map((itemProfile: any) => {
        const name_Semester = newSemester
          .filter(
            (itemSemester: any) => itemProfile.ky_id === itemSemester.value
          )
          .map((item: any) => item.label)
          .join("");
        return {
          ...itemProfile,
          ky_id: name_Semester,
        };
      });
      setDataProfiles({
        ...rsDataProfiles.data,
        datas: newDatas,
      });
    } else {
      setDataProfiles([] as any);
    }
  };
  const fechtCountFileByProfileId = async (ProfileId: any) => {
    try {
      const res = await getCountByProfileId(ProfileId);
      if (res.data.message) {
        return res.data;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching count:", error);
      return false;
    }
  };
  const fecthDataFileByIdProfile = async (idProfile: string) => {
    if (idProfile) {
      const fileData = await fechtCountFileByProfileId(idProfile);
      if (fileData) setListFileNames(fileData.files);
    }
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
          setOptionClasses(newDatas);
        } else {
          toast.error(res.data.error);
          setOptionClasses([] as any);
        }
      })
      .catch((error: any) => {
        toast.error(error);
        setOptionClasses([] as any);
      });
  };

  const handleExportExcel = () => {
    const titleColumnRecord = [
      "Lớp",
      "Học phần",
      "Đợt",
      "Họ tên GV",
      "Ngày bắt đầu",
      "Ngày kết thúc",
      "Số file",
      "Ghi chú",
      "Trạng thái",
    ];
    const titleColumnInstructor = ["Lớp", "Đợt", "Họ tên GV", "Số file"];
    const exportDataRecord = dataProfiles.datas.map((item) => [
      item.lop,
      item?.ten_hoc_phan,
      item.ky_id,
      item.ten_gv,
      item?.ngay_bat_dau,
      item?.ngay_ket_thuc,
      item.countFile,
      item?.ghichu,
      item?.check === "0"
        ? "Chờ duyệt"
        : item.check === "1"
        ? "Đã duyệt"
        : "Không duyệt",
    ]);
    const exportDataInstructor = dataProfiles.datas.map((item) => [
      item.lop,
      item.ky_id,
      item.ten_gv,
      item.countFile,
    ]);
    const arrColumn = BuildParams.isLocation(EUrlRouter.IS_RECORD)
      ? titleColumnRecord
      : titleColumnInstructor;
    const exportData = BuildParams.isLocation(EUrlRouter.IS_RECORD)
      ? exportDataRecord
      : exportDataInstructor;
    BuildExcel.export(exportData, arrColumn);
  };
  const checkIncludeColumn = (column: any, typeCheck: any) => {
    const isIncludes = column.some((item: any) => item.type === typeCheck);
    return isIncludes;
  };
  const handleSetColumnTableAddIcon = () => {
    if (
      dataUserContext.nhom_id === ERole.GVCN &&
      !checkIncludeColumn(columnTable, ETableColumnType.ICON)
    ) {
      setColumnTable((prev: any[]) => [
        ...prev,
        { label: "", accessor: "", type: ETableColumnType.ICON },
      ]);
    }
  };
  const handleSetColumnTableAddCheckBox = () => {
    if (
      dataUserContext.nhom_id !== ERole.ADMIN &&
      !checkIncludeColumn(columnTable, ETableColumnType.CHECKBOX_ACTION)
    ) {
      setColumnTable((prev: any[]) => [
        { label: "", accessor: "", type: ETableColumnType.CHECKBOX_ACTION },
        ...prev,
      ]);
    }
  };
  useEffect(() => {
    fecthDataSemester();
    fecthDataClasses();
  }, [page, location.pathname]);
  useEffect(() => {
    fecthDataFileByIdProfile(idProfile);
  }, [idProfile, location.pathname]);
  useEffect(() => {
    if (optionsSemester && optionsSemester.length > 0) {
      fecthDataProfiles(page);
    }
  }, [optionsSemester, page, location.pathname]);
  useEffect(() => {
    setDataProfiles({
      currentPage: 1,
      datas: [],
      message: "",
      totalPages: 0,
      totalRecords: 0,
    });
    if (dataUserContext && columnTable?.length > 0) {
      if (BuildParams.isLocation(EUrlRouter.IS_INSTRUCTOR)) {
        setColumnTable(columnInstructor);
      } else setColumnTable(columnRecord);
      handleSetColumnTableAddIcon();
      handleSetColumnTableAddCheckBox();
    }
  }, [location.pathname]);
  useEffect(() => {
    if (
      BuildParams.starWith(EUrlRouter.SW_TBT) ||
      BuildParams.starWith(EUrlRouter.SW_ADMIN)
    ) {
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_ADD,
        EDisabledHeaderTableCom.DISABLED_DELETE,
      ]);
    }
    if (
      BuildParams.starWith(EUrlRouter.SW_TEACHER) ||
      BuildParams.starWith(EUrlRouter.SW_ADMIN)
    ) {
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_CHECK,
      ]);
    }
  }, []);
  return (
    <div className="w-100 teacher-profile">
      <ToastContainer />
      <BaseHeaderTable
        placeholderSearch={BuildParams.isLocation(EUrlRouter.IS_RECORD) ? "Tìm kiếm theo tên học phần..." : "Tìm kiếm theo tên lớp..."}
        onClickShowHideDialog={handleShowHideDialog}
        onClickShowDialogDel={handleShowDialogDel}
        rowIdSelects={rowIdSelects}
        onClickChangeInputSearch={(value) => handleChangeInputSearch(value)}
        fileInputRef={fileInputRef}
        disabledElement={initialArrDisabled}
        onClickCheck={handleCheckProfile}
        onChangeSelectedCheckOption={handleChangeSelectedCheckOption}
        onClickExportExcel={handleExportExcel}
      />
      {columnTable?.length > 0 && (
        <BaseTableAdmin
          columns={columnTable}
          data={dataProfiles && dataProfiles.datas}
          onClickShowOptios={handleShowSetting}
          itemOptions={itemOptions}
          setRowIdSelects={setRowIdSelects}
          rowIdSelects={rowIdSelects}
          onClickOpenFile={handleIsOpenDialogFile}
          onClickOpenNote={(idRecord: string) => handleOpenDialogNote(idRecord)}
        />
      )}
      {dataProfiles.datas && (
        <BasePagination
          totalPage={dataProfiles.totalPages}
          onClick={(event, newPage) => handleChangePage(event, newPage)}
          totalRecords={dataProfiles.totalRecords}
          pageNumber={page.pageNumber}
        />
      )}
      {isShowDialog && (
        <DialogTeahcerProfileManagerment
          optionsSemester={optionsSemester}
          onChangeSemester={(value) => handleChangeSemester(value)}
          onClickDialog={handleShowHideDialog}
          selectedOptionSemester={selectedOptionSemester}
          handleFecthProfiles={() => fecthDataProfiles(page)}
          idProfile={idProfile}
          listFiles={listFileNames}
          optionClasses={optionClasses}
          onChangeClass={(value) => handleChangeClass(value)}
          selectedClass={selectedClasses}
        />
      )}
      {isopenDialogFile && (
        <BaseDialogFile
          fileList={listFileNames}
          onClickHideDialog={handleIsHidenDialogFile}
        />
      )}
      {isOpenDialogNote && (
        <BaseDialogNote
          valueNote={recordDataById}
          onClickHideDialog={handleHideDialogNote}
          onClickUpdateNode={(note: string) => handleUpdateNote(note)}
          isDisabledButton={
            dataUserContext.nhom_id === ERole.GVCN &&
            dataUserContext.nhom_id !== ERole.ADMIN
          }
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

export default TeacherProfile;
