import OrgCard from './OrgCard';

export default {
  title: 'Pages/orgs/_components/OrgCard',
  component: OrgCard,
  parameters: {
    nextjs: { 
      appDirectory: true,
      navigation: {
        pathname: '/orgs',
        query: {},
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    name: { control: 'text' },
    org_id: { control: 'text' },
    createdAt: { control: 'date' },
  },
};

export const Default = {
  args: {
    name: 'Acme Corporation',
    org_id: 'org_123',
    createdAt: '2024-01-15T10:30:00Z',
  },
};
