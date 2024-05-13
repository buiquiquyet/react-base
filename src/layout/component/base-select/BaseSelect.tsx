import { Select } from "antd";
import React from "react";
interface SelectOption {
  value: any;
  label: string;
}
interface Props {
  options: SelectOption[];
  placeholder?: string;
  onChangeValue?: (value: any) => void;
  className?: string;
  value?: any,
}
const { Option } = Select;

const BaseSelect: React.FC<Props> = ({
  options,
  placeholder = "Chọn giá trị",
  onChangeValue,
  className = "",
  value,
}) => {
  return (
    <Select
      className={className}
      showSearch={options?.length > 8}
      style={{ width: 200 }}
      placeholder={placeholder}
      optionFilterProp="children"
      value={value}
      onChange={onChangeValue}
      filterOption={(input, option: any) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {options?.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default BaseSelect;
