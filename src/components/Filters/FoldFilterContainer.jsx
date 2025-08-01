"use client";
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { ChevronRight, ChevronLeft } from 'lucide-react';


const useElementWidth = (targetRef) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set initial width
    if (targetRef.current) {
      setWidth(targetRef.current.getBoundingClientRect().width);
    }

    // Setup resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width } = entries[0].contentRect;
      setWidth(width);
    });

    if (targetRef.current) {
      resizeObserver.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        resizeObserver.unobserve(targetRef.current);
      }
    };
  }, [targetRef]);

  return width;
};



export default function FoldFilterContainer({ columnOne,columnTwo,searchParams }) {
  const getInitialFoldState = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fold_filter');
      console.log('FoldFilterContainer - localStorage value:', saved);
      console.log('FoldFilterContainer - returning:', saved === 'true');
      return saved === 'true'; // Convert string to boolean
    }
    console.log('FoldFilterContainer - window undefined, returning false');
    return false;
  };

  const [isCollapsed, setIsCollapsed] = useState(getInitialFoldState);
  const targetRef = useRef(null);
  
  console.log('FoldFilterContainer - isCollapsed state:', isCollapsed);
  
  const width = useElementWidth(targetRef);
  console.log('FoldFilterContainer - width:', width);
  console.log('FoldFilterContainer - width <= 150:', width <= 150);
  // const isCollapsed = width <= 50;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 pt-2 w-full overflow-hidden">
        <div 
          ref={targetRef}
          className={`
            w-full md:flex-shrink-0 transition-all duration-300 ease-in-out
            ${isCollapsed 
              ? 'md:w-9 md:min-w-[36px] md:max-w-[36px]' 
              : 'md:w-[333px] md:min-w-[333px] md:max-w-[333px]'
            }
          `}
          suppressHydrationWarning={true}
        >
          {width <= 150 ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="writing-mode-vertical-rl rotate-270 w-full text-center uppercase font-bold tracking-wide whitespace-nowrap">
                Filter {Object.keys(searchParams).length > 0 && '(Applied)'}
              </div>
            </div>
          ) : (columnOne)}
          {/* {columnOne} */}
          <div className="hidden md:flex justify-end mt-1">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                const newState = !isCollapsed;
                setIsCollapsed(newState);
                localStorage.setItem('fold_filter', newState.toString());
                window.dispatchEvent(new Event('storage'));
              }}
              data-testid="fold-filter-toggle"
              suppressHydrationWarning={true}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" data-testid="ChevronRightIcon" /> : <ChevronLeft className="h-4 w-4" data-testid="ChevronLeftIcon" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full space-y-3">
          {columnTwo}
        </div>
      </div>
    </>
  );
}