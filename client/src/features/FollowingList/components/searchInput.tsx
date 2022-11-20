import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import React from 'react';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 fill-label" />
      </div>
      <input
        type="text"
        id="input-group-1"
        className="bg-inputBackground border border-line text-s16 text-label rounded-2xl w-full pl-10 p-2.5 focus:outline-line focus:bg-offWhite focus:font-bold"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

SearchInput.displayName = 'SearchInput';

export default SearchInput;
