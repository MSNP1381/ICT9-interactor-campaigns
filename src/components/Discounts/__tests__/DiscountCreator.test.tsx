import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import DiscountCreator from '../DiscountCreator';
import { createBulkDiscounts } from '../../../api/discounts';
import { getCampaigns } from '../../../api/campaigns';

jest.mock('../../../api/discounts');
jest.mock('../../../api/campaigns');

const mockCreateBulkDiscounts = createBulkDiscounts as jest.MockedFunction<typeof createBulkDiscounts>;
const mockGetCampaigns = getCampaigns as jest.MockedFunction<typeof getCampaigns>;

describe('DiscountCreator', () => {
  beforeEach(() => {
    mockGetCampaigns.mockResolvedValue([
      { id: '1', name: 'Campaign 1' },
      { id: '2', name: 'Campaign 2' },
    ]);
  });

  it('renders the form correctly', async () => {
    render(<Form><DiscountCreator /></Form>);

    await waitFor(() => {
      expect(screen.getByLabelText('Base Discount Code')).toBeInTheDocument();
      expect(screen.getByLabelText('Discount Value')).toBeInTheDocument();
      expect(screen.getByLabelText('Discount Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Maximum Uses')).toBeInTheDocument();
      expect(screen.getByLabelText('Expiration Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Campaign')).toBeInTheDocument();
      expect(screen.getByLabelText('Number of Discounts to Generate')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Generate Bulk Discounts' })).toBeInTheDocument();
    });
  });

  it('submits the form with correct data', async () => {
    mockCreateBulkDiscounts.mockResolvedValue(undefined);

    render(<Form><DiscountCreator /></Form>);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Base Discount Code'), { target: { value: 'TEST' } });
      fireEvent.change(screen.getByLabelText('Discount Value'), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText('Discount Type'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByLabelText('Maximum Uses'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Campaign'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Number of Discounts to Generate'), { target: { value: '5' } });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Generate Bulk Discounts' }));

    await waitFor(() => {
      expect(mockCreateBulkDiscounts).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          code: 'TEST-0001',
          discount_value: 10,
          discount_type: 'percentage',
          max_uses: 100,
          campaign_id: '1',
        }),
      ]));
    });
  });
});