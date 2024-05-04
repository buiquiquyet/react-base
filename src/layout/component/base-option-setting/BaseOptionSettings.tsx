import {  Dropdown } from "antd";

interface Props {
  items?: any[];
  onClick?: (key: any, id: any) => void;
  icon?: any;
  idItem?: any
}
const BaseOptionSettings: React.FC<Props> = ({ items, onClick, icon, idItem  }) => {
    const handleItemClick = (key: any) => {
        if (onClick) {
          onClick(key, idItem); 
        }
      };
  return (
    <Dropdown
      menu={{
        items,
        onClick: handleItemClick,
      }}
      trigger={['click']}
      placement="bottomLeft"
      arrow={{
        pointAtCenter: true,
      }}
    >
      <div>{icon}</div>
    </Dropdown>
  );
};

export default BaseOptionSettings;
