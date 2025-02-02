import { toast } from "react-toastify";
import * as XLSX from "xlsx";
export class BuildExcel {
  public static export(exportData: any, titleColumn: string[]) {
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([titleColumn, ...exportData]);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "data.xlsx", {
        bookType: "xlsx",
        bookSST: false,
        type: "base64",
        // mimeType:
        //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      //   toast.success("Xuất file excel thành công.", {autoClose: 1800})
      return;
    } catch (error) {
      toast.success("Đã xảy ra lỗi.", { autoClose: 1800 });
      return;
    }
  }
  public static async import(
    file: File,
    titleColumn: string[]
  ): Promise<any[]> {
    try {
      const data = await new Promise<ArrayBuffer>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = () => {
          resolve(fileReader.result as ArrayBuffer);
        };

        fileReader.onerror = () => {
          reject("Đã xảy ra lỗi khi đọc file.");
        };
      });

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      const dataWithoutHeader = jsonData.slice(1);
      const formattedData = dataWithoutHeader.map((row: any) => {
        const obj: any = {};
        for (let i = 0; i < row.length; i++) {
          obj[titleColumn[i]] = row[i];
        }
        return obj;
      });

      return formattedData;
    } catch (error) {
      toast.success("Đã xảy ra lỗi.", { autoClose: 1800 });
      return [];
    }
  }
}
