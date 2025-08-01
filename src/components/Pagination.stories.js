// 1. Component import (always first)
import Pagination from './Pagination';

export default {
  title: 'components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pagination component for navigating through paginated data. Integrates with Next.js navigation and URL search parameters to maintain page state. Provides Previous/Next navigation with current page indicator.',
      },
    },
  },
  argTypes: {
    pageCount: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Total number of pages available for navigation',
    },
    currentPage: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Current page number (overrides URL-based page detection)',
    },
  },
};

export const Default = {
  args: {
    pageCount: 10,
    currentPage: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default pagination showing page 3 of 10 with both Previous and Next buttons enabled.',
      },
    },
  },
};

export const FirstPage = {
  args: {
    pageCount: 10,
    currentPage: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination on first page - Previous button is disabled.',
      },
    },
  },
};

export const LastPage = {
  args: {
    pageCount: 10,
    currentPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination on last page - Next button is disabled.',
      },
    },
  },
};