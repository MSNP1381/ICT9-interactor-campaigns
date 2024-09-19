import React from "react";
import { Row, Col } from "antd";
import DashboardOverview from "../components/Dashboard/DashboardOverview";
import RecentActivity from "../components/Dashboard/RecentActivity";
import QuickActions from "../components/Dashboard/QuickActions";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <DashboardOverview />
        </Col>
        <Col span={12}>
          <RecentActivity />
        </Col>
        <Col span={12}>
          <QuickActions />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
