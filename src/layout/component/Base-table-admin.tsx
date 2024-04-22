import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import BaseButton, { ButtonColor } from "./BaseButton";

interface PropsTable {
  columns: any[];
  data: any[];
  rowsPerPageOptions: any[];
}
const BaseTableAdmin: React.FC<PropsTable> = ({
  columns,
  data,
  rowsPerPageOptions,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0] || 5);
  //checkbox
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //checkboxx
  const handleSelectAllChange = (event: any) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    const selectedRowIndexes = isChecked ? data.map((item) => item.id) : [];
    setSelectedRows(selectedRowIndexes);
  };

  const handleCheckboxChange = (event: any, rowIndex: string) => {
    const isChecked = event.target.checked;
    let newSelectedRows = [...selectedRows];
    if (isChecked) {
      newSelectedRows.push(rowIndex);
    } else {
      newSelectedRows = newSelectedRows.filter((index) => index !== rowIndex);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.length === data.length);
  };
  return (
    <div>
      <div className="d-flex gap-3 mb-4">
        <div className="d-flex gap-3">
          <div>
            <BaseButton
              color={ButtonColor.Primary}
              onClick={() => {}}
              title="Thêm mới"
            ></BaseButton>
          </div>
          <div>
            <BaseButton
              color={ButtonColor.Error}
              onClick={() => {}}
              title="Xóa"
            ></BaseButton>
          </div>
        </div>
        
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  borderRight: "1px solid #ddd",
                  background: "#e5e5e5",
                  fontWeight: "bold",
                }}
              >
                <Checkbox
                  onChange={handleSelectAllChange}
                  checked={selectAll}
                />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  style={{
                    borderRight: "1px solid #ddd",
                    background: "#e5e5e5",
                    fontWeight: "bold",
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell
                  style={{ borderRight: "1px solid #ddd", width: "20px" }}
                >
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={(event) => handleCheckboxChange(event, row.id)}
                  />
                </TableCell>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={{ borderRight: "1px solid #ddd" }}
                  >
                    {row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default BaseTableAdmin;
