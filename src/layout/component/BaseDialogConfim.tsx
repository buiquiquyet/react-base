import { Modal } from "antd";
interface Props {
  onOk?: () => void;
  onCancel?: () => void;
  title: string;
  text: string;
  isModalOpen: boolean 
}
const BaseDialogConfirm: React.FC<Props> = ({
  onOk,
  onCancel,
  title,
  text,
  isModalOpen
}) => {
  return (
    <Modal
      title={title}
      onOk={onOk}
      open={isModalOpen}
      onCancel={onCancel}
      okText="Chấp nhận"
      cancelText="Từ chối"
    >
      <div>{text}</div>
    </Modal>
  );
};

export default BaseDialogConfirm;
