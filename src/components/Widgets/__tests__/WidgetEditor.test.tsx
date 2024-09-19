import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import WidgetEditor from '../WidgetEditor';
import { getWidget, updateWidget } from '../../../api/widgets';
import { getWidgetTemplates } from '../../../api/widgetTemplates';
import { getCampaigns } from '../../../api/campaigns';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ widgetId: '1' }),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../../api/widgets');
jest.mock('../../../api/widgetTemplates');
jest.mock('../../../api/campaigns');

const mockGetWidget = getWidget as jest.MockedFunction<typeof getWidget>;
const mockUpdateWidget = updateWidget as jest.MockedFunction<typeof updateWidget>;
const mockGetWidgetTemplates = getWidgetTemplates as jest.MockedFunction<typeof getWidgetTemplates>;
const mockGetCampaigns = getCampaigns as jest.MockedFunction<typeof getCampaigns>;

describe('WidgetEditor', () => {
  beforeEach(() => {
    mockGetWidget.mockResolvedValue({
      id: '1',
      name: 'Test Widget',
      description: 'Test Description',
      widget_template_id: '1',
      campaign_id: '1',
      aggregator_config: {},
    });
    mockGetWidgetTemplates.mockResolvedValue([
      { id: '1', name: 'Template 1', type: 'banner' },
    ]);
    mockGetCampaigns.mockResolvedValue([
      { id: '1', name: 'Campaign 1', status: 'active' },
    ]);
  });

  it('renders the form with existing widget data', async () => {
    render(<Form><WidgetEditor /></Form>);

    await waitFor(() => {
      expect(screen.getByLabelText('Widget Name')).toHaveValue('Test Widget');
      expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
      expect(screen.getByLabelText('Campaign')).toHaveValue('1');
      expect(screen.getByLabelText('Widget Template')).toHaveValue('1');
      expect(screen.getByRole('button', { name: 'Update Widget' })).toBeInTheDocument();
    });
  });

  it('submits the form with updated data', async () => {
    mockUpdateWidget.mockResolvedValue({ id: '1', name: 'Updated Widget' });

    render(<Form><WidgetEditor /></Form>);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Widget Name'), { target: { value: 'Updated Widget' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description' } });
      fireEvent.change(screen.getByLabelText('Widget Configuration'), { target: { value: '{"key": "value"}' } });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Widget' }));

    await waitFor(() => {
      expect(mockUpdateWidget).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'Updated Widget',
        description: 'Updated Description',
        aggregator_config: { key: 'value' },
      }));
    });
  });
});