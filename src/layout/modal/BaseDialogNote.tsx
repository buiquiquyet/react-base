import TextArea from "antd/es/input/TextArea";
import BaseDialog from "./BaseDialog";
import "./styles/BaseDialogFile.scss";
import BaseButton from "../component/base-button/BaseButton";
interface Props {
  onClickHideDialog: () => void;
  onClickUpdateNode: () => void;
}
const BaseDialogNote: React.FC<Props> = ({
  onClickHideDialog,
  onClickUpdateNode,
}) => {
  return (
    <BaseDialog
      style={{ width: "500px " }}
      onClickHideDialog={onClickHideDialog}
    >
      <div className="base-dialog-file">
        <div className="d-flex flex-column gap-3 align-items-end mt-2">
          <TextArea style={{fontSize:"16px"}} />
          <div>
            <BaseButton title="Cập nhật" onClick={onClickUpdateNode} />
          </div>
        </div>
      </div>
    </BaseDialog>
  );
};

export default BaseDialogNote;
