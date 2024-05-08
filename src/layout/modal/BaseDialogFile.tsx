import { Upload } from "antd";
import BaseDialog from "./BaseDialog";
import "./styles/BaseDialogFile.scss";
import config from "@/utils/config";
import { BaseIframe } from "./BaseIframe";
interface Props {
  fileList: any[];
  onClickHideDialog: () => void;
}
const BaseDialogFile: React.FC<Props> = ({ fileList, onClickHideDialog }) => {
  const onPreview = async (file: any) => {
    BaseIframe.openIframe(file, file.url);
  };
  return (
    <BaseDialog
      style={{ width: "500px " }}
      onClickHideDialog={onClickHideDialog}
    >
      <div className="base-dialog-file">
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="text"
          fileList={fileList.map((file: any) => ({
            uid: file.uid || file.Id,
            name: file.name || file.ten,
            url: file.originFileObj ? null : `${config.FILE_URL}${file.ten}`,
            ...file,
            status: "done",
          }))}
          onPreview={onPreview}
          accept=".pdf"
        ></Upload>
      </div>
    </BaseDialog>
  );
};

export default BaseDialogFile;
