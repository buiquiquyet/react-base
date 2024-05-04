import BaseTableAdmin from "../../layout/component/base-table-admin/Base-table-admin";

function IntructorProfile() {
  return (
    <div className="w-100">
      <BaseTableAdmin columns={["Họ và tên"]} data={[2]} />
    </div>
  );
}

export default IntructorProfile;
