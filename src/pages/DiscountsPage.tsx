import React from "react";
import { Typography, Space } from "antd";
import DiscountList from "../components/Discounts/DiscountList";
import DiscountCreator from "../components/Discounts/DiscountCreator";

const { Title } = Typography;

const DiscountsPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={2}>Discounts</Title>
      <DiscountCreator />
      <DiscountList />
    </Space>
  );
};

export default DiscountsPage;
