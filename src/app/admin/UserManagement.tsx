import { useEffect, useState } from "react";
import BaseTableAdmin from "../../layout/component/Base-table-admin";
import { getAllUsers } from "@/redux/admin/user";
import { toast } from "react-toastify";

function UserManagement() {
  const [dataUsers, setDataUsers] = useState([]);
  const fecthDataUsers = () => {
    getAllUsers()
      .then((res: any) => {
        if (res.data) {
          setDataUsers(res.data);
        } else {
          toast.error(res.data.error);
          setDataUsers([]);
        }
      })
      .catch((error: any) => {
        toast.error(error);
        setDataUsers([]);
      });
  };
  useEffect(() => {
    fecthDataUsers();
  }, []);
  console.log(dataUsers);
  
  return (
    <div className="w-100">
      {/* <BaseTableAdmin
        columns={column}
        data={data}
        rowsPerPageOptions={rowsPerPageOptions}
      /> */}
    </div>
  );
}

export default UserManagement;
