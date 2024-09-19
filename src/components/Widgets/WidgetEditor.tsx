import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getWidget, updateWidget, Widget, WidgetUpdate } from "../../api/widgets";
import { getWidgetTemplates, WidgetTemplate } from "../../api/widgetTemplates";
import { getCampaigns, Campaign } from "../../api/campaigns";

const { Option } = Select;

const WidgetEditor: React.FC = () => {
  const [form] = Form.useForm();
  const { widgetId } = useParams<{ widgetId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [widget, setWidget] = useState<Widget | null>(null);
  const [templates, setTemplates] = useState<WidgetTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetchWidget();
    fetchTemplates();
    fetchCampaigns();
  }, [widgetId]);

  const fetchWidget = async () => {
    if (!widgetId) return;
    try {
      const fetchedWidget = await getWidget(widgetId);
      setWidget(fetchedWidget);
      form.setFieldsValue({
        name: fetchedWidget.name,
        description: fetchedWidget.description,
        widget_template_id: fetchedWidget.widget_template_id,
        campaign_id: fetchedWidget.campaign_id,
        config: JSON.stringify(fetchedWidget.aggregator_config, null, 2),
      });
    } catch (error) {
      console.error("Error fetching widget:", error);
      message.error("Failed to fetch widget");
    }
  };

  const fetchTemplates = async () => {
    try {
      const fetchedTemplates = await getWidgetTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      message.error("Failed to fetch widget templates");
    }
  };

  const fetchCampaigns = async () => {
    try {
      const defaultHostId = localStorage.getItem("defaultHostId");
      const fetchedCampaigns = await getCampaigns(0, 100, defaultHostId ?? undefined);
      const activeCampaigns = fetchedCampaigns.filter(campaign => campaign.status === "active");
      setCampaigns(activeCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      message.error("Failed to fetch campaigns");
    }
  };

  const onFinish = async (values: any) => {
    if (!widgetId) return;
    setLoading(true);
    try {
      const widgetUpdateData: WidgetUpdate = {
        name: values.name,
        description: values.description,
        aggregator_config: JSON.parse(values.config),
      };
      await updateWidget(widgetId, widgetUpdateData);
      message.success("Widget updated successfully");
      navigate("/widgets");
    } catch (error) {
      console.error("Error updating widget:", error);
      message.error("Failed to update widget");
    } finally {
      setLoading(false);
    }
  };

  if (!widget) {
    return <Spin />;
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="name"
        label="Widget Name"
        rules={[{ required: true, message: "Please enter a widget name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="campaign_id"
        label="Campaign"
        rules={[{ required: true, message: "Please select a campaign" }]}
      >
        <Select>
          {campaigns.map((campaign) => (
            <Option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="widget_template_id"
        label="Widget Template"
        rules={[{ required: true, message: "Please select a widget template" }]}
      >
        <Select disabled>
          {templates.map((template) => (
            <Option key={template.id} value={template.id}>
              {template.name} ({template.type})
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="config"
        label="Widget Configuration"
        rules={[
          { required: true, message: "Please enter widget configuration" },
          {
            validator: (_, value) => {
              try {
                JSON.parse(value);
                return Promise.resolve();
              } catch (error) {
                return Promise.reject("Invalid JSON configuration");
              }
            },
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Widget
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WidgetEditor;