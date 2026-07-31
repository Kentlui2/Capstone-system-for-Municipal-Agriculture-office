import { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ value, onChange, options, placeholder = 'Select...' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectOption = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 flex w-full items-center justify-between rounded border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value || placeholder}
                </span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded border border-gray-200 bg-white shadow-lg">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border-b border-gray-200 px-3 py-2 text-sm focus:outline-none"
                    />
                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-400">No matches found</li>
                        )}
                        {filteredOptions.map((option) => (
                            <li
                                key={option}
                                onClick={() => selectOption(option)}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-indigo-50"
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}