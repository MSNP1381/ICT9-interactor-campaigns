import React from "react";
import { Typography, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CampaignList from "../components/Campaigns/CampaignList";

const { Title } = Typography;

const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2}>Campaigns</Title>
        <Button type="primary" onClick={() => navigate("/campaigns/create")}>
          Create Campaign
        </Button>
      </div>
      <CampaignList />
    </Space>
  );
};

export default CampaignsPage;
