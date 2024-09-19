import React, { useState, useEffect } from "react";
import { Table, message, Spin } from "antd";
import { getDiscounts, Discount } from "../../api/discounts";

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Type",
    dataIndex: "discount_type",
    key: "discount_type",
  },
  {
    title: "Value",
    dataIndex: "discount_value",
    key: "discount_value",
    render: (value: number, record: Discount) => {
      return record.discount_type === "percentage" ? `${value}%` : `$${value}`;
    },
  },
  {
    title: "Expiration Date",
    dataIndex: "expiration_date",
    key: "expiration_date",
  },
  {
    title: "Usage Limit",
    dataIndex: "max_uses",
    key: "max_uses",
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    render: (isActive: boolean) => (isActive ? "Active" : "Inactive"),
  },
];

const DiscountList: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const fetchedDiscounts = await getDiscounts();
      setDiscounts(fetchedDiscounts);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      message.error("Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return <Table columns={columns} dataSource={discounts} rowKey="id" />;
};

export default DiscountList;
