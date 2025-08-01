import * as React from "react"
import { cn } from "@/lib/utils"

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse"
  spacing?: number | string
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean
  divider?: React.ReactNode
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    className, 
    direction = "column", 
    spacing = 1, 
    align, 
    justify, 
    wrap = false,
    divider,
    children,
    ...restProps 
  }, ref) => {
    // Remove any non-DOM props that might have been passed
    const {
      alignItems,
      justifyContent,
      flexDirection,
      ...domProps
    } = restProps as any;
    const directionClasses = {
      row: "flex-row",
      column: "flex-col", 
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse"
    }

    const alignClasses = {
      start: "items-start",
      center: "items-center", 
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline"
    }

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end", 
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    }

    // Convert spacing to Tailwind gap classes
    const getSpacingClass = (spacing: number | string) => {
      if (typeof spacing === "string") return spacing
      
      // Map numbers to Tailwind spacing scale
      const spacingMap: Record<number, string> = {
        0: "gap-0",
        0.5: "gap-0.5", 
        1: "gap-1",
        1.5: "gap-1.5",
        2: "gap-2",
        2.5: "gap-2.5", 
        3: "gap-3",
        4: "gap-4",
        5: "gap-5",
        6: "gap-6",
        8: "gap-8",
        10: "gap-10",
        12: "gap-12",
        16: "gap-16",
        20: "gap-20",
        24: "gap-24"
      }
      
      return spacingMap[spacing] || "gap-4"
    }

    const stackClasses = cn(
      "flex",
      directionClasses[direction],
      getSpacingClass(spacing),
      align && alignClasses[align],
      justify && justifyClasses[justify], 
      wrap && "flex-wrap",
      className
    )

    // Handle divider rendering
    if (divider && React.Children.count(children) > 1) {
      const childrenArray = React.Children.toArray(children)
      const childrenWithDividers: React.ReactNode[] = []
      
      childrenArray.forEach((child, index) => {
        childrenWithDividers.push(child)
        if (index < childrenArray.length - 1) {
          childrenWithDividers.push(
            <div key={`divider-${index}`} className="flex-shrink-0">
              {divider}
            </div>
          )
        }
      })
      
      return (
        <div ref={ref} className={stackClasses} {...domProps}>
          {childrenWithDividers}
        </div>
      )
    }

    return (
      <div ref={ref} className={stackClasses} {...domProps}>
        {children}
      </div>
    )
  }
)

Stack.displayName = "Stack"

export { Stack }