import React from "react";
import { Card, List } from "antd";

const RecentActivity: React.FC = () => {
  const activities = [
    "New campaign created: Summer Sale",
    "Discount code SPRING20 activated",
    'Widget "Newsletter Popup" updated',
  ];

  return (
    <Card title="Recent Activity">
      <List
        size="small"
        dataSource={activities}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  );
};

export default RecentActivity;
