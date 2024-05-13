import BaseButton from "../base-button/BaseButton";
import BaseSearch from "../base-search/BaseSearch";
import BaseSelect from "../base-select/BaseSelect";
// import BaseSelect from "../base-select/BaseSelect";
import { ButtonColor } from "../constances/button.const";
import { EDisabledHeaderTableCom } from "../constances/disabledHeaderTable";
interface Props {
  onClickShowHideDialog?: () => void;
  onClickShowDialogDel?: () => void;
  onClickChangeInputSearch?: (value: any) => void;
  onClickImportExcel?: (e: any) => void;
  onClickButtonInputFile?: () => void;
  onClickExportExcel?: () => void;
  onClickCheck?: () => void;
  onChangeSelectedCheckOption?: (valueCheck: any) => void;
  onChangeSelectedDepartmentOption?: (valueCheck: any) => void;
  onChangeSelectedSubjectOption?: (valueCheck: any) => void;
  onChangeSelectedClassOption?: (valueCheck: any) => void;
  optionDepartment?: any,
  optionSubject?: any,
  optionClass?: any,
  placeholderSearch?: string;
  fileInputRef?: any;
  rowIdSelects?: any[];
  disabledElement?: EDisabledHeaderTableCom[];
}
const optionChecks = [
  { value: "0", label: "Chờ duyệt" },
  { value: "1", label: "Đã duyệt" },
  { value: "2", label: "Không duyệt" },
];
const BaseHeaderTable: React.FC<Props> = ({
  onClickShowHideDialog,
  onClickShowDialogDel,
  onChangeSelectedCheckOption,
  onClickChangeInputSearch,
  onClickImportExcel,
  onClickButtonInputFile,
  onClickExportExcel,
  onClickCheck,
  onChangeSelectedDepartmentOption,
  onChangeSelectedClassOption,
  onChangeSelectedSubjectOption,
  optionDepartment,
  optionClass,
  optionSubject,
  placeholderSearch = "Tìm kiếm...",
  fileInputRef,
  rowIdSelects,
  disabledElement,
}) => {
  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex mb-4">
          <div className="d-flex ">
            {!disabledElement?.includes(
              EDisabledHeaderTableCom.DISABLED_ADD
            ) && (
              <div>
                <BaseButton
                  color={ButtonColor.Primary}
                  onClick={onClickShowHideDialog}
                  title="Thêm mới"
                ></BaseButton>
              </div>
            )}
            {!disabledElement?.includes(
              EDisabledHeaderTableCom.DISABLED_DELETE
            ) && (
              <div style={{ margin: "0 20px" }}>
                <BaseButton
                  color={ButtonColor.Error}
                  onClick={onClickShowDialogDel}
                  title="Xóa"
                  disabled={rowIdSelects?.length === 0}
                ></BaseButton>
              </div>
            )}
          </div>
          {!disabledElement?.includes(
            EDisabledHeaderTableCom.DISABLED_CHECK
          ) && (
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "20px" }}
            >
              <div style={{ marginRight: "20px" }}>
                <BaseButton
                  color={ButtonColor.Secondary}
                  onClick={onClickCheck}
                  title="Duyệt"
                  disabled={rowIdSelects?.length === 0}
                ></BaseButton>
              </div>
              <div className="d-flex">
                <BaseSelect
                  onChangeValue={onChangeSelectedCheckOption}
                  options={optionChecks}
                  placeholder="Chọn trạng thái..."
                />
              </div>
            </div>
          )}
          {!disabledElement?.includes(
            EDisabledHeaderTableCom.DISABLED_SEARCH
          ) && (
            <div>
              <BaseSearch
                placeholder={placeholderSearch}
                onChange={(value: any) => onClickChangeInputSearch?.(value)}
              />
            </div>
          )}
        </div>
        <div className="d-flex gap-3 mb-4">
          {!disabledElement?.includes(
            EDisabledHeaderTableCom.DISABLED_IMPORT
          ) && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onClickImportExcel}
                style={{ display: "none" }}
              />
              <BaseButton
                color={ButtonColor.Success}
                title="Nhập excel"
                onClick={onClickButtonInputFile}
              ></BaseButton>
            </div>
          )}
          {!disabledElement?.includes(
            EDisabledHeaderTableCom.DISABLED_EXPORT
          ) && (
            <div>
              <BaseButton
                color={ButtonColor.Info}
                onClick={onClickExportExcel}
                title="Xuất excel"
              ></BaseButton>
            </div>
          )}
        </div>
      </div>
      <div className="d-flex align-items-center mb-4">
        {!disabledElement?.includes(
          EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_DEPARTMENT
        ) && (
          <div className="d-flex align-items-center">
            <BaseSelect
              onChangeValue={onChangeSelectedDepartmentOption}
              options={optionDepartment}
              placeholder="Chọn khoa..."
            />
          </div>
        )}
        {!disabledElement?.includes(
          EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_SUBJECT
        ) && (
          <div
            className="d-flex align-items-center"
            style={{ margin: "0px 20px" }}
          >
            <BaseSelect
              onChangeValue={(value: string) => onChangeSelectedSubjectOption?.(value)}
              options={optionSubject}
              placeholder="Chọn bộ môn..."
            />
          </div>
        )}
        {!disabledElement?.includes(
          EDisabledHeaderTableCom.DISABLED_SEARCH_SELECT_CLASS
        ) && (
          <div className="d-flex align-items-center">
            <BaseSelect
              onChangeValue={onChangeSelectedClassOption}
              options={optionClass}
              placeholder="Chọn lớp..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseHeaderTable;
