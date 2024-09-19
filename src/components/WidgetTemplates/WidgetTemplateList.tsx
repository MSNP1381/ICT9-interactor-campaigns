import React, { useEffect, useState } from "react";
import { Row, Col, message } from "antd";
import WidgetTemplate from "./WidgetTemplate";
import {
  getWidgetTemplates,
  WidgetTemplate as WidgetTemplateType,
} from "../../api/widgetTemplates";

interface WidgetTemplateListProps {
  onSelectTemplate: (template: WidgetTemplateType) => void;
}

const WidgetTemplateList: React.FC<WidgetTemplateListProps> = ({
  onSelectTemplate,
}) => {
  const [templates, setTemplates] = useState<WidgetTemplateType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWidgetTemplates();
  }, []);

  const fetchWidgetTemplates = async () => {
    setLoading(true);
    try {
      const fetchedTemplates = await getWidgetTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error("Error fetching widget templates:", error);
      message.error("Failed to fetch widget templates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {templates.map((template) => (
        <Col key={template.id} xs={24} sm={12} md={8} lg={6}>
          <WidgetTemplate
            name={template.name}
            type={template.type}
            description={template.description || ""}
            template={template.template}
            onSelect={() => onSelectTemplate(template)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default WidgetTemplateList;
