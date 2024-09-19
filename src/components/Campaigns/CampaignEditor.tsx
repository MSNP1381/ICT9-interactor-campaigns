import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampaign, updateCampaign, CampaignUpdate } from '../../api/campaigns';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const CampaignEditor: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    } else {
      message.error('Campaign ID is undefined');
      navigate('/campaigns');
    }
  }, [campaignId, navigate]);

  const fetchCampaign = async () => {
    try {
      const campaign = await getCampaign(campaignId!);
      form.setFieldsValue({
        ...campaign,
        dateRange: [moment(campaign.start_date), moment(campaign.end_date)],
      });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      message.error('Failed to fetch campaign');
    }
  };

  const onFinish = async (values: any) => {
    if (!campaignId) {
      message.error('Cannot update campaign: Invalid ID');
      return;
    }

    setLoading(true);
    try {
      const campaignData: CampaignUpdate = {
        name: values.name,
        host_id: values.host_id,
        description: values.description,
        start_date: values.dateRange[0].format('YYYY-MM-DD'),
        end_date: values.dateRange[1].format('YYYY-MM-DD'),
        status: values.status,
        type: values.type,
      };

      await updateCampaign(campaignId, campaignData);
      message.success('Campaign updated successfully');
      navigate('/campaigns');
    } catch (error) {
      console.error('Error updating campaign:', error);
      message.error('Failed to update campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} name="campaign_editor" onFinish={onFinish} layout="vertical">
      <Form.Item
        name="name"
        label="Campaign Name"
        rules={[{ required: true, message: 'Please enter a campaign name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="host_id"
        label="Host ID"
        rules={[{ required: true, message: 'Please enter a host ID' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="dateRange"
        label="Campaign Duration"
        rules={[{ required: true, message: 'Please select campaign duration' }]}
      >
        <RangePicker />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <Select>
          <Option value="draft">Draft</Option>
          <Option value="active">Active</Option>
          <Option value="expired">Expired</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: 'Please select a type' }]}
      >
        <Select>
          <Option value="email">Email</Option>
          <Option value="social_media">Social Media</Option>
          <Option value="display_ads">Display Ads</Option>
          <Option value="content_marketing">Content Marketing</Option>
          <Option value="event">Event</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Campaign
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CampaignEditor;