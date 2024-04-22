import { Button } from "@mui/material";
import SVG from "react-inlinesvg";
interface PropsButton {
  title?: string;
  icon?: any;
  style?: any;
  color?: ButtonColor;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
}
export  enum ButtonColor {
  Primary = "primary",
  Secondary = "secondary",
  Inherit = "inherit",
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}

export enum ButtonVariant {
  Contained = "contained",
  Outlined = "outlined",
  Text = "text",
}

const BaseButton: React.FC<PropsButton> = ({
  title,
  icon,
  style,
  color = ButtonColor.Primary,
  disabled = false,
  className = "",
  onClick,
  variant = ButtonVariant.Contained,
}) => {
  return (
    <Button
      className={`${className}`}
      style={style}
      color={color}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
    >
      {icon && (
        <SVG src={import.meta.env.VITE_PUBLIC_URL + `/icons/${icon}.svg`} />
      )}
      {title}
    </Button>
  );
};

export default BaseButton;
