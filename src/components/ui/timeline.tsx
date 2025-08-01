"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "left" | "right" | "alternate"
}

function Timeline({ className, position = "left", children, ...props }: TimelineProps) {
  const childrenArray = React.Children.toArray(children);
  
  if (position === "alternate") {
    return (
      <div className={cn("relative", className)} {...props}>
        {/* Central timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-px" />
        
        <div className="space-y-8">
          {childrenArray.map((child, index) => (
            <div key={index} className="relative flex items-center min-h-[80px]">
              {/* Timeline dot positioned at center */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                {React.Children.toArray((child as React.ReactElement<any>).props?.children || []).find((subChild: any) => 
                  subChild?.type?.displayName === 'TimelineSeparator'
                )}
              </div>
              
              {/* Content positioned on alternating sides */}
              <div className={cn(
                "w-1/2 flex items-center",
                index % 2 === 0 ? "justify-end pr-8" : "justify-start pl-8 ml-auto"
              )}>
                <div className="w-full max-w-sm">
                  {React.Children.toArray((child as React.ReactElement<any>).props?.children || []).find((subChild: any) => 
                    subChild?.type?.displayName === 'TimelineContent'
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative space-y-6", className)} {...props}>
      {children}
    </div>
  )
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isLast?: boolean
  alternating?: boolean
  isEven?: boolean
}

function TimelineItem({ className, isLast = false, alternating = false, isEven = true, children, ...props }: TimelineItemProps) {
  // For alternating timeline, the positioning is handled by the Timeline component
  // TimelineItem just acts as a container
  return (
    <div className={cn("relative flex items-start gap-4", className)} {...props}>
      {children}
    </div>
  )
}

interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  isLast?: boolean
}

function TimelineSeparator({ className, isLast = false, children, ...props }: TimelineSeparatorProps) {
  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      {children}
    </div>
  )
}

// Add displayName for component identification
TimelineSeparator.displayName = 'TimelineSeparator'

interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "default" | "success" | "warning" | "error"
  variant?: "filled" | "outlined"
}

function TimelineDot({ 
  className, 
  color = "default", 
  variant = "filled",
  children, 
  ...props 
}: TimelineDotProps) {
  const colorClasses = {
    default: "bg-primary text-primary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
  }

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function TimelineConnector({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-0.5 h-6 bg-border mt-2", className)}
      {...props}
    />
  )
}

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  
}

function TimelineContent({ className, children, ...props }: TimelineContentProps) {
  return (
    <div className={cn("flex-1 mt-1", className)} {...props}>
      {children}
    </div>
  )
}

// Add displayName for component identification
TimelineContent.displayName = 'TimelineContent'

export {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
}