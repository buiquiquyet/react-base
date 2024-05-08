import SVG from "react-inlinesvg";
import './styles/BaseDialog.scss'
interface BaseDialogProps {
  onClickHideDialog?: () => void;
  label?: string,
  children?: any;
  style?: any
}
function BaseDialog({ onClickHideDialog, children, label, style }: BaseDialogProps) {
  return (
    <div className="dialog">
      <div className="over-flow"></div>
      <div className="dialog-content" style={style}>
        <div className="dialog-header mb-3">
          <div className="dialog-title fw-bold fs-5">{label}</div>
          <div className="dialog-icon" onClick={onClickHideDialog}>
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
