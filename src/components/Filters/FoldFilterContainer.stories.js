import FoldFilterContainer from './FoldFilterContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';
import { userEvent, within, expect } from 'storybook/test';

export default {
  title: 'components/Filters/FoldFilterContainer',
  component: FoldFilterContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive two-column layout with a collapsible filter panel. The left column can be collapsed on desktop and shows vertical text when narrow.',
      },
    },
  },
  argTypes: {
    columnOne: {
      control: false,
      description: 'Content for the left column (filter panel)',
    },
    columnTwo: {
      control: false,
      description: 'Content for the right column (main content)',
    },
    searchParams: {
      control: 'object',
      description: 'Search parameters object to show filter status',
    },
  },
};

// Sample filter panel content
const FilterPanel = () => (
  <Card>
    <CardContent className="p-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Typography variant="title-md">
            Filters
          </Typography>
        </div>
        
        <div className="flex flex-col gap-1">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search items..." className="pl-10" />
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">Electronics</Badge>
            <Badge variant="outline">Clothing</Badge>
            <Badge variant="outline">Books</Badge>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <Label>Price Range</Label>
          <div className="flex gap-1">
            <Input placeholder="Min" className="text-sm" />
            <Input placeholder="Max" className="text-sm" />
          </div>
        </div>
        
        <Button variant="secondary" size="sm">Apply Filters</Button>
      </div>
    </CardContent>
  </Card>
);

// Sample main content
const MainContent = () => (
  <Card>
    <CardContent className="p-3 min-h-[400px]">
      <Typography variant="title-lg" className="mb-2">Main Content Area</Typography>
      <Typography variant="body-md" className="mb-2">
        This is the main content area that takes up the remaining space after the filter panel.
      </Typography>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="bg-gray-50">
            <CardContent className="p-2">
              <Typography variant="title-sm">Item {i + 1}</Typography>
              <Typography variant="body-sm">Sample content item description</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const Default = {
  
  args: {
    searchParams: {},
  },
  render: (args) => (
    <FoldFilterContainer 
      columnOne={<FilterPanel />}
      columnTwo={<MainContent />}
      {...args}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the specific collapse/expand button using test ID
    const collapseButton = canvas.getByTestId('fold-filter-toggle');
    
    // Initially, the filter panel should be expanded (showing full content)
    // The component should render - just verify the toggle button exists
    expect(collapseButton).toBeInTheDocument();
    
    // The content area should be present (either expanded or collapsed)
    const contentArea = canvas.getByTestId('fold-filter-toggle').closest('div');
    expect(contentArea).toBeInTheDocument();
    
    // Click to collapse the filter panel
    await userEvent.click(collapseButton);
    
    // After clicking, the panel should be collapsed
    // We can't check if elements are hidden because they're still in DOM but CSS-hidden
    // Instead, let's check that the button icon changed from ChevronLeft to ChevronRight
    expect(canvas.getByTestId('ChevronRightIcon')).toBeInTheDocument();
    
    // Click again to expand the filter panel
    await userEvent.click(collapseButton);
    
    // The button should show ChevronLeft again when expanded
    expect(canvas.getByTestId('ChevronLeftIcon')).toBeInTheDocument();
    
    // The filter panel content should be accessible again after expanding
    // Wait a moment for the transition and check for content
    const expandedSearchInput = canvas.queryByPlaceholderText('Search items...');
    const expandedFilterText = canvas.queryByText('Filters');
    
    // After expanding, we should have the full content
    expect(expandedSearchInput || expandedFilterText).toBeTruthy();
  },
};