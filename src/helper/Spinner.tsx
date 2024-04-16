import {   HashLoader } from "react-spinners";
import './styles/spinner.scss'
function Spinner() {
    return ( 
        <div className="spinner">
            <HashLoader color={'#123abc'}  size={100} />
        </div>
     );
}

export default Spinner;