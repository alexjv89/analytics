"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsBar({ stats }) {
  const { total, byState, currentPage, pageSize, includeArchive } = stats;
  
  // Calculate percentages
  const getPercentage = (count) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };
  
  // Get state color variant
  const getStateVariant = (state) => {
    switch (state) {
      case 'completed':
        return 'default';
      case 'active':
        return 'secondary';
      case 'created':
        return 'outline';
      case 'failed':
        return 'destructive';
      case 'retry':
        return 'warning';
      case 'cancelled':
        return 'outline';
      default:
        return 'outline';
    }
  };
  
  const displayedStart = Math.min((currentPage - 1) * pageSize + 1, total);
  const displayedEnd = Math.min(currentPage * pageSize, total);
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="font-medium">{total.toLocaleString()}</span>
              <span className="text-muted-foreground ml-1">
                {includeArchive ? 'archived jobs' : 'jobs total'}
              </span>
            </div>
            
            {total > 0 && (
              <div className="text-sm text-muted-foreground">
                Showing {displayedStart.toLocaleString()}-{displayedEnd.toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {Object.entries(byState)
              .sort(([,a], [,b]) => b - a) // Sort by count descending
              .map(([state, count]) => (
                <div key={state} className="flex items-center space-x-1">
                  <Badge variant={getStateVariant(state)} className="text-xs">
                    {state}
                  </Badge>
                  <span className="text-sm font-medium">
                    {count.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({getPercentage(count)}%)
                  </span>
                </div>
              ))
            }
          </div>
        </div>
        
        {/* Progress bar visualization */}
        {total > 0 && (
          <div className="mt-3">
            <div className="flex h-2 rounded-full overflow-hidden bg-muted">
              {Object.entries(byState)
                .sort(([,a], [,b]) => b - a)
                .map(([state, count]) => {
                  const width = getPercentage(count);
                  if (width === 0) return null;
                  
                  let bgColor = 'bg-gray-400';
                  switch (state) {
                    case 'completed':
                      bgColor = 'bg-green-500';
                      break;
                    case 'active':
                      bgColor = 'bg-blue-500';
                      break;
                    case 'created':
                      bgColor = 'bg-gray-300';
                      break;
                    case 'failed':
                      bgColor = 'bg-red-500';
                      break;
                    case 'retry':
                      bgColor = 'bg-yellow-500';
                      break;
                    case 'cancelled':
                      bgColor = 'bg-gray-400';
                      break;
                  }
                  
                  return (
                    <div
                      key={state}
                      className={`${bgColor} transition-all duration-300`}
                      style={{ width: `${width}%` }}
                      title={`${state}: ${count} jobs (${width}%)`}
                    />
                  );
                })
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}