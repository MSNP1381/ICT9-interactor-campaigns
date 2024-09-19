import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Statistic, Table, Typography, Progress, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getCampaign } from '../../api/campaigns';
import { getCampaignAnalytics } from '../../api/analytics';
import { UserOutlined, InteractionOutlined, BarChartOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CampaignAnalytics {
  totalInteractions: number;
  uniqueUsers: number;
  widgetInteractions: { [key: string]: number };
  dailyInteractions: { date: string; interactions: number }[];
  conversionRate: number;
  averageEngagementTime: number;
  deviceBreakdown: { device: string; percentage: number }[];
  topPerformingWidgets: { name: string; interactions: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CampaignAnalytics: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignData, analyticsData] = await Promise.all([
          getCampaign(campaignId!),
          getCampaignAnalytics(campaignId!)
        ]);
        setCampaign(campaignData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  if (loading) return <Spin size="large" />;
  if (!campaign || !analytics) return <div>No data available</div>;

  const widgetInteractionsData = Object.entries(analytics.widgetInteractions).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{campaign.name} Analytics</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Interactions" 
              value={analytics.totalInteractions} 
              prefix={<InteractionOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Unique Users" 
              value={analytics.uniqueUsers} 
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Conversion Rate" 
              value={analytics.conversionRate} 
              suffix="%" 
              prefix={<BarChartOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Avg. Engagement Time" 
              value={analytics.averageEngagementTime} 
              suffix="sec" 
              prefix={<ClockCircleOutlined />}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card>
            <Title level={4}>Daily Interactions</Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyInteractions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="interactions" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <Title level={4}>Device Breakdown</Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Top Performing Widgets</Title>
            <Table
              dataSource={analytics.topPerformingWidgets}
              columns={[
                { title: 'Widget Name', dataIndex: 'name', key: 'name' },
                { title: 'Interactions', dataIndex: 'interactions', key: 'interactions' },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>Widget Interaction Distribution</Title>
            {widgetInteractionsData.map((widget, index) => (
              <div key={widget.name} style={{ marginBottom: '16px' }}>
                <Text>{widget.name}</Text>
                <Progress 
                  percent={(widget.value / analytics.totalInteractions) * 100} 
                  strokeColor={COLORS[index % COLORS.length]}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CampaignAnalytics;