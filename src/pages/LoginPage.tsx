import React from "react";
import { Form, Input, Button, message, Typography, Card, Row, Col } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../api/auth";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values);
      message.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        "Login failed. Please check your credentials and try again.",
      );
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            Log In
          </Title>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid email!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Log in
              </Button>
            </Form.Item>
          </Form>
          <Text style={{ display: "block", textAlign: "center" }}>
            Don't have an account? <Link to="/register">Register now</Link>
          </Text>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
