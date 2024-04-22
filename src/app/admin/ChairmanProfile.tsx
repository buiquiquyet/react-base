import BaseTableAdmin from "../../layout/component/Base-table-admin";
const rowsPerPageOptions = [5, 10, 20, 50];
const data = [
  { id: '11', name: "1", age: "18", faculty: "CNTT" },
  { id: '12', name: "2", age: "18", faculty: "CNTT" },
  { id: '13', name: "3", age: "18", faculty: "CNTT" },
  { id: '14', name: "4", age: "18", faculty: "CNTT" },
  { id: '15', name: "5", age: "18", faculty: "CNTT" },
  { id: '16', name: "6", age: "18", faculty: "CNTT" },
];
const column = [
  { header: "Tên", accessor: "name" },
  { header: "Tuổi", accessor: "age" },
  { header: "Khoa", accessor: "faculty" },
  { header: "Khoa", accessor: "faculty" },
];
function ChairmanProfile() {
  return (
    <div className="w-100">
      <BaseTableAdmin
        columns={column}
        data={data}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </div>
  );
}

export default ChairmanProfile;
