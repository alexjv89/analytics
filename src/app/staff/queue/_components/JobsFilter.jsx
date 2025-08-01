"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const JOB_TYPES = ["detectParser", "parse_file", "test-queue", "__pgboss__send-it"];

const JOB_STATES = [
  { value: "created", label: "Created", color: "outline" },
  { value: "active", label: "Active", color: "secondary" },
  { value: "completed", label: "Completed", color: "default" },
  { value: "failed", label: "Failed", color: "destructive" },
  { value: "retry", label: "Retry", color: "warning" },
  { value: "cancelled", label: "Cancelled", color: "outline" },
];

export default function JobsFilter({ searchParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  const updateURL = (key, value) => {
    const params = new URLSearchParams(currentSearchParams);

    if (value === "" || value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const toggleJobType = (jobType) => {
    const currentNames = searchParams.name ? searchParams.name.split(",") : [];
    const isSelected = currentNames.includes(jobType);

    let newNames;
    if (isSelected) {
      newNames = currentNames.filter((name) => name !== jobType);
    } else {
      newNames = [...currentNames, jobType];
    }

    updateURL("name", newNames.join(","));
  };

  const toggleJobState = (state) => {
    const currentStates = searchParams.state ? searchParams.state.split(",") : [];
    const isSelected = currentStates.includes(state);

    let newStates;
    if (isSelected) {
      newStates = currentStates.filter((s) => s !== state);
    } else {
      newStates = [...currentStates, state];
    }

    updateURL("state", newStates.join(","));
  };

  const selectedJobTypes = searchParams.name ? searchParams.name.split(",") : [];
  const selectedStates = searchParams.state ? searchParams.state.split(",") : [];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Job Types</Label>
        <div className="space-y-2">
          {JOB_TYPES.map((jobType) => (
            <div key={jobType} className="flex items-center space-x-2">
              <Checkbox
                id={`job-${jobType}`}
                checked={selectedJobTypes.includes(jobType)}
                onCheckedChange={() => toggleJobType(jobType)}
              />
              <Label htmlFor={`job-${jobType}`} className="text-sm font-mono cursor-pointer">
                {jobType}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Job States</Label>
        <div className="space-y-2">
          {JOB_STATES.map((state) => (
            <div key={state.value} className="flex items-center space-x-2">
              <Checkbox
                id={`state-${state.value}`}
                checked={selectedStates.includes(state.value)}
                onCheckedChange={() => toggleJobState(state.value)}
              />
              <Label
                htmlFor={`state-${state.value}`}
                className="text-sm cursor-pointer flex items-center space-x-2"
              >
                <Badge variant={state.color} className="text-xs">
                  {state.label}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Priority Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="priority-min" className="text-xs text-muted-foreground">
              Min
            </Label>
            <Input
              id="priority-min"
              type="number"
              placeholder="0"
              value={searchParams.priority_min || ""}
              onChange={(e) => updateURL("priority_min", e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="priority-max" className="text-xs text-muted-foreground">
              Max
            </Label>
            <Input
              id="priority-max"
              type="number"
              placeholder="100"
              value={searchParams.priority_max || ""}
              onChange={(e) => updateURL("priority_max", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Created Date</Label>
        <div className="space-y-2">
          <div>
            <Label htmlFor="created-from" className="text-xs text-muted-foreground">
              From
            </Label>
            <Input
              id="created-from"
              type="date"
              value={searchParams.created_from || ""}
              onChange={(e) => updateURL("created_from", e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="created-to" className="text-xs text-muted-foreground">
              To
            </Label>
            <Input
              id="created-to"
              type="date"
              value={searchParams.created_to || ""}
              onChange={(e) => updateURL("created_to", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Completed Date</Label>
        <div className="space-y-2">
          <div>
            <Label htmlFor="completed-from" className="text-xs text-muted-foreground">
              From
            </Label>
            <Input
              id="completed-from"
              type="date"
              value={searchParams.completed_from || ""}
              onChange={(e) => updateURL("completed_from", e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="completed-to" className="text-xs text-muted-foreground">
              To
            </Label>
            <Input
              id="completed-to"
              type="date"
              value={searchParams.completed_to || ""}
              onChange={(e) => updateURL("completed_to", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Search</Label>
        <div className="space-y-2">
          <div>
            <Label htmlFor="data-search" className="text-xs text-muted-foreground">
              Job Data
            </Label>
            <Input
              id="data-search"
              placeholder="Search in job data..."
              value={searchParams.data_search || ""}
              onChange={(e) => updateURL("data_search", e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="output-search" className="text-xs text-muted-foreground">
              Job Output
            </Label>
            <Input
              id="output-search"
              placeholder="Search in job output..."
              value={searchParams.output_search || ""}
              onChange={(e) => updateURL("output_search", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has-retries"
            checked={searchParams.has_retries === "true"}
            onCheckedChange={(checked) => updateURL("has_retries", checked ? "true" : "")}
          />
          <Label htmlFor="has-retries" className="text-sm cursor-pointer">
            Jobs with retries only
          </Label>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="archive"
            checked={searchParams.archive === "true"}
            onCheckedChange={(checked) => updateURL("archive", checked ? "true" : "")}
          />
          <Label htmlFor="archive" className="text-sm cursor-pointer">
            Include archived jobs
          </Label>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
