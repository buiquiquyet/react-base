import { ListIcons } from "./listIcons.const";

export const  itemOptions = [
    { key: "1", label: ListIcons.getIcon("Chỉnh sửa") },
    { key: "2", label: ListIcons.getIcon("Xóa") },
  ];
export enum keyItem {
  EDIT = "1",
  DELETE = "2",
}