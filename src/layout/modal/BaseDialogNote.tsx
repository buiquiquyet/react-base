import TextArea from "antd/es/input/TextArea";
import BaseDialog from "./BaseDialog";
import "./styles/BaseDialogFile.scss";
import BaseButton from "../component/base-button/BaseButton";
import {  useState } from "react";
interface Props {
  valueNote: any
  onClickHideDialog: () => void;
  onClickUpdateNode: (note: string) => void;
  isDisabledButton?: boolean;
}
const BaseDialogNote: React.FC<Props> = ({
  valueNote,
  onClickHideDialog,
  onClickUpdateNode,
  isDisabledButton,
}) => {
  const [note, setNote] = useState(valueNote.ghichu)
  const handleChangeNote = (event: any) => {
    setNote(event.target.value);
  };
  return (
    <BaseDialog
      style={{ width: "500px " }}
      onClickHideDialog={onClickHideDialog}
    >
      <div className="base-dialog-file">
        <div className="d-flex flex-column gap-3 align-items-end mt-2">
          <TextArea style={{ fontSize: "16px" }}  value={note} onChange={handleChangeNote}/>
          {!isDisabledButton && (
            <div>
              <BaseButton title="Cập nhật" onClick={() => onClickUpdateNode(note)} />
            </div>
          )}
        </div>
      </div>
    </BaseDialog>
  );
};

export default BaseDialogNote;
