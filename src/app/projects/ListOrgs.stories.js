import ListProjects from './ListProjects';

export default {
  title: 'Pages/orgs/ListProjects',
  component: ListProjects,
  parameters: {
    nextjs: { 
      appDirectory: true,
      navigation: {
        pathname: '/orgs',
        query: {},
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    orgs: { control: 'object' },
  },
};

const mockOrgs = [
  {
    id: 'org_001',
    name: 'Acme Corporation',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'org_002', 
    name: 'Tech Solutions Inc.',
    created_at: '2024-02-20T14:15:00Z',
  },
  {
    id: 'org_003',
    name: 'Marketing Agency',
    created_at: '2023-11-10T09:45:00Z',
  },
  {
    id: 'org_004',
    name: 'Consulting Group',
    created_at: '2024-03-05T16:20:00Z',
  },
];

export const Default = {
  args: {
    orgs: mockOrgs,
  },
};

export const EmptyState = {
  args: {
    orgs: [],
  },
};

export const SingleOrg = {
  args: {
    orgs: [mockOrgs[0]],
  },
};