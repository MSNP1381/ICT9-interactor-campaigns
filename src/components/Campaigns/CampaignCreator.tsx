import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { createCampaign, CreateCampaignData } from "../../api/campaigns";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Option } = Select;

const CampaignCreator: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const campaignData: CreateCampaignData = {
        name: values.name,
        host_id: values.host_id,
        description: values.description,
        start_date: values.dateRange[0].format("YYYY-MM-DD"),
        end_date: values.dateRange[1].format("YYYY-MM-DD"),
        status: values.status,
        type: values.type,
        widget_id: values.widget_id, // Add this line
        script_tag: values.script_tag, // Add this line
      };

      await createCampaign(campaignData);
      message.success("Campaign created successfully");
      form.resetFields();
      navigate("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      message.error("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} name="campaign_creator" onFinish={onFinish} layout="vertical">
      <Form.Item
        name="name"
        label="Campaign Name"
        rules={[{ required: true, message: "Please enter a campaign name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="host_id"
        label="Host ID"
        rules={[{ required: true, message: "Please enter a host ID" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="dateRange"
        label="Campaign Duration"
        rules={[{ required: true, message: "Please select campaign duration" }]}
      >
        <RangePicker />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select a status" }]}
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
        rules={[{ required: true, message: "Please select a type" }]}
      >
        <Select>
          <Option value="email">Email</Option>
          <Option value="social_media">Social Media</Option>
          <Option value="display_ads">Display Ads</Option>
          <Option value="content_marketing">Content Marketing</Option>
          <Option value="event">Event</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="widget_id"
        label="Widget ID"
        rules={[{ required: true, message: "Please enter a widget ID" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="script_tag"
        label="Script Tag"
        rules={[{ required: true, message: "Please enter a script tag" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Campaign
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CampaignCreator;
