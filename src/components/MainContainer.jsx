'use client';

export default function MainContainer({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-1 flex-col space-y-1 p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}