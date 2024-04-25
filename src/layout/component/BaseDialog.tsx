import SVG from "react-inlinesvg";
import './styles/BaseDialog.scss'
interface BaseDialogProps {
  onClickDialog?: () => void;
  label?: string,
  children?: any;
}
function BaseDialog({ onClickDialog, children, label }: BaseDialogProps) {
  return (
    <div className="dialog">
      <div className="over-flow"></div>
      <div className="dialog-content">
        <div className="dialog-header">
          <div className="dialog-title fw-bold fs-5">{label}</div>
          <div className="dialog-icon" onClick={onClickDialog}>
            <SVG
              src={import.meta.env.VITE_PUBLIC_URL + "/icons/close.svg"}
            ></SVG>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default BaseDialog;
