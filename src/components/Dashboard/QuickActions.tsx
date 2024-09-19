import React from "react";
import { Card, Button, Space } from "antd";

const QuickActions: React.FC = () => {
  return (
    <Card title="Quick Actions">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button type="primary" block>
          Create New Campaign
        </Button>
        <Button block>Add New Discount</Button>
        <Button block>Create Widget</Button>
      </Space>
    </Card>
  );
};

export default QuickActions;
