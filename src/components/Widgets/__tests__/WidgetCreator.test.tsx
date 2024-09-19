import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import WidgetCreator from '../WidgetCreator';
import { createWidget } from '../../../api/widgets';
import { getWidgetTemplates } from '../../../api/widgetTemplates';
import { getCampaigns } from '../../../api/campaigns';

jest.mock('../../../api/widgets');
jest.mock('../../../api/widgetTemplates');
jest.mock('../../../api/campaigns');

const mockCreateWidget = createWidget as jest.MockedFunction<typeof createWidget>;
const mockGetWidgetTemplates = getWidgetTemplates as jest.MockedFunction<typeof getWidgetTemplates>;
const mockGetCampaigns = getCampaigns as jest.MockedFunction<typeof getCampaigns>;

describe('WidgetCreator', () => {
  beforeEach(() => {
    mockGetWidgetTemplates.mockResolvedValue([
      { id: '1', name: 'Template 1', type: 'banner' },
      { id: '2', name: 'Template 2', type: 'popup' },
    ]);
    mockGetCampaigns.mockResolvedValue([
      { id: '1', name: 'Campaign 1', status: 'active' },
      { id: '2', name: 'Campaign 2', status: 'active' },
    ]);
  });

  it('renders the form correctly', async () => {
    render(<Form><WidgetCreator onWidgetCreated={() => {}} /></Form>);

    await waitFor(() => {
      expect(screen.getByLabelText('Widget Name')).toBeInTheDocument();
      expect(screen.getByLabelText('User Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Campaign')).toBeInTheDocument();
      expect(screen.getByLabelText('Widget Template')).toBeInTheDocument();
      expect(screen.getByLabelText('Widget Configuration')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Widget' })).toBeInTheDocument();
    });
  });

  it('submits the form with correct data', async () => {
    mockCreateWidget.mockResolvedValue({ id: '1', name: 'Test Widget' });

    render(<Form><WidgetCreator onWidgetCreated={() => {}} /></Form>);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Widget Name'), { target: { value: 'Test Widget' } });
      fireEvent.change(screen.getByLabelText('User Description'), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByLabelText('Campaign'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Widget Template'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Widget Configuration'), { target: { value: '{}' } });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Widget' }));

    await waitFor(() => {
      expect(mockCreateWidget).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Widget',
        description: 'Test Description',
        campaign_id: '1',
        widget_template_id: '1',
        config: {},
      }));
    });
  });
});