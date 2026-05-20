import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchableSelect({ options, value, onChange, placeholder = "Select..." }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-64" ref={dropdownRef}>
            <div 
                className="px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-teal-400 bg-white cursor-pointer flex justify-between items-center"
                onClick={() => { setIsOpen(!isOpen); setSearch(""); }}
            >
                <span className="text-sm truncate text-gray-700">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FaChevronDown className={`text-gray-400 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-teal-400"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-60 overflow-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <li
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-teal-50 ${opt.value === value ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700'}`}
                                >
                                    {opt.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-gray-500 text-center">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
