import BaseButton from "../base-button/BaseButton";
import BaseSearch from "../base-search/BaseSearch";
import { ButtonColor } from "../constances/button.const";
import { EDisabledHeaderTableCom } from "../constances/disabledHeaderTable";
interface Props {
  onClickShowHideDialog?: () => void;
  onClickShowDialogDel?: () => void;
  rowIdSelects?: any[];
  onClickChangeInputSearch?: (value: any) => void;
  fileInputRef?: any;
  onClickImportExcel?: (e: any) => void;
  onClickButtonInputFile?: () => void;
  onClickExportExcel?: () => void;
  disabledElement?: EDisabledHeaderTableCom[];
}
const BaseHeaderTable: React.FC<Props> = ({
  onClickShowHideDialog,
  onClickShowDialogDel,
  rowIdSelects,
  onClickChangeInputSearch,
  fileInputRef,
  onClickImportExcel,
  onClickButtonInputFile,
  onClickExportExcel,
  disabledElement,
}) => {
  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex gap-3 mb-4">
        <div className="d-flex gap-3">
          {!disabledElement?.includes(EDisabledHeaderTableCom.DISABLED_ADD) && (
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
            <div>
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
          EDisabledHeaderTableCom.DISABLED_SEARCH
        ) && (
          <div>
            <BaseSearch
              placeholder="Tìm kiếm..."
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
  );
};

export default BaseHeaderTable;
