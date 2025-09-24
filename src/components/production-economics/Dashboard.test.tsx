import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from './Dashboard';

// Mock the fetch function
global.fetch = vi.fn();

const createFetchResponse = (data: any) => {
  return { json: () => new Promise((resolve) => resolve(data)), ok: true };
};

describe('Dashboard', () => {
  it('renders KPI cards with fetched data', async () => {
    const mockKpiData = {
      totalRevenue: 10000,
      totalExpense: 4500,
      grossMargin: 5500,
      totalAnimals: 50,
      adg: 0.15,
      mortality: 5,
      avgLitterSize: 8.5,
      totalEggs: 1200,
      totalMilk: 350,
    };
    const mockTimeSeriesData = [{ name: '2023-10', revenue: 10000, expense: 4500 }];

    (fetch as any)
      .mockResolvedValueOnce(createFetchResponse([])) // species
      .mockResolvedValueOnce(createFetchResponse([])) // groups
      .mockResolvedValueOnce(createFetchResponse(mockKpiData)) // kpis
      .mockResolvedValueOnce(createFetchResponse(mockTimeSeriesData)); // time-series

    render(<Dashboard />);

    // Wait for the data to be loaded and displayed
    await waitFor(() => {
      // Check for a few key KPIs
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$10,000.00')).toBeInTheDocument();

      expect(screen.getByText('Active Animals')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();

      expect(screen.getByText('Avg. Daily Gain')).toBeInTheDocument();
      expect(screen.getByText('0.150 kg/day')).toBeInTheDocument();
    });
  });
});
