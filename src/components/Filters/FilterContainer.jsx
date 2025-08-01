import { Filter } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

// Reusable FilterContainer component
export const FilterContainer = ({ 
  children, 
  onSubmit, 
  onReset, 
  title = "Filter", 
  defaultExpanded,
  submitButtonText = "Apply filter",
  resetButtonText = "Reset",
  loading = { apply: false, reset: false }
}) => {
  // Default to expanded on desktop, collapsed on mobile
  const getDefaultValue = () => {
    if (defaultExpanded !== undefined) {
      return defaultExpanded ? "filter" : undefined;
    }
    // Default behavior: expanded on desktop (md+), collapsed on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? "filter" : undefined;
    }
    return undefined; // Default to collapsed for SSR
  };

  return (
    <Accordion 
      type="single" 
      collapsible
      defaultValue={getDefaultValue()}
      className="border border-border rounded-sm"
    >
      <AccordionItem value="filter">
        <AccordionTrigger className="px-3 py-2 hover:no-underline">
          <span className="text-base font-bold">{title}</span>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <form onSubmit={onSubmit}>
            <div className="flex flex-wrap gap-x-4 gap-y-2.5">
              {children}
              
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button 
                  type="button"
                  className="flex-1" 
                  variant="outline" 
                  onClick={onReset}
                  disabled={loading.apply}
                  loading={loading.reset}
                >
                  {resetButtonText}
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 gap-2" 
                  variant="default"
                  disabled={loading.reset}
                  loading={loading.apply}
                >
                  {!loading.apply && <Filter className="h-4 w-4" />}
                  {submitButtonText}
                </Button>
              </div>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};