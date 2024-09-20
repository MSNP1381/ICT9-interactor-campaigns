import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Modal, Input, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import { getWidgets, Widget, deleteWidget } from "../../api/widgets";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

interface WidgetListProps {
  refreshTrigger: number;
}

const WidgetList: React.FC<WidgetListProps> = ({ refreshTrigger }) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(false);
  const [embedModalVisible, setEmbedModalVisible] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWidgets();
  }, [refreshTrigger]);

  const fetchWidgets = async () => {
    setLoading(true);
    try {
      const data = await getWidgets();
      setWidgets(data);
    } catch (error) {
      console.error("Error fetching widgets:", error);
      message.error("Failed to fetch widgets");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWidget = async (widgetId:string) => {
    try {
      await deleteWidget(widgetId);
      message.success("Widget deleted successfully");
      fetchWidgets();
    } catch (error) {
      console.error("Error deleting widget:", error);
      message.error("Failed to delete widget");
    }
  };

  const showEmbedCode = (widget: Widget) => {
    const trackerScript = `<script src="${import.meta.env.VITE_TRACKER_URL}" data-campaign-id="${widget.campaign_id}" data-widget-id="${widget.id}" data-display-mode="modal" client-reference-id="1234567890"></script>`;
    setEmbedCode(trackerScript);
    setEmbedModalVisible(true);
  };

  const columns: ColumnsType<Widget> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Campaign",
      dataIndex: "campaign_id",
      key: "campaign_id",
    },
    {
      title: "Widget Template",
      dataIndex: "widget_template_id",
      key: "widget_template_id",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/widgets/edit/${record.id}`)}>Edit</Button>
          <Button onClick={() => showEmbedCode(record)}>Embed</Button>
          <Popconfirm
            title="Are you sure you want to delete this widget?"
            onConfirm={() => handleDeleteWidget(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => message.success("Embed code copied to clipboard"))
        .catch(() => fallbackCopyToClipboard(text));
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      message.success("Embed code copied to clipboard");
    } catch (err) {
      message.error("Failed to copy embed code");
    }
    document.body.removeChild(textArea);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={widgets}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title="Widget Embed Code"
        visible={embedModalVisible}
        onCancel={() => setEmbedModalVisible(false)}
        footer={null}
      >
        <TextArea
          value={embedCode}
          rows={4}
          readOnly
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
        <Button
          style={{ marginTop: 16 }}
          onClick={() => copyToClipboard(embedCode)}
        >
          Copy to Clipboard
        </Button>
      </Modal>
    </>
  );
};

export default WidgetList;
