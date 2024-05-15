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
  getListRecordByDepartmentAndSubjectId,
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
import { ToastContainer } from "react-toastify";
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
import { EUrlRouter } from "@/layout/component/constances/roleUser";
import { BuildExcel } from "@/utils/BuildExcel";
import {
  getAllSubjects,
  getSubjectsByDepartmentId,
  getSubjectsByUserTdn,
} from "@/redux/api/teacher/SubjectCrud";
import { getAllDepartments } from "@/redux/api/admin/departmentCrud";
import { ErrorMessage } from "@/layout/component/constances/error-code.const";
import {
  ToastMessage,
  ToastStatus,
} from "@/layout/component/constances/toast-dialog";

const columnRecord: any = [
  { label: "", accessor: "", type: ETableColumnType.CHECKBOX_ACTION },
  {
    label: "Lớp",
    accessor: "lop",
    type: ETableColumnType.TEXT,
  },
  { label: "Học phần", accessor: "ten_hoc_phan", type: ETableColumnType.TEXT },
  { label: "Bộ môn", accessor: "bo_mon_id", type: ETableColumnType.TEXT },
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
  { label: "", accessor: "", type: ETableColumnType.ICON },
];
const columnInstructor: any = [
  { label: "", accessor: "", type: ETableColumnType.CHECKBOX_ACTION },
  {
    label: "Lớp",
    accessor: "lop",
    type: ETableColumnType.TEXT,
  },
  { label: "Đợt", accessor: "ky_id", type: ETableColumnType.TEXT },
  { label: "Họ tên GV", accessor: "ten_gv", type: ETableColumnType.TEXT },
  { label: "File", accessor: "countFile", type: ETableColumnType.FILE },
  { label: "", accessor: "", type: ETableColumnType.ICON },
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
  const [ProfileCoppy, setProfileDataCoppy] = useState<any>([]);
  const [ProfileCoppyToSearch, setProfileCoppyToSearch] = useState<any>([]);
  const pages: Page = new Page();
  const [page, setPages] = useState(pages);
  const [dataSubjects, setDataSubjects] = useState([]);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [optionSemester, setOptionSemester] = useState([]);
  const [optionClasses, setOptionClasses] = useState([]);
  const [optionSubjects, setOptionSubjects] = useState([]);
  const [optionDepartments, setOptionDepartments] = useState<any>([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [listFileNames, setListFileNames] = useState([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [isopenDialogFile, setIsOpenDialogFile] = useState(false);
  const [isOpenDialogNote, setIsOpenDialogNote] = useState(false);
  const [rowIdSelects, setRowIdSelects] = useState<string[]>([]);
  const [idProfile, setIdProfile] = useState("");
  const [idRecordUpdateNote, setIdRecordUpdateNote] = useState("");
  const [recordDataById, setRecordDataById] = useState();
  const [selectedCheck, setSelectedCheck] = useState(null);
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
      setSelectedSemester(null);
      setSelectedSubject(null);
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
  // const handleDebouncedSearch = debounce(
  //   (value: string, fieldName: any[], threshold: number) => {
  //     if (value) {
  //       if (ProfileCoppy?.length > 0) {
  //         const newDataUser = BuildSearch.Search(
  //           fieldName,
  //           ProfileCoppyToSearch,
  //           value,
  //           threshold
  //         );
  //         if (newDataUser.length > 0) {
  //           const coppyData = [...ProfileCoppy];
  //           const newArr = BuildParams.commonItemsOf2Arr(
  //             coppyData,
  //             newDataUser
  //           );
  //           setDataProfiles({ ...dataProfiles, datas: newArr });
  //         } else setDataProfiles({ ...dataProfiles, datas: [] });
  //       }
  //     } else {
  //       setDataProfiles({ ...dataProfiles, datas: ProfileCoppy });
  //     }
  //   },
  //   1000
  // );
  // const handleChangeSearch = (
  //   value: any,
  //   fieldName: any[],
  //   threshold: number
  // ) => {
  //   handleDebouncedSearch(value, fieldName, threshold);
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
      ProfileCoppyToSearch
    );
    if (newDatas?.length > 0) {
      const coppyData = [...ProfileCoppy];
      const newArr = BuildParams.commonItemsOf2Arr(coppyData, newDatas);
      setDataProfiles({ ...dataProfiles, datas: newArr });
    } else setDataProfiles({ ...dataProfiles, datas: ProfileCoppy });
  };
  const handleChangeSemester = (value: any) => {
    setSelectedSemester(value);
  };
  const handleChangeClass = (value: any) => {
    setSelectedClasses(value);
  };
  const handleChangeSubject = (value: any) => {
    setSelectedSubject(value);
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
      ToastMessage.show(ToastStatus.success, rs.data.message, () => {
        fecthDataProfiles(page);
        setIdProfile("");
      });
    } else {
      ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
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

        ToastMessage.show(
          ToastStatus.success,
          rsCheckProfile.data.message,
          () => fecthDataProfiles(page)
        );
      }
    } else ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_STATUS_CHECK);
  };

  const handleUpdateNote = async (note: string) => {
    const rsUpdateNote = await updateNoteRecord(idRecordUpdateNote, note);
    if (rsUpdateNote.data.message) {
      setIsOpenDialogNote(!isOpenDialogNote);
      ToastMessage.show(ToastStatus.success, rsUpdateNote.data.message, () => {
        fecthDataProfiles(page);
      });
    } else {
      ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
    }
  };
  const handleOpenDialogNote = async (idRecord: string) => {
    const rsGetRecordById = await getRecordById(idRecord);
    if (rsGetRecordById.data.message) {
      setRecordDataById(rsGetRecordById.data.data);
    } else {
      ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
    }
    setIdRecordUpdateNote(idRecord);
    setIsOpenDialogNote(!isOpenDialogNote);
  };
  const handleHideDialogNote = () => {
    setIsOpenDialogNote(false);
  };

  const handleExportExcel = () => {
    if (dataProfiles.datas?.length > 0) {
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
      const exportDataRecord = dataProfiles.datas.map((item: any) => [
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
      const exportDataInstructor = dataProfiles.datas.map((item: any) => [
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
    }
  };
  const checkIncludeColumn = (column: any, typeCheck: any) => {
    const isIncludes = column.some((item: any) => item.type === typeCheck);
    return isIncludes;
  };
  const handleSetColumnTableAddIcon = () => {
    if (
      BuildParams.starWith(EUrlRouter.SW_TBT_TBT) ||
      (BuildParams.starWith(EUrlRouter.SW_ADMIN) &&
        checkIncludeColumn(columnTable, ETableColumnType.ICON))
    ) {
      const ColumnTableByUrl = BuildParams.isLocation(EUrlRouter.IS_INSTRUCTOR)
        ? columnInstructor
        : columnRecord;
      const newColumnTable = ColumnTableByUrl.filter(
        (item: any) => item.type !== ETableColumnType.ICON
      );
      setColumnTable(newColumnTable);
    }
  };
  const handleSetColumnTableAddCheckBox = () => {
    if (BuildParams.starWith(EUrlRouter.SW_ADMIN)) {
      const ColumnTableByUrl = BuildParams.isLocation(EUrlRouter.IS_INSTRUCTOR)
        ? columnInstructor
        : columnRecord;
      const newColumnTable = ColumnTableByUrl.filter(
        (item: any) =>
          item.type !== ETableColumnType.CHECKBOX_ACTION &&
          item.type !== ETableColumnType.ICON
      );
      setColumnTable(newColumnTable);
    }
  };

  const fecthDataSemesters = () => {
    getAllSemesters()
      .then((res: any) => {
        if (res.data.message) {
          const newSemesters = res.data.datas.map((item: any) => {
            return {
              value: item.Id,
              label: item.ten,
            };
          });
          setOptionSemester(newSemesters);
        } else setOptionSemester([]);
      })
      .catch(() => {
        ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
      });
  };
  const handelFectdDataInUrl2TBT = async () => {
    const rsSJbyUserId = await getSubjectsByUserTdn(
      dataUserContext?.tendangnhap
    );
    if (rsSJbyUserId.data.data) {
      const rsRecordByDeAndSj = await getListRecordByDepartmentAndSubjectId(
        dataUserContext?.id_khoa,
        rsSJbyUserId.data.data.Id,
        page
      );
      return rsRecordByDeAndSj;
    }
    return;
  };

  const fecthDataProfiles = async (page: Page) => {
    setSelectedSubject(null);
    setSelectedSemester(null);
    setListFileNames([]);
    const rsDataProfiles: any = BuildParams.starWith(EUrlRouter.SW_TBT_TBT)
      ? await handelFectdDataInUrl2TBT()
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
      const newSemester = [...optionSemester];
      const newDatas = arrResponse.map((itemProfile: any) => {
        const name_Semesters = newSemester
          .filter(
            (itemSemester: any) => itemProfile.ky_id === itemSemester.value
          )
          .map((item: any) => item.label)
          .join("");
        return {
          ...itemProfile,
          ky_id: name_Semesters,
        };
      });
      setProfileCoppyToSearch(newDatas);
      const newSubjects = [...dataSubjects];
      const newDataSeconds = newDatas.map((itemProfile: any) => {
        const name_Subjects = newSubjects
          .filter(
            (itemSubject: any) => itemProfile.bo_mon_id === itemSubject.value
          )
          .map((item: any) => item.label)
          .join("");
        return {
          ...itemProfile,
          bo_mon_id: name_Subjects,
        };
      });
      setProfileDataCoppy(newDataSeconds);
      setDataProfiles({
        ...rsDataProfiles.data,
        datas: newDataSeconds,
      });
    } else {
      setDataProfiles([] as any);
    }
  };
  const fecthDataDepartments = () => {
    getAllDepartments()
      .then((res: any) => {
        if (res.data.message) {
          const newDatas = res.data.datas.map((item: any) => {
            return {
              value: item.id_khoa,
              label: item.name_khoa,
            };
          });
          setOptionDepartments(newDatas);
        } else {
          ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
          setOptionDepartments([] as any);
        }
      })
      .catch(() => {
        ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
        setOptionDepartments([] as any);
      });
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
      ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
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
          ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
          setOptionClasses([] as any);
        }
      })
      .catch(() => {
        ToastMessage.show(ToastStatus.error, ErrorMessage.ERR_RESPONSE_API);
        setOptionClasses([] as any);
      });
  };
  const handleFetchSubjectByDepartmentId = async (idKhoa: string) => {
    const rs = await fecthDataSubjectsByDepartmentId(idKhoa);
    if (rs) setDataSubjects(rs);
  };
  const fecthDataSubjectsByDepartmentId = async (idKhoa: string) => {
    const rsSubjects = await getSubjectsByDepartmentId(idKhoa);
    if (rsSubjects.data.message) {
      const newSubjects = rsSubjects.data.data?.map((item: any) => {
        return {
          value: item.Id,
          label: item.ten !== "" ? item.ten : null,
        };
      });
      return newSubjects;
    } else return false;
  };
  const fecthDataSubjects = async () => {
    const rsSubjects = await getAllSubjects();
    if (rsSubjects.data.message) {
      const newSubjects = rsSubjects.data.datas?.map((item: any) => {
        return {
          value: item.Id,
          label: item.ten !== "" ? item.ten : null,
        };
      });
      setDataSubjects(newSubjects);
    } else setDataSubjects([]);
  };
  useEffect(() => {
    const fecthAlls = async () => {
      await Promise.all([
        fecthDataSemesters(),
        fecthDataClasses(),
        fecthDataSubjects(),
        fecthDataDepartments(),
      ]);
      const rs = await fecthDataSubjectsByDepartmentId(
        dataUserContext?.id_khoa
      );
      if (rs) setOptionSubjects(rs);
      else setOptionSubjects([]);
    };
    fecthAlls();
  }, [page, location.pathname]);
  useEffect(() => {
    fecthDataFileByIdProfile(idProfile);
  }, [idProfile, location.pathname]);
  useEffect(() => {
    if (dataUserContext && optionSemester && optionSemester.length > 0) {
      fecthDataProfiles(page);
    }
  }, [
    optionSemester,
    optionSubjects,
    dataUserContext,
    page,
    location.pathname,
  ]);
  useEffect(() => {
    setDataProfiles({
      currentPage: 1,
      datas: [],
      message: "",
      totalPages: 0,
      totalRecords: 0,
    });
    if (dataUserContext && columnTable?.length > 0) {
      setColumnTable([]);
      if (columnTable.length > 0) {
        if (BuildParams.isLocation(EUrlRouter.IS_INSTRUCTOR)) {
          setColumnTable(columnInstructor);
        } else setColumnTable(columnRecord);
        handleSetColumnTableAddIcon();
        handleSetColumnTableAddCheckBox();
      }
    }
  }, [location.pathname]);
  useEffect(() => {
    setInitialArrDisabled(initArrDisabled);
    if (
      (BuildParams.starWith(EUrlRouter.SW_TBT) ||
        BuildParams.starWith(EUrlRouter.SW_ADMIN)) &&
      !BuildParams.starWith(EUrlRouter.SW_TBT_GVCN)
    ) {
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_ADD,
        EDisabledHeaderTableCom.DISABLED_DELETE,
      ]);
    }
    if (
      BuildParams.starWith(EUrlRouter.SW_ADMIN) &&
      BuildParams.isLocation(EUrlRouter.IS_INSTRUCTOR)
    ) {
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_SEARCH,
      ]);
    }
    if (
      BuildParams.starWith(EUrlRouter.SW_TEACHER) ||
      BuildParams.starWith(EUrlRouter.SW_ADMIN) ||
      BuildParams.starWith(EUrlRouter.SW_TBT_GVCN)
    ) {
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_CHECK,
      ]);
    }
    if (BuildParams.isLocation(EUrlRouter.IS_INSTRUCTOR)) {
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_DEPARTMENT,
        EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_SUBJECT,
      ]);
    } else {
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_CLASS,
        EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_DEPARTMENT,
      ]);
    }
  }, [location.pathname]);
  return (
    <div className="w-100 teacher-profile">
      <ToastContainer />
      <BaseHeaderTable
        placeholderSearch={
          BuildParams.isLocation(EUrlRouter.IS_RECORD)
            ? "Tìm kiếm theo tên học phần..."
            : "Tìm kiếm theo tên lớp..."
        }
        onClickShowHideDialog={handleShowHideDialog}
        onClickShowDialogDel={handleShowDialogDel}
        rowIdSelects={rowIdSelects}
        onClickChangeInputSearch={(value) =>
          handleChangeSearchSelected(value.target.value, ["ten_hoc_phan"], 0.5)
        }
        fileInputRef={fileInputRef}
        disabledElement={initialArrDisabled}
        onClickCheck={handleCheckProfile}
        onChangeSelectedCheckOption={handleChangeSelectedCheckOption}
        onClickExportExcel={handleExportExcel}
        optionDepartment={optionDepartments}
        optionSubject={dataSubjects}
        optionClass={optionClasses}
        onChangeSelectedDepartmentOption={handleFetchSubjectByDepartmentId}
        onChangeSelectedSubjectOption={(value) =>
          handleChangeSearchSelected(value, ["bo_mon_id"], 0)
        }
        onChangeSelectedClassOption={(value) =>
          handleChangeSearchSelected(value, ["lop"], 0)
        }
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
          optionsSemester={optionSemester}
          optionClasses={optionClasses}
          optionsSubject={optionSubjects}
          onChangeSemester={(value) => handleChangeSemester(value)}
          onChangeClass={(value) => handleChangeClass(value)}
          onChangeSubject={(value) => handleChangeSubject(value)}
          handleFecthProfiles={() => fecthDataProfiles(page)}
          onClickDialog={handleShowHideDialog}
          selectedSemester={selectedSemester}
          selectedOptionSubject={selectedSubject}
          selectedClass={selectedClasses}
          idProfile={idProfile}
          listFiles={listFileNames}
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
          isDisabledButton={!BuildParams.starWith(EUrlRouter.SW_TBT_TBT)}
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
