import React from "react";
import { Card, Typography, Descriptions } from "antd";

const { Title } = Typography;

const UserProfilePage: React.FC = () => {
  // TODO: Fetch user data from API or state management
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
  };

  return (
    <Card>
      <Title level={2}>User Profile</Title>
      <Descriptions bordered>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserProfilePage;
