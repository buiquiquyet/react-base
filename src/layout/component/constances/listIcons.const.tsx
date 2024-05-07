import SVG from "react-inlinesvg";
export class ListIcons {
  public static actionList: { icon: any; label: string[] }[] = [
    {
      icon: "/icons/upload.svg",
      label: ["Tải lên", "Tải File"],
    },
    {
      icon: "/icons/add.svg",
      label: ["Thêm mới"],
    },
    {
      icon: "/icons/delete.svg",
      label: ["Xóa"],
    },
    {
      icon: "/icons/more.svg",
      label: ["Thông tin chi tiết", "Xem chi tiết"],
    },
    {
      icon: "/icons/edit.svg",
      label: ["Chỉnh sửa"],
    },
    {
      icon: "/icons/download.svg",
      label: ["Xuất Excel", "Xuất File"],
    },
  ];

  public static getIcon(label: string) {
    const item = this.actionList.find((item) => {
      if (Array.isArray(item.label)) {
        return item.label.includes(label);
      } else {
        return item.label === label;
      }
    });
    return item ? (
      <div className="d-flex gap-2">
        {label}
        <SVG src={`${import.meta.env.VITE_PUBLIC_URL}${item.icon}`} />
      </div>
    ) : null;
  }
  
}
