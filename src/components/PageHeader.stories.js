import PageHeader from './PageHeader';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Basic = {
  args: {
    header: 'Basic Page Header',
  },
};


export const WithButtons = {
  args: {
    header: 'User Settings',
    RightButtons: () => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button variant="default" size="sm">Save Changes</Button>
      </div>
    ),
  },
};

export const MultiPartHeader = {
  args: {
    header: {
      main: 'Part ABC-123',
      secondary: 'Manufacturing Component',
    },
  },
};

export const AllFeatures = {
  args: {
    header: {
      primary: 'Transaction TXN-2024-001',
      detail: 'Revision 3 - Draft',
    },
    RightButtons: () => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Export CSV</Button>
        <Button variant="secondary" size="sm">Duplicate</Button>
        <Button variant="default" size="sm">Submit Transaction</Button>
      </div>
    ),
  },
};

export const DifferentLevels = {
  render: () => (
    <div className="flex flex-col gap-6">
      <PageHeader 
        header="H1 Level Header" 
        level="h1"
        RightButtons={() => <Button size="lg">Large Action</Button>}
      />
      <PageHeader 
        header="H2 Level Header" 
        level="h2"
        RightButtons={() => <Button size="default">Medium Action</Button>}
      />
      <PageHeader 
        header="H3 Level Header" 
        level="h3"
        RightButtons={() => <Button size="sm">Small Action</Button>}
      />
      <PageHeader 
        header="H4 Level Header" 
        level="h4"
        RightButtons={() => (
          <div className="flex gap-1">
            <Button size="sm" variant="outline">Edit</Button>
            <Button size="sm" variant="default">Save</Button>
          </div>
        )}
      />
    </div>
  ),
};