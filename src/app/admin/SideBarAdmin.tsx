
import { PropsWithChildren } from 'react';
import './styles/SideBarAdmin.scss'
interface Props extends PropsWithChildren {
    title?: string
}
function SideBarAdmin({children, title}: Props) {
    return ( 
        <div className="sidebar p-4 pt-3">
              <div className="w-100 d-flex align-items-center justify-content-center ">
                <span className="fw-bold fs-2" style={{color:"white"}}>{title}</span>
              </div>
              <div className="mt-4">
                {children}
              </div>
            </div>
     );
}

export default SideBarAdmin;