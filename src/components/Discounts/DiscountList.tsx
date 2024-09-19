import React from "react";
import { Table } from "antd";

interface Discount {
  id: string;
  name: string;
  type: string;
  value: number;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const DiscountList: React.FC = () => {
  // TODO: Fetch discounts from API or state management
  const discounts: Discount[] = [];

  return <Table columns={columns} dataSource={discounts} rowKey="id" />;
};

export default DiscountList;
