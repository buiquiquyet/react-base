import { PropsWithChildren } from "react";
import "./SideBarAdmin.scss";
interface Props extends PropsWithChildren {
  title?: string;
}
function SideBarAdmin({ children, title }: Props) {
  return (
    <div className="sidebar  d-flex align-items-center gap-4 " style={{padding: '0px 40px'}}>
      <div className="">
        <span className="fw-bold fs-2" style={{ color: "white" }}>
          {title}
        </span>
      </div>
      <div className="d-flex offset-xl-1  w-100 ml-3 align-items-center justify-content-between" >
        {children}
      </div>
    </div>
  );
}

export default SideBarAdmin;
