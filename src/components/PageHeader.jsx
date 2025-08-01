'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';

import { Typography } from '@/components/ui/typography';

export default function PageHeader({ 
  header = "PageHeader", 
  RightButtons = null, 
  level = 'h3', 
  headerLevel = null, 
  width = '100%' 
}) {
  if (headerLevel) {
    level = headerLevel;
  }

  const renderHeader = () => {
    if (React.isValidElement(header)) {
      return header;  // Return React component as is
    } else if (typeof header === 'string') {
      return <Typography level={level}>{header}</Typography>
    } else if (typeof header === 'object') {
      const headerParts = Object.values(header);
      return (
        <Typography level={level}>
          {headerParts.length === 1 ? (
            <span>
              {headerParts[0]}
            </span>
          ) : (
            headerParts.map((part, index) => (
              <span key={index} className={index === 1 ? 'opacity-100' : 'opacity-50'}>
                {part}{index < headerParts.length - 1 && ' '}
              </span>
            ))
          )}
        </Typography>
      )
    }
    return null;
  };

  return (
    <div
      data-testid='page-header'
      data-cy='page-header'
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2"
      )}
      style={{ width: width }}
    >
      <div className="flex-1">
        {renderHeader()}
      </div>
      {RightButtons && (
        <div className="flex-none w-auto">
          {typeof RightButtons === 'function' ? <RightButtons /> : RightButtons}
        </div>
      )}
    </div>
  )
}

PageHeader.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.element
  ]).isRequired,
  level: PropTypes.string,
  headerLevel: PropTypes.string,
  RightButtons: PropTypes.func,
  width: PropTypes.string,
};