'use client'
import React from 'react';
import { Table as ShadcnTable } from '@/components/ui/table';
import { cn } from '@/lib/utils';

/** 
 * Custom defined table. 
 * - is scrollable 
 * - is plain and simple
 */
export default function Table({ type = 'topHeader', borderAxis, children, size = 'sm', variant = 'soft', className, hoverRow, ...props }) {
	// Map size prop to appropriate text sizes
	const sizeClasses = {
		'sm': 'text-sm',
		'md': 'text-base',
		'lg': 'text-lg'
	};
	
	// Map variant to appropriate background classes
	const variantClasses = {
		'soft': 'bg-gray-50/50',
		'outlined': 'bg-white',
		'plain': 'bg-transparent'
	};
	
	// Apply type-specific styles
	const typeClasses = type === 'sideHeader' 
		? '[&_tr>*:first-child]:bg-gray-50 [&_tr>*:first-child]:font-light [&_td]:py-2 [&_td]:px-3'
		: '';
		
	// Apply hover row styles if enabled
	const hoverRowClasses = hoverRow 
		? '[&_tbody_tr]:hover:bg-muted/50 [&_tbody_tr]:cursor-pointer'
		: '';
	
	return (
		<div className="w-full overflow-auto rounded-md border">
			<ShadcnTable
				className={cn(
					'bg-white',
					sizeClasses[size] || sizeClasses.sm,
					variantClasses[variant] || variantClasses.soft,
					typeClasses,
					hoverRowClasses,
					className
				)}
				{...props}
			>
				{children}
			</ShadcnTable>
		</div>
	)
}