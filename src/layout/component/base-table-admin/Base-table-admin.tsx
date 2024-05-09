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
import { useContext, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ETableColumnType } from "../constances/table.const";
import { memo } from "react";
import "./../styles/BaseTable.scss";
import BaseOptionSettings from "../base-option-setting/BaseOptionSettings";
import { MyContext } from "@/AppRouter";

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
  const dataUserContext: any = useContext(MyContext);

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
                            overflowWrap: "break-word",
                            width: "100%",
                          }}
                          onClick={() => {
                            console.log(1);

                            if (
                              (dataUserContext &&
                                dataUserContext.nhom_id !== "GVCN") ||
                              dataUserContext.nhom_id !== "ADMIN"
                            ) {
                              onClickOpenNote?.(row.Id);
                            }
                          }}
                        >
                          {row[column.accessor]} asdggggggggggggggggggggggggggg
                        </div>
                      ) : column.type === ETableColumnType.STATUS ? (
                        <div>
                          <div
                            className="status-col"
                            style={{
                              background:
                                row[column.accessor] === "0" ||
                                row[column.accessor] === ""
                                  ? "#94b8b8"
                                  : row[column.accessor] === "1"
                                  ? "#33ff33"
                                  : "#ff704d",
                            }}
                          >
                            {row[column.accessor] === "0" ||
                            row[column.accessor] === ""
                              ? "Chờ duyệt"
                              : row[column.accessor] === "1"
                              ? "Đã duyệt"
                              : "Không duyệt"}
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
