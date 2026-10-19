'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  label,
  error,
  disabled = false,
  className = '',
  variant = 'light',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        const idx = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      } else if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
      return;
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const isDark = variant === 'dark';

  return (
    <div className={`relative space-y-1 w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-xs font-semibold ${
            isDark ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          {label}
        </label>
      )}

      {/* Hidden input for standard form submission */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 sm:py-3 text-sm transition-all duration-200 text-left outline-none cursor-pointer ${
          isDark
            ? 'bg-[#001237] border border-slate-700 text-white hover:border-[#4FAAA7] focus:border-[#4FAAA7]'
            : 'bg-white border border-slate-300 text-slate-900 hover:border-[#001237]/60 focus:border-[#001237] focus:ring-1 focus:ring-[#001237]'
        } ${isOpen ? (isDark ? 'border-[#4FAAA7] ring-1 ring-[#4FAAA7]' : 'border-[#001237] ring-1 ring-[#001237]') : ''} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''} shadow-xs`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedOption?.icon && (
            <span className="flex-shrink-0 text-slate-500">{selectedOption.icon}</span>
          )}
          <span className={`truncate font-medium ${!selectedOption ? 'text-slate-400' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span
              className={`hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                selectedOption.badgeColor || 'bg-slate-100 text-slate-700'
              }`}
            >
              {selectedOption.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#001237]' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 mt-1.5 rounded-2xl overflow-hidden border shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? 'bg-[#18243D] border-slate-700 text-white shadow-black/40'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/80'
          }`}
        >
          <ul
            ref={listboxRef}
            role="listbox"
            tabIndex={-1}
            className="max-h-64 overflow-y-auto p-1.5 space-y-1 focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`group flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-xs sm:text-sm ${
                    isSelected
                      ? isDark
                        ? 'bg-[#001237] text-white font-semibold'
                        : 'bg-slate-100 text-[#001237] font-semibold'
                      : isHighlighted
                      ? isDark
                        ? 'bg-slate-800/80 text-white'
                        : 'bg-slate-50 text-slate-900'
                      : isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {option.icon && (
                      <span className="flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-slate-600 transition-colors">
                        {option.icon}
                      </span>
                    )}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                        {option.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                              option.badgeColor || (isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700')
                            }`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <p
                          className={`text-[11px] leading-tight font-normal ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex-shrink-0 mt-0.5 text-[#4FAAA7]">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-xs text-rose-500 font-medium pt-0.5">{error}</p>}
    </div>
  );
}
