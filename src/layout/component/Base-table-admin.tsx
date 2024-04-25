import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import SVG from "react-inlinesvg";
import { ETableColumnType } from "./constances/table.const";
import { memo } from "react";
import "./styles/BaseTable.scss";
interface PropsTable {
  columns: any[];
  data: any[];
  onClick?: () => void
}
const BaseTableAdmin: React.FC<PropsTable> = ({ columns, data, onClick }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectAllChange = (event: any) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    const selectedRowIndexes = isChecked ? data.map((item) => item.Id) : [];
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  style={{
                    borderRight: "1px solid #ddd",
                    background: "#e5e5e5",
                    fontWeight: "bold",
                  }}
                >
                  {column.type === ETableColumnType.CHECKBOX_ACTION ? (
                    <Checkbox
                      onChange={handleSelectAllChange}
                      checked={selectAll}
                    />
                  ) : column.type === ETableColumnType.ICON ? (
                    <SVG
                      src={
                        import.meta.env.VITE_PUBLIC_URL + "/icons/setting.svg"
                      }
                    ></SVG>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      style={{ borderRight: "1px solid #ddd" }}
                    >
                      {column.type === ETableColumnType.CHECKBOX_ACTION ? (
                        <Checkbox
                          checked={selectedRows.includes(row.Id)}
                          onChange={(event) =>
                            handleCheckboxChange(event, row.Id)
                          }
                        />
                      ) : column.type === ETableColumnType.ICON ? (
                        <div onClick={onClick}>
                          <SVG
                            src={
                              import.meta.env.VITE_PUBLIC_URL +
                              "/icons/more.svg"
                            }
                          ></SVG>
                        </div>
                      ) : (
                        row[column.accessor]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="w-100 p-3">
                  Không có dữ liệu!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default memo(BaseTableAdmin);
