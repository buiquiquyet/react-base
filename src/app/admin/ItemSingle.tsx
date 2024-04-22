import { PropsWithChildren } from "react";
import "./styles/ItemSingle.scss";
import SVG from "react-inlinesvg";

// export const closeSidebar = () => {
//   const element = document.getElementById('sk-sidebar-general');
//   const sidebar = document.getElementById('matte-screen-general');
//   if (sidebar && element) {
//     element.classList.remove('active');
//     sidebar.classList.remove('active');
//   }
// };

interface Props extends PropsWithChildren {
  onClick?: () => void;
  isActived?: boolean;
  classNameString?: string;
  icon?: string,
  title?: string
}

function ItemSingle({
  onClick,
  isActived = false,
  classNameString,
  icon,
  title
}: Props) {
  return (
    <div
      className={`item-single ${classNameString} ${isActived ? "active" : ""}`}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <div className="item-box">
        <span className="svg-box">
          <SVG
            src={import.meta.env.VITE_PUBLIC_URL + `/icons/${icon}.svg`}
          />
        </span>
        <span className="fs-6">{title}</span>
      </div>
    </div>
  );
}

export default ItemSingle;
