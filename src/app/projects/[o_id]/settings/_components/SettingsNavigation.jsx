'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SettingsNavigation({ params }) {
    const { o_id } = params;
    const pathname = usePathname();
    
    const Item = ({ children, href }) => {
        // For the main settings route (/settings), only match exactly
        // For sub-routes, also match create pages
        const isMainSettings = href.endsWith('/settings');
        const isSelected = isMainSettings 
            ? pathname === href 
            : pathname === href || pathname === `${href}/create`;
        
        return (
            <Link
                href={href}
                className={cn(
                    'block px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900',
                    isSelected 
                        ? 'bg-gray-100 text-gray-900 border-r-2 border-blue-500' 
                        : 'text-gray-600 hover:text-gray-900'
                )}
            >
                {children}
            </Link>
        )
    }

    return (
        <nav className="w-48 border border-gray-200 rounded-lg bg-white">
            <div className="flex flex-col">
                <Item href={`/projects/${o_id}/settings`}>General</Item>
                <Item href={`/projects/${o_id}/settings/members`}>Members</Item>
                <Item href={`/projects/${o_id}/settings/apikeys`}>API keys</Item>
            </div>
        </nav>
    )
}