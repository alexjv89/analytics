import Table from './Table';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Custom scrollable table component built on shadcn/ui. Supports different header types and styling options.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['topHeader', 'sideHeader'],
      description: 'Type of table header layout',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the table',
    },
    variant: {
      control: 'select',
      options: ['soft', 'outlined', 'plain'],
      description: 'Visual variant of the table',
    },
    hoverRow: {
      control: 'boolean',
      description: 'Enable hover effects on table rows',
    },
  },
};

export default meta;

const SampleTableContent = () => (
  <>
    <TableHeader>
      <TableRow>
        <TableHead>Transaction</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Amazon Purchase</TableCell>
        <TableCell>2024-01-15</TableCell>
        <TableCell>Shopping</TableCell>
        <TableCell>$125.99</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Salary Deposit</TableCell>
        <TableCell>2024-01-01</TableCell>
        <TableCell>Income</TableCell>
        <TableCell>$5,000.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Grocery Store</TableCell>
        <TableCell>2024-01-10</TableCell>
        <TableCell>Food</TableCell>
        <TableCell>$89.45</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Electric Bill</TableCell>
        <TableCell>2024-01-05</TableCell>
        <TableCell>Utilities</TableCell>
        <TableCell>$156.78</TableCell>
      </TableRow>
    </TableBody>
  </>
);

export const Default = {
  args: {
    type: 'topHeader',
    size: 'sm',
    variant: 'soft',
  },
  render: (args) => (
    <Table {...args}>
      <SampleTableContent />
    </Table>
  ),
};

export const SideHeader = {
  args: {
    type: 'sideHeader',
    size: 'sm',
    variant: 'soft',
  },
  render: (args) => (
    <Table {...args}>
      <TableBody>
        <TableRow>
          <TableCell>Account Type</TableCell>
          <TableCell>Checking</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bank</TableCell>
          <TableCell>Chase Bank</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Balance</TableCell>
          <TableCell>$2,450.75</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Last Transaction</TableCell>
          <TableCell>2024-01-15</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Table with side headers where the first column acts as row labels with different styling.',
      },
    },
  },
};

export const WithHover = {
  args: {
    type: 'topHeader',
    size: 'sm',
    variant: 'soft',
    hoverRow: true,
  },
  render: (args) => (
    <Table {...args}>
      <SampleTableContent />
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Table with hover effects enabled. Rows highlight when you hover over them.',
      },
    },
  },
};