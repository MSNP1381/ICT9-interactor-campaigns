import React from "react";
import { Typography, Button, Row, Col, Card, Space } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title level={1}>Interactive Ad Campaign Dashboard</Title>
              <Paragraph>
                Empower your business with engaging customer experiences.
                Create, manage, and analyze interactive advertising campaigns
                with ease.
              </Paragraph>
              <Button type="primary" size="large">
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </Space>
          </Col>
        </Row>
      </motion.div>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "2rem" }}>
        {["Campaigns", "Discounts", "Widgets"].map((feature, index) => (
          <Col xs={24} sm={8} key={feature}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt={feature}
                    src={`/images/${feature.toLowerCase()}.jpg`}
                  />
                }
              >
                <Card.Meta
                  title={feature}
                  description={`Manage your ${feature.toLowerCase()} effortlessly`}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LandingPage;
