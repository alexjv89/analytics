'use client';

export default function SettingsContainer({ columnOne, columnTwo }) {
    return (
        <div className="flex gap-4 pt-2">
            <div className="flex-shrink-0">
                {columnOne}
            </div>
            <div className="flex-1 max-w-4xl">
                {columnTwo}
            </div>
        </div>
    )
}