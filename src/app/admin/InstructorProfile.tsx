import BaseTableAdmin from "../../layout/component/Base-table-admin";
const rowsPerPageOptions= [5, 10, 20, 50]

function IntructorProfile() {
  return (
    <div className="w-100">
      <BaseTableAdmin columns={["Họ và tên"]} data={[2]} rowsPerPageOptions={rowsPerPageOptions}/>
    </div>
  );
}

export default IntructorProfile;
