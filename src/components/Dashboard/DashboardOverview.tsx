import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col } from "antd";
import { getWidgets } from "../../api/widgets";

const DashboardOverview: React.FC = () => {
  const [widgetCount, setWidgetCount] = useState(0);

  useEffect(() => {
    fetchWidgetCount();
  }, []);

  const fetchWidgetCount = async () => {
    try {
      const widgets = await getWidgets();
      setWidgetCount(widgets.length);
    } catch (error) {
      console.error("Error fetching widget count:", error);
    }
  };

  return (
    <Card title="Dashboard Overview">
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="Active Campaigns" value={5} />
        </Col>
        <Col span={8}>
          <Statistic title="Active Discounts" value={3} />
        </Col>
        <Col span={8}>
          <Statistic title="Active Widgets" value={widgetCount} />
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardOverview;
