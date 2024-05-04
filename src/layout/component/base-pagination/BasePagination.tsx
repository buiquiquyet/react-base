import { Pagination } from "@mui/material";
import "./../styles/BasePagination.scss";
import { memo } from "react";
interface Props {
  totalPage?: number;
  onClick?: (event: any, newPage: any) => void;
  totalRecords?: number;
  pageNumber?: number;
}

const BasePagination: React.FC<Props> = ({
  totalPage,
  onClick,
  totalRecords,
  pageNumber,
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-4 w-100">
      <div
        className="p-1"
        style={{
          fontSize: "14px",
          border: "1px solid #ccc",
          color: "var(--primary)",
        }}
      >
        Tất cả {totalRecords} dòng
      </div>
      <Pagination
        count={totalPage}
        page={pageNumber}
        onChange={onClick}
        className={"custom-pagination-ul-class"}
      />
    </div>
  );
};

export default memo(BasePagination);
