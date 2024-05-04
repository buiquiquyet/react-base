interface Props {
  placeholder?: string;
  style?: any;
  onChange?: (value: any) => void;
  // valueSearch?: string
}
const BaseSearch: React.FC<Props> = ({ placeholder, style, onChange,  }) => {
  return (
    <input
      type="text"
      className="form-control"
      placeholder={placeholder}
      onChange={onChange}
      // value={valueSearch}
      aria-label="Search"
      aria-describedby="basic-addon1"
      style={{ width: "300px", ...style }}
    />
  );
};

export default BaseSearch;
