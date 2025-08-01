import { Typography } from './typography'
import { User, Database, CheckCircle } from 'lucide-react'

const meta = {
  title: 'Components/ui/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1', 'h2', 'h3', 'h4',
        'title-lg', 'title-md', 'title-sm',
        'body-lg', 'body-md', 'body-sm', 'body-xs',
        'lead', 'large', 'small', 'muted'
      ],
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'success', 'warning', 'danger', 'primary', 'neutral'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    level: {
      control: 'select',
      options: [
        'h1', 'h2', 'h3', 'h4',
        'title-lg', 'title-md', 'title-sm',
        'body-lg', 'body-md', 'body-sm', 'body-xs'
      ],
    },
    as: {
      control: 'select',
      options: ['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    noWrap: {
      control: 'boolean',
    },
  },
}

export default meta

export const Default = {
  args: {
    children: 'This is the default typography component',
  },
}

export const Headings = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
    </div>
  ),
}

export const TitleVariants = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="title-lg">Title Large</Typography>
      <Typography variant="title-md">Title Medium</Typography>
      <Typography variant="title-sm">Title Small</Typography>
    </div>
  ),
}

export const BodyVariants = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="body-lg">Body Large - This is larger body text for emphasis</Typography>
      <Typography variant="body-md">Body Medium - This is the default body text size</Typography>
      <Typography variant="body-sm">Body Small - This is smaller body text for secondary information</Typography>
      <Typography variant="body-xs">Body Extra Small - This is very small text for fine print</Typography>
    </div>
  ),
}

export const ColorVariants = {
  render: () => (
    <div className="space-y-4">
      <Typography color="default">Default Color</Typography>
      <Typography color="muted">Muted Color</Typography>
      <Typography color="success">Success Color</Typography>
      <Typography color="warning">Warning Color</Typography>
      <Typography color="danger">Danger Color</Typography>
      <Typography color="primary">Primary Color</Typography>
      <Typography color="neutral">Neutral Color</Typography>
    </div>
  ),
}

export const WeightVariants = {
  render: () => (
    <div className="space-y-4">
      <Typography weight="normal">Normal Weight</Typography>
      <Typography weight="medium">Medium Weight</Typography>
      <Typography weight="semibold">Semibold Weight</Typography>
      <Typography weight="bold">Bold Weight</Typography>
      <Typography weight="extrabold">Extrabold Weight</Typography>
    </div>
  ),
}

export const WithStartDecorator = {
  render: () => (
    <div className="space-y-4">
      <Typography 
        variant="title-md" 
        startDecorator={<User className="w-4 h-4" />}
      >
        User Profile
      </Typography>
      <Typography 
        variant="body-sm" 
        startDecorator={<Database className="w-4 h-4" />}
        color="muted"
      >
        Master Data Configuration
      </Typography>
      <Typography 
        variant="body-md" 
        startDecorator={<CheckCircle className="w-4 h-4" />}
        color="success"
      >
        Process Completed Successfully
      </Typography>
    </div>
  ),
}

export const WithEndDecorator = {
  render: () => (
    <div className="space-y-4">
      <Typography 
        variant="title-sm" 
        endDecorator={<User className="w-4 h-4" />}
      >
        Current User
      </Typography>
      <Typography 
        variant="body-sm" 
        endDecorator={<Database className="w-4 h-4" />}
        color="muted"
      >
        View Details
      </Typography>
    </div>
  ),
}

export const WithBothDecorators = {
  render: () => (
    <div className="space-y-4">
      <Typography 
        variant="title-sm" 
        startDecorator={<User className="w-4 h-4" />}
        endDecorator={<CheckCircle className="w-4 h-4" />}
      >
        User Verified
      </Typography>
    </div>
  ),
}

export const NoWrapTruncation = {
  render: () => (
    <div className="w-64 space-y-4">
      <Typography variant="body-md" noWrap title="This is a very long text that should be truncated">
        This is a very long text that should be truncated when it exceeds the container width
      </Typography>
      <Typography 
        variant="title-sm" 
        startDecorator={<User className="w-4 h-4" />}
        noWrap 
        title="Very Long User Name That Should Be Truncated"
      >
        Very Long User Name That Should Be Truncated
      </Typography>
    </div>
  ),
}

export const LegacyMUIJoyProps = {
  render: () => (
    <div className="space-y-4">
      <Typography level="title-lg">Using Legacy Level Prop</Typography>
      <Typography fontSize="lg" fontWeight="lg">Using Legacy fontSize + fontWeight</Typography>
      <Typography component="div" level="body-sm">Using Legacy Component Prop</Typography>
    </div>
  ),
}

export const FinancialUseCase = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="border rounded-lg p-4 space-y-3">
        <Typography variant="title-md" color="primary">
          Account: Checking - Main
        </Typography>
        <Typography 
          variant="body-sm" 
          startDecorator={<User className="w-4 h-4" />}
          color="muted"
        >
          Created by John Doe
        </Typography>
        <Typography 
          variant="body-sm" 
          startDecorator={<Database className="w-4 h-4" />}
          color="muted"
        >
          Last Statement: Jan 2024
        </Typography>
        <Typography variant="body-lg" color="success" weight="semibold">
          $12,345.67 Balance
        </Typography>
        <Typography variant="body-xs" color="muted">
          Last updated: 2024-01-15 10:30 AM
        </Typography>
      </div>
    </div>
  ),
}

export const ResponsiveTypography = {
  render: () => (
    <div className="space-y-4">
      <Typography 
        variant="h1" 
        className="text-2xl md:text-4xl lg:text-5xl"
      >
        Responsive Heading
      </Typography>
      <Typography 
        variant="body-md" 
        className="text-sm md:text-base lg:text-lg"
      >
        This text adapts to different screen sizes
      </Typography>
    </div>
  ),
}

export const SemanticElements = {
  render: () => (
    <div className="space-y-4">
      <Typography as="h1" variant="h1">H1 Element</Typography>
      <Typography as="h2" variant="h2">H2 Element</Typography>
      <Typography as="p" variant="body-md">Paragraph Element</Typography>
      <Typography as="span" variant="body-sm">Span Element</Typography>
      <Typography as="div" variant="title-md">Div Element</Typography>
    </div>
  ),
}