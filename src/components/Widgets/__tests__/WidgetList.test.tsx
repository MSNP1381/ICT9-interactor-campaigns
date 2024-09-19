import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WidgetList from '../WidgetList';
import { getWidgets } from '../../../api/widgets';

jest.mock('../../../api/widgets');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockGetWidgets = getWidgets as jest.MockedFunction<typeof getWidgets>;

describe('WidgetList', () => {
  beforeEach(() => {
    mockGetWidgets.mockResolvedValue([
      { id: '1', name: 'Widget 1', description: 'Description 1', campaign_id: '1', widget_template_id: '1' },
      { id: '2', name: 'Widget 2', description: 'Description 2', campaign_id: '2', widget_template_id: '2' },
    ]);
  });

  it('renders the widget list with correct columns', async () => {
    render(<WidgetList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Campaign')).toBeInTheDocument();
      expect(screen.getByText('Widget Template')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('displays widget data correctly', async () => {
    render(<WidgetList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('Widget 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Widget 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('shows embed code modal when clicking Embed button', async () => {
    render(<WidgetList refreshTrigger={0} />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Embed')[0]);
    });

    expect(screen.getByText('Widget Embed Code')).toBeInTheDocument();
  });
});