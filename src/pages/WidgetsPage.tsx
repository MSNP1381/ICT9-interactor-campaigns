import React, { useState } from "react";
import { Typography, Space } from "antd";
import WidgetList from "../components/Widgets/WidgetList";
import WidgetCreator from "../components/Widgets/WidgetCreator";

const { Title } = Typography;

const WidgetsPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWidgetCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={2}>Widgets</Title>
      <WidgetCreator onWidgetCreated={handleWidgetCreated} />
      <WidgetList refreshTrigger={refreshTrigger} />
    </Space>
  );
};

export default WidgetsPage;
