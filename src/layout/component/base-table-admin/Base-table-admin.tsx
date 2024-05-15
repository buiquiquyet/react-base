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
import { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ETableColumnType } from "../constances/table.const";
import { memo } from "react";
import "./../styles/BaseTable.scss";
import BaseOptionSettings from "../base-option-setting/BaseOptionSettings";
import { NumberApprove, TypeApprove } from "../constances/aprove.const";

interface PropsTable {
  columns: any[];
  data: any[];
  itemOptions?: any[];
  setRowIdSelects?: any;
  rowIdSelects?: any;
  onClickShowOptios?: (key: any, id: any) => void;
  onClickOpenFile?: (id: string) => void;
  onClickOpenNote?: (id: string) => void;
}
const BaseTableAdmin: React.FC<PropsTable> = ({
  columns,
  data,
  itemOptions,
  setRowIdSelects,
  rowIdSelects,
  onClickShowOptios,
  onClickOpenFile,
  onClickOpenNote,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const handleSelectAllChange = (event: any) => {
    if (data) {
      const isChecked = event.target.checked;
      setSelectAll(isChecked);
      const selectedRowIndexes = isChecked ? data?.map((item) => item.Id) : [];
      setSelectedRows(selectedRowIndexes);
      setRowIdSelects(selectedRowIndexes);
    }
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
    setRowIdSelects(newSelectedRows);
    setSelectAll(newSelectedRows.length === data.length);
  };
  useEffect(() => {
    if (rowIdSelects && rowIdSelects.length === 0) {
      setSelectAll(false);
      setSelectedRows([]);
    }
  }, [rowIdSelects]);
  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns?.map((column, index) => (
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
              data?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      style={{
                        borderRight: "1px solid #ddd",
                        width:
                          column.type === ETableColumnType.NOTE ? "150px" : "",
                      }}
                    >
                      {column.type === ETableColumnType.CHECKBOX_ACTION ? (
                        <div style={{ textAlign: "center" }}>
                          <Checkbox
                            checked={selectedRows.includes(row.Id)}
                            onChange={(event) =>
                              handleCheckboxChange(event, row.Id)
                            }
                          />
                        </div>
                      ) : column.type === ETableColumnType.ICON ? (
                        <div style={{ textAlign: "center" }}>
                          <BaseOptionSettings
                            idItem={row.Id}
                            onClick={onClickShowOptios}
                            icon={
                              <SVG
                                src={
                                  import.meta.env.VITE_PUBLIC_URL +
                                  "/icons/more.svg"
                                }
                              ></SVG>
                            }
                            items={itemOptions}
                          />
                        </div>
                      ) : column.type === ETableColumnType.FILE ? (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            Number(row[column.accessor]) > 0
                              ? onClickOpenFile?.(row.Id)
                              : null
                          }
                        >
                          {`(${row[column.accessor]}  file)`}
                        </div>
                      ) : column.type === ETableColumnType.NOTE ? (
                        <div
                          style={{
                            cursor: "pointer",
                            padding: row[column.accessor] === "" ? "20px" : "",
                            wordWrap: "break-word",
                            width: "120px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            paddingBlock: "20px",
                          }}
                          onClick={() => {
                            row[column.accessor]
                              ? onClickOpenNote?.(row.Id)
                              : null;
                          }}
                        >
                          {row[column.accessor]}{" "}
                        </div>
                      ) : column.type === ETableColumnType.STATUS ? (
                        <div>
                          <div
                            className="status-col"
                            style={{
                              minWidth: "120px",
                              background:
                                row[column.accessor] ===
                                  NumberApprove.PENDING ||
                                row[column.accessor] === ""
                                  ? "#94b8b8"
                                  : row[column.accessor] ===
                                    NumberApprove.APPROVED
                                  ? "#33ff33"
                                  : "red",
                            }}
                          >
                            {row[column.accessor] === NumberApprove.PENDING ||
                            row[column.accessor] === ""
                              ? TypeApprove.PENDING
                              : row[column.accessor] === NumberApprove.APPROVED
                              ? TypeApprove.APPROVED
                              : TypeApprove.NOT_APPROVED}
                          </div>
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
