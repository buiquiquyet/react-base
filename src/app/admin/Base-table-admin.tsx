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

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCheckboxChange = (rowIndex: any) => {
    console.log(rowIndex);
  };
  return (
    <>
      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ borderRight: "1px solid #ddd" }}>
                <Checkbox />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  style={{ borderRight: "1px solid #ddd" }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell style={{ borderRight: "1px solid #ddd", width:'20px' }}>
                  <Checkbox onChange={() => handleCheckboxChange(rowIndex)} />
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
    </>
  );
};

export default BaseTableAdmin;
