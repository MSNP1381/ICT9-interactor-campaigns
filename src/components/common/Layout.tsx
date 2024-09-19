import React from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined, DashboardOutlined, RocketOutlined, GiftOutlined, AppstoreOutlined } from "@ant-design/icons";
import { logout } from "../../api/auth";

const { Header, Sider } = Layout;
const { SubMenu } = Menu;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <SubMenu key="campaigns" icon={<RocketOutlined />} title="Campaigns">
            <Menu.Item key="campaigns-list">
              <Link to="/campaigns">All Campaigns</Link>
            </Menu.Item>
            <Menu.Item key="campaign-create">
              <Link to="/campaigns/create">Create Campaign</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="discounts" icon={<GiftOutlined />}>
            <Link to="/discounts">Discounts</Link>
          </Menu.Item>
          <SubMenu key="widgets" icon={<AppstoreOutlined />} title="Widgets">
            <Menu.Item key="widgets-list">
              <Link to="/widgets">All Widgets</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Avatar icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        {children}
      </Layout>
    </Layout>
  );
};

export default AppLayout;
