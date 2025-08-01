"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import Pagination from "@/components/Pagination";
import PageHeader from "@/components/PageHeader";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import MainContainer from "@/components/MainContainer";
import AlertBox from "@/components/AlertBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JobsFilter from "./_components/JobsFilter";
import StatsBar from "./_components/StatsBar";
import FoldFilterContainer from "@/components/Filters/FoldFilterContainer";
import { useMemo } from "react";

// Utility function to get badge variant for job state
function getStateVariant(state) {
  switch (state) {
    case 'completed':
      return 'default'; // Green
    case 'active':
      return 'secondary'; // Blue
    case 'created':
      return 'outline'; // Gray
    case 'failed':
      return 'destructive'; // Red
    case 'retry':
      return 'warning'; // Yellow
    case 'cancelled':
      return 'outline'; // Gray
    default:
      return 'outline';
  }
}

// Format date/time for display
function formatDateTime(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Format duration between two dates
function formatDuration(startDate, endDate) {
  if (!startDate || !endDate) return '-';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  
  if (diffMs < 1000) return `${diffMs}ms`;
  if (diffMs < 60000) return `${(diffMs / 1000).toFixed(1)}s`;
  if (diffMs < 3600000) return `${(diffMs / 60000).toFixed(1)}m`;
  return `${(diffMs / 3600000).toFixed(1)}h`;
}

export default function ListJobs({
  jobs,
  searchParams,
  pageCount,
  stats,
}) {
  const isEmpty = !jobs || jobs.length === 0;
  
  const breadcrumbs = [
    {
      key: "staff",
      href: "/staff",
      text: "Staff",
    },
    {
      key: "queue",
      text: "Queue Management",
    },
  ];

  // Define DataTable columns
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Job ID',
      size: 200,
      cell: ({ getValue }) => (
        <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">
          {getValue().slice(0, 8)}...
        </code>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Job Type',
      size: 140,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: 'state',
      header: 'Status',
      size: 100,
      cell: ({ getValue }) => (
        <Badge variant={getStateVariant(getValue())}>
          {getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      size: 80,
      cell: ({ getValue }) => getValue() || 0,
      meta: {
        isNumeric: true,
        headerClassName: "text-right",
        cellClassName: "text-right tabular-nums",
      },
    },
    {
      accessorKey: 'retry_count',
      header: 'Retries',
      size: 80,
      cell: ({ row }) => {
        const current = row.original.retry_count || 0;
        const limit = row.original.retry_limit || 0;
        return (
          <span className={current > 0 ? "text-orange-600 font-medium" : ""}>
            {current}/{limit}
          </span>
        );
      },
      meta: {
        isNumeric: true,
        headerClassName: "text-right",
        cellClassName: "text-right tabular-nums",
      },
    },
    {
      accessorKey: 'created_on',
      header: 'Created',
      size: 140,
      cell: ({ getValue }) => (
        <span className="text-xs">
          {formatDateTime(getValue())}
        </span>
      ),
    },
    {
      accessorKey: 'started_on',
      header: 'Started',
      size: 140,
      cell: ({ getValue }) => (
        <span className="text-xs">
          {formatDateTime(getValue())}
        </span>
      ),
    },
    {
      accessorKey: 'completed_on',
      header: 'Completed',
      size: 140,
      cell: ({ getValue }) => (
        <span className="text-xs">
          {formatDateTime(getValue())}
        </span>
      ),
    },
    {
      id: 'duration',
      header: 'Duration',
      size: 80,
      cell: ({ row }) => {
        const duration = formatDuration(
          row.original.started_on,
          row.original.completed_on
        );
        return (
          <span className="text-xs tabular-nums">
            {duration}
          </span>
        );
      },
      meta: {
        headerClassName: "text-right",
        cellClassName: "text-right",
      },
    },
    {
      id: 'data_preview',
      header: 'Data',
      size: 200,
      cell: ({ row }) => {
        const data = row.original.data;
        if (!data) return '-';
        
        const preview = JSON.stringify(data).slice(0, 80);
        return (
          <code className="text-xs text-muted-foreground">
            {preview}{preview.length >= 80 ? '...' : ''}
          </code>
        );
      },
    },
  ], []);

  // Check if filters are applied
  const filter_fields = [
    "name",
    "state", 
    "priority_min",
    "priority_max",
    "created_from",
    "created_to",
    "completed_from", 
    "completed_to",
    "has_retries",
    "data_search",
    "output_search",
    "archive"
  ];
  
  const filter_applied = filter_fields.some(field => 
    searchParams[field] && searchParams[field] !== ''
  );

  let no_data_alert = {
    title: "No jobs found",
    message: "No jobs are currently in the queue",
  };
  
  if (filter_applied) {
    no_data_alert = {
      title: "No jobs match your filters",
      message: "Try adjusting your filter criteria to see more results",
    };
  }
  
  if (stats.error) {
    no_data_alert = {
      title: "Error loading jobs",
      message: `Database error: ${stats.error}`,
    };
  }

  const RightButtons = function () {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    );
  };

  return (
    <MainContainer>
      <AppBreadcrumbs breadcrumbs={breadcrumbs} />
      <PageHeader 
        title="Queue Management" 
        subtitle={`${stats.total} jobs total`}
        RightButtons={RightButtons}
      />
      
      <StatsBar stats={stats} />
      
      <div className="flex gap-6">
        <div className="w-80 flex-shrink-0">
          <FoldFilterContainer 
            filter_applied={filter_applied}
            searchParams={searchParams}
            filter_fields={filter_fields}
          >
            <JobsFilter searchParams={searchParams} />
          </FoldFilterContainer>
        </div>
        
        <div className="flex-1 min-w-0">
          {isEmpty ? (
            <AlertBox
              title={no_data_alert.title}
              message={no_data_alert.message}
              variant={stats.error ? "destructive" : "default"}
            />
          ) : (
            <>
              <div style={{ height: '600px', width: '100%' }}>
                <DataTable
                  columns={columns}
                  data={jobs}
                  enableSorting
                  enableColumnResizing
                  columnResizeMode="onChange"
                  className="h-full"
                  defaultColumn={{
                    minSize: 60,
                    maxSize: 400,
                  }}
                />
              </div>
              
              {pageCount > 1 && (
                <Pagination 
                  pageCount={pageCount} 
                  currentPage={stats.currentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </MainContainer>
  );
}