import React from 'react';
import { render, screen } from '@testing-library/react';
import DiscountList from '../DiscountList';

describe('DiscountList', () => {
  it('renders the table with correct columns', () => {
    render(<DiscountList />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  // Add more tests as needed, e.g., for data fetching and rendering
});