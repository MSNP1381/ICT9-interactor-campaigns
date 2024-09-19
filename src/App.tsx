import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage";
import DiscountsPage from "./pages/DiscountsPage";
import WidgetsPage from "./pages/WidgetsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import AppLayout from "./components/common/Layout";
import AuthGuard from "./components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import CampaignCreator from "./components/Campaigns/CampaignCreator";
import CampaignEditor from "./components/Campaigns/CampaignEditor";
import WidgetEditor from "./components/Widgets/WidgetEditor";

const { Content } = Layout;

const App: React.FC = () => {
  const isAuthDisabled =
    import.meta.env.VITE_DISABLE_AUTH == true ||
    import.meta.env.VITE_DISABLE_AUTH == "true";
  console.log(
    import.meta.env.VITE_DISABLE_AUTH,
    Boolean(import.meta.env.VITE_DISABLE_AUTH),
  );
  const ProtectedRoutes = () => (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/campaigns" element={<CampaignsPage />} />
      <Route path="/campaigns/create" element={<CampaignCreator />} />
      <Route path="/campaigns/:campaignId" element={<CampaignEditor />} />
      <Route path="/discounts" element={<DiscountsPage />} />
      <Route path="/widgets" element={<WidgetsPage />} />
      <Route path="/widgets/edit/:widgetId" element={<WidgetEditor />} />
      <Route path="/profile" element={<UserProfilePage />} />
    </Routes>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {!isAuthDisabled && (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </>
        )}
        <Route
          path="*"
          element={
            isAuthDisabled ? (
              <AppLayout>
                <Content>
                  <ProtectedRoutes />
                </Content>
              </AppLayout>
            ) : (
              <AuthGuard>
                <AppLayout>
                  <Content style={{ padding: "20px" }}>
                    <ProtectedRoutes />
                  </Content>
                </AppLayout>
              </AuthGuard>
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
