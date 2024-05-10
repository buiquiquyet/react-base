import { Button } from "@mui/material";
import SVG from "react-inlinesvg";
import { ButtonColor, ButtonVariant } from "../constances/button.const";
interface PropsButton {
  title?: string;
  icon?: any;
  style?: any;
  color?: ButtonColor;
  onClick?: (value?: any) => void;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  typeBtn?: 'button' | 'submit' | 'reset';
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
  typeBtn
}) => {
  return (
    <Button
      className={`${className}`}
      style={style}
      color={color}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
      type={typeBtn ?? 'submit'}
    >
      {icon && (
        <SVG src={import.meta.env.VITE_PUBLIC_URL + `/icons/${icon}.svg`} />
      )}
      {title}
    </Button>
  );
};

export default BaseButton;
