import AppBreadcrumbs from './AppBreadcrumbs';
import { SidebarProvider } from '@/components/ui/sidebar';

const meta = {
  title: 'Components/AppBreadcrumbs',
  component: AppBreadcrumbs,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
};

export default meta;

export const Default = {
  args: {
    breadcrumbs: [
      { text: 'Home', href: '/' },
      { text: 'Project', href: '/orgs/1' },
      { text: 'Transactions', href: '/orgs/1/transactions' },
      { text: 'Current Transaction' }
    ]
  }
};

export const Empty = {
  args: {
    breadcrumbs: []
  }
};