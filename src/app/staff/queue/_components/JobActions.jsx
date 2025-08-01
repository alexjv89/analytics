"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, RotateCcw, X } from "lucide-react";
import { useState } from "react";

export default function JobActions({ job }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const canRetry = job.state === 'failed' && job.retry_count < job.retry_limit;
  const canCancel = ['created', 'active', 'retry'].includes(job.state);
  
  const handleViewDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const handleRetry = () => {
    // TODO: Implement retry functionality
    console.log('Retry job:', job.id);
  };
  
  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log('Cancel job:', job.id);
  };
  
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleViewDetails}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          {canRetry && (
            <DropdownMenuItem onClick={handleRetry}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Job
            </DropdownMenuItem>
          )}
          
          {canCancel && (
            <DropdownMenuItem onClick={handleCancel} className="text-destructive">
              <X className="mr-2 h-4 w-4" />
              Cancel Job
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Job Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Job ID</label>
                  <code className="block text-xs bg-muted p-2 rounded mt-1">
                    {job.id}
                  </code>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge variant={
                      job.state === 'completed' ? 'default' :
                      job.state === 'failed' ? 'destructive' :
                      job.state === 'active' ? 'secondary' : 'outline'
                    }>
                      {job.state}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Job Data</label>
                <pre className="text-xs bg-muted p-3 rounded mt-1 overflow-auto">
                  {JSON.stringify(job.data, null, 2)}
                </pre>
              </div>
              
              {job.output && (
                <div>
                  <label className="text-sm font-medium">Job Output</label>
                  <pre className="text-xs bg-muted p-3 rounded mt-1 overflow-auto">
                    {JSON.stringify(job.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}