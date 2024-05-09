import BaseHeaderTable from "@/layout/component/base-header-table/BaseHeaderTable";
import BasePagination from "@/layout/component/base-pagination/BasePagination";
import BaseTableAdmin from "@/layout/component/base-table-admin/Base-table-admin";
import { ApiResponse } from "@/layout/component/constances/api-response";
import { ETableColumnType } from "@/layout/component/constances/table.const";
import BaseDialogConfirm from "@/layout/modal/BaseDialogConfim";
import {
  deleteRecord,
  deleteRecords,
  getListRecordByDepartmentId,
  getListRecordByUserId,
  updateCheckRecords,
  // getListRecords,
} from "@/redux/api/teacher/teacherRecordCrud";
import {
  deleteInstructor,
  deleteInstructors,
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

const column = [
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
if (BuildParams.starWith("/teacher")) {
  column.push({ label: "", accessor: "", type: ETableColumnType.ICON });
}
if (!BuildParams.starWith("/admin")) {
  column.unshift({
    label: "",
    accessor: "",
    type: ETableColumnType.CHECKBOX_ACTION,
  });
}
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
      ? BuildParams.isLocation("record")
        ? await deleteRecord(idProfile)
        : await deleteInstructor(idProfile)
      : BuildParams.isLocation("record")
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
  const handleUpdateNote = async () => {
    console.log(1);
    
  };
  const handleOpenDialogNote = async () => {
    setIsOpenDialogNote(!isOpenDialogNote);
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
    const rsDataProfiles: any = BuildParams.starWith("/tbt")
      ? await getListRecordByDepartmentId(dataUserContext?.id_khoa, page)
      : BuildParams.isLocation("record")
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
    if (BuildParams.starWith("/tbt")) {
      // arrDisabled.push(
      //   EDisabledHeaderTableCom.DISABLED_ADD,
      //   EDisabledHeaderTableCom.DISABLED_DELETE
      // );
      setInitialArrDisabled((prev: any) => [
        ...prev,
        EDisabledHeaderTableCom.DISABLED_ADD,
        EDisabledHeaderTableCom.DISABLED_DELETE,
      ]);
    }
    if (BuildParams.starWith("/teacher") || BuildParams.starWith("/admin")) {
      // arrDisabled.push(EDisabledHeaderTableCom.DISABLED_CHECK);
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
        placeholderSearch="Tìm kiếm theo tên học phần..."
        onClickShowHideDialog={handleShowHideDialog}
        onClickShowDialogDel={handleShowDialogDel}
        rowIdSelects={rowIdSelects}
        onClickChangeInputSearch={(value) => handleChangeInputSearch(value)}
        fileInputRef={fileInputRef}
        disabledElement={initialArrDisabled}
        onClickCheck={handleCheckProfile}
        onChangeSelectedCheckOption={handleChangeSelectedCheckOption}
      />
      <BaseTableAdmin
        columns={column}
        data={dataProfiles && dataProfiles.datas}
        onClickShowOptios={handleShowSetting}
        itemOptions={itemOptions}
        setRowIdSelects={setRowIdSelects}
        rowIdSelects={rowIdSelects}
        onClickOpenFile={handleIsOpenDialogFile}
        onClickOpenNote={handleOpenDialogNote}
      />
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
          onClickHideDialog={handleOpenDialogNote}
          onClickUpdateNode={handleUpdateNote}
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
