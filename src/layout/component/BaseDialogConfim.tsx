import { Modal } from "antd";

interface Props {
    onOk?: () => void,
    onCancel?: () => void,
    title?: string

}
const BaseDialogConfirm: React.FC<Props> ({onOk,onCancel }) {
    return ( 
        <Modal
        title="Confirm"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText="OK"
        cancelText="Cancel"
      >
        <p>Are you sure you want to do this?</p>
      </Modal>
     );
}

export default BaseDialogConfirm ;