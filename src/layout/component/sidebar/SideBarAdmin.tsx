
import { PropsWithChildren } from 'react';
import './SideBarAdmin.scss'
interface Props extends PropsWithChildren {
    title?: string
}
function SideBarAdmin({children, title}: Props) {
    return ( 
        <div className="sidebar  d-flex align-items-center p-4">
              <div className=" ">
                <span className="fw-bold fs-2" style={{color:"white"}}>{title}</span>
              </div>
              <div className=" d-flex  offset-xl-1 w-100 align-items-center justify-content-between">
                {children}
              </div>
            </div>
     );
}

export default SideBarAdmin;